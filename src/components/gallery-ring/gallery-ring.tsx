import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react"
import {
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { PhotoViewer } from "./photo-viewer"
import { RingCard } from "./ring-card"
import {
  RING_GAP_RATIO,
  RING_PRELOAD_SLOTS,
  RING_RADIUS_FACTOR,
  RING_VISIBLE_SLOTS,
  cardTransform,
  loopDistance,
  mod,
  nearestPosition,
  ringSlotCount,
  ringTransform,
} from "./ring-geometry"
import type { RingPhoto } from "./types"

export type GalleryRingProps = {
  photos: RingPhoto[]
  /** Album title: names the ring for assistive tech and heads the viewer. */
  title: string
  /**
   * Scroll-linked turning, 0..1 from the first photo to the last (the home
   * page pins the ring and turns it as you scroll). Drag, keys and buttons
   * still work; the next scroll step takes over again.
   */
  scrollProgress?: MotionValue<number>
  className?: string
}

/** Pointer travel before a press becomes a drag (and stops being a click). */
const DRAG_THRESHOLD_PX = 6
/** Velocity is measured over the last stretch of the drag. */
const VELOCITY_WINDOW_MS = 100
/** How far a flick carries: projected offset = offset + velocity * this. */
const FLICK_PROJECTION_S = 0.3
/** Upper bound on cards travelled by one flick. */
const MAX_FLICK_CARDS = 8
/** Idle time after the last horizontal wheel event before snapping. */
const WHEEL_SETTLE_MS = 140
/** Critically damped: lands on the card without overshoot, keeps release velocity. */
const SNAP_SPRING = { type: "spring", stiffness: 170, damping: 26, restDelta: 0.001 } as const

function pad(value: number) {
  return String(value).padStart(2, "0")
}

/**
 * Photos on a 3D ring seen slightly from above. Drag, flick, scroll sideways,
 * use ←/→ or the buttons to turn it; it always settles on a card. Clicking a
 * card (or Enter on the focused ring) lifts the photo into PhotoViewer.
 */
export function GalleryRing({ photos, title, scrollProgress, className }: GalleryRingProps) {
  const count = photos.length
  const slots = ringSlotCount(count)

  /** Continuous ring position, in cards. 3 = card 3 faces the viewer. */
  const offset = useMotionValue(0)
  const ringStyleTransform = useTransform(offset, ringTransform)

  const reduceMotion = useReducedMotion()
  const reduceRef = useRef(false)
  useEffect(() => {
    reduceRef.current = Boolean(reduceMotion)
  }, [reduceMotion])

  const viewportRef = useRef<HTMLDivElement>(null)
  const cardEls = useRef<Array<HTMLButtonElement | null>>([])
  const photoEls = useRef<Array<HTMLSpanElement | null>>([])
  const animation = useRef<AnimationPlaybackControls | null>(null)
  const target = useRef(0)

  // Where each card was put and whether it shows, as written to the DOM.
  const initialLayout = useMemo(() => {
    const positions = Array.from({ length: slots }, (_, slot) => nearestPosition(slot, 0, slots))
    return {
      positions,
      visible: positions.map((position) => Math.abs(position) <= RING_VISIBLE_SLOTS),
    }
  }, [slots])
  const layout = useRef({ positions: [...initialLayout.positions], visible: [...initialLayout.visible] })
  useEffect(() => {
    layout.current = { positions: [...initialLayout.positions], visible: [...initialLayout.visible] }
  }, [initialLayout])

  const [activeSlot, setActiveSlot] = useState(0)
  const [loadedSlots, setLoadedSlots] = useState<ReadonlySet<number>>(
    () => new Set(Array.from({ length: slots }, (_, s) => s).filter((s) => loopDistance(s, 0, slots) <= RING_PRELOAD_SLOTS))
  )

  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  /** Ring slot the viewer's photo belongs to (hidden on the ring while it is out). */
  const [liftedSlot, setLiftedSlot] = useState<number | null>(null)
  const liftedSlotRef = useRef<number | null>(null)

  // Move cards between copies and show/hide them as the ring turns. Writes
  // only when something changes, and only transform/visibility.
  useMotionValueEvent(offset, "change", (value) => {
    if (slots === 0) return
    const { positions, visible } = layout.current
    for (let slot = 0; slot < slots; slot++) {
      const card = cardEls.current[slot]
      if (!card) continue
      const position = nearestPosition(slot, value, slots)
      if (position !== positions[slot]) {
        positions[slot] = position
        card.style.transform = cardTransform(position)
      }
      const show = Math.abs(position - value) <= RING_VISIBLE_SLOTS
      if (show !== visible[slot]) {
        visible[slot] = show
        card.style.visibility = show ? "" : "hidden"
      }
    }
    setActiveSlot(mod(Math.round(value), slots))
  })

  useEffect(() => {
    setLoadedSlots((prev) => {
      let next: Set<number> | null = null
      for (let slot = 0; slot < slots; slot++) {
        if (prev.has(slot) || loopDistance(slot, activeSlot, slots) > RING_PRELOAD_SLOTS) continue
        next ??= new Set(prev)
        next.add(slot)
      }
      return next ?? prev
    })
  }, [activeSlot, slots])

  useEffect(() => () => animation.current?.stop(), [])

  // Full bleed without a horizontal scrollbar: 100vw includes a classic
  // vertical scrollbar, the root's clientWidth does not.
  const bleedRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = bleedRef.current
    if (!element) return
    const root = document.documentElement
    const update = () => element.style.setProperty("--bleed-w", `${root.clientWidth}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    return () => observer.disconnect()
  }, [count > 0])

  /** Card pitch in px at the front of the ring (where offset maps 1:1 to the pointer). */
  const cardPitch = useCallback(() => {
    const width = cardEls.current.find(Boolean)?.offsetWidth ?? 200
    return width * (1 + RING_GAP_RATIO)
  }, [])

  const settle = useCallback(
    (to: number, velocity = 0) => {
      animation.current?.stop()
      target.current = to
      if (reduceRef.current) {
        offset.jump(to)
        return
      }
      animation.current = animate(offset, to, { ...SNAP_SPRING, velocity })
    },
    [offset]
  )

  const jump = useCallback(
    (to: number) => {
      animation.current?.stop()
      target.current = to
      offset.jump(to)
    },
    [offset]
  )

  const step = useCallback(
    (direction: 1 | -1) => {
      const current = offset.get()
      // Repeated presses stack on the pending target instead of the moving value.
      const base = Math.abs(current - target.current) < 1 ? target.current : Math.round(current)
      settle(base + direction)
    },
    [offset, settle]
  )

  // ---- Scroll-linked turning ----------------------------------------------

  // Steps card by card (rounded), so the ring always rests on a photo.
  const noProgress = useMotionValue(0)
  const scrollCard = useRef(0)
  useMotionValueEvent(scrollProgress ?? noProgress, "change", (progress) => {
    if (!scrollProgress || count === 0) return
    const card = Math.round(Math.min(Math.max(progress, 0), 1) * (count - 1))
    if (card === scrollCard.current) return
    scrollCard.current = card
    // Turn the short way from wherever the ring is now (it may have been dragged).
    settle(nearestPosition(card, offset.get(), slots))
  })

  // ---- Viewer ------------------------------------------------------------

  const openSlot = useCallback(
    (slot: number) => {
      if (count === 0) return
      liftedSlotRef.current = slot
      setLiftedSlot(slot)
      setViewerIndex(slot % count)
      setViewerOpen(true)
      // Turn the clicked card to the front under the fading-in viewer, so the
      // photo flies back to the centre of the ring on close.
      settle(nearestPosition(slot, offset.get(), slots))
    },
    [count, offset, settle, slots]
  )

  const handleViewerIndex = useCallback(
    (index: number) => {
      setViewerIndex(index)
      // Hidden behind the viewer: bring that photo's card to the front at once.
      const position = nearestPosition(index, offset.get(), count)
      jump(position)
      const slot = mod(position, slots)
      liftedSlotRef.current = slot
      setLiftedSlot(slot)
    },
    [count, jump, offset, slots]
  )

  const handleViewerClose = useCallback(() => {
    // liftedSlotRef keeps the slot: the dialog reads it to return focus after this.
    setViewerOpen(false)
    setLiftedSlot(null)
  }, [])

  const originElement = useCallback(() => {
    const slot = liftedSlotRef.current
    return slot === null ? null : (photoEls.current[slot] ?? null)
  }, [])

  const returnFocusElement = useCallback(() => {
    const slot = liftedSlotRef.current
    return slot === null ? null : (cardEls.current[slot] ?? null)
  }, [])

  // ---- Drag with momentum ----------------------------------------------

  const drag = useRef<{
    pointerId: number
    startX: number
    startOffset: number
    active: boolean
    samples: Array<{ t: number; x: number }>
  } | null>(null)
  const suppressClick = useRef(false)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return
    suppressClick.current = false
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offset.get(),
      active: false,
      samples: [{ t: event.timeStamp, x: event.clientX }],
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.pointerId !== event.pointerId) return
    const dx = event.clientX - state.startX
    if (!state.active) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
      state.active = true
      animation.current?.stop()
      state.startOffset = offset.get() + dx / cardPitch()
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.dataset.dragging = ""
    }
    offset.set(state.startOffset - dx / cardPitch())
    state.samples.push({ t: event.timeStamp, x: event.clientX })
    while (state.samples.length > 2 && event.timeStamp - state.samples[0].t > VELOCITY_WINDOW_MS) {
      state.samples.shift()
    }
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.pointerId !== event.pointerId) return
    drag.current = null
    if (!state.active) return
    delete event.currentTarget.dataset.dragging
    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 80)

    const current = offset.get()
    const first = state.samples[0]
    const last = state.samples[state.samples.length - 1]
    const elapsed = last.t - first.t
    const fresh = event.timeStamp - last.t < VELOCITY_WINDOW_MS
    // px/ms -> cards/s; dragging left (negative dx) turns the ring forward.
    const velocity = elapsed > 0 && fresh ? (-(last.x - first.x) / elapsed) * (1000 / cardPitch()) : 0

    if (reduceRef.current) {
      settle(Math.round(current))
      return
    }
    const travel = Math.max(-MAX_FLICK_CARDS, Math.min(MAX_FLICK_CARDS, velocity * FLICK_PROJECTION_S))
    settle(Math.round(current + travel), velocity)
  }

  // ---- Horizontal wheel / trackpad -------------------------------------

  useEffect(() => {
    const element = viewportRef.current
    if (!element) return
    let timer: number | undefined
    const onWheel = (event: WheelEvent) => {
      // Vertical scrolling belongs to the page.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      const delta = event.deltaMode === 1 ? event.deltaX * 16 : event.deltaX
      animation.current?.stop()
      offset.set(offset.get() + delta / cardPitch())
      window.clearTimeout(timer)
      timer = window.setTimeout(() => settle(Math.round(offset.get())), WHEEL_SETTLE_MS)
    }
    element.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      element.removeEventListener("wheel", onWheel)
      window.clearTimeout(timer)
    }
  }, [cardPitch, offset, settle])

  // ---- Keyboard ----------------------------------------------------------

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      step(-1)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      step(1)
    } else if ((event.key === "Enter" || event.key === " ") && event.target === event.currentTarget) {
      event.preventDefault()
      openSlot(mod(Math.round(offset.get()), slots))
    }
  }

  // Stable per-slot ref callbacks so memoised cards don't re-render.
  const refCallbacks = useMemo(
    () =>
      Array.from({ length: slots }, (_, slot) => ({
        card: (el: HTMLButtonElement | null) => {
          cardEls.current[slot] = el
        },
        photo: (el: HTMLSpanElement | null) => {
          photoEls.current[slot] = el
        },
      })),
    [slots]
  )
  const cardStyles = useMemo(
    () =>
      initialLayout.positions.map((position, slot) => ({
        transform: cardTransform(position),
        visibility: initialLayout.visible[slot] ? undefined : ("hidden" as const),
      })),
    [initialLayout]
  )

  if (count === 0) return null

  const activeIndex = activeSlot % count

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={bleedRef}
        data-slot="gallery-ring"
        className={cn(
          // Full-bleed stage: the ring breaks out of the page column and the
          // front card is sized from the viewport; a screen tall from `sm` up
          // (phones size to the ring itself so it is not lost in empty space).
          "flex flex-col justify-center gap-5 py-6 sm:min-h-svh sm:gap-6",
          // Card width drives the whole geometry; the radius follows from it.
          // Phones: ~78% of the width. Wider: capped by height so the front
          // card (2:3) stays ~65% of the screen tall.
          "[--card-w:min(78vw,52svh)] sm:[--card-w:min(38vw,42svh)] lg:[--card-w:min(28vw,42svh)]",
          className
        )}
        style={{
          ["--ring-r" as string]: `calc(var(--card-w) * ${RING_RADIUS_FACTOR.toFixed(4)})`,
          // --bleed-w is the page width without the scrollbar, set on the
          // client; 100vw until then (identical server and client markup).
          width: "var(--bleed-w, 100vw)",
          marginInlineStart: "calc(50% - var(--bleed-w, 100vw) / 2)",
        }}
      >
        <div
          role="group"
          aria-roledescription="vòng ảnh"
          aria-label={`${title}: ${count} ảnh. Dùng phím mũi tên trái, phải để xoay, Enter để xem lớn.`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="outline-none focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-inset"
        >
          <div
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={(event) => {
              if (!suppressClick.current) return
              event.preventDefault()
              event.stopPropagation()
            }}
            className={cn(
              "relative h-[calc(var(--card-w)*2.05)] cursor-grab touch-pan-y overflow-hidden select-none data-dragging:cursor-grabbing",
              // Camera slightly above the ring: far cards rise and shrink.
              "perspective-[calc(var(--ring-r)*2.4)] perspective-origin-[50%_-35%]",
              "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
            )}
          >
            <motion.div
              className="absolute inset-x-0 top-[54%] h-0 transform-3d will-change-transform"
              style={{ transform: ringStyleTransform }}
            >
              {Array.from({ length: slots }, (_, slot) => {
                const photo = photos[slot % count]
                return (
                  <RingCard
                    key={slot}
                    photo={photo}
                    slot={slot}
                    label={`Xem lớn ảnh ${(slot % count) + 1} / ${count}`}
                    load={loadedSlots.has(slot)}
                    lifted={liftedSlot === slot}
                    style={cardStyles[slot]}
                    cardRef={refCallbacks[slot].card}
                    photoRef={refCallbacks[slot].photo}
                    onOpen={openSlot}
                  />
                )
              })}
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <RingButton label="Xoay sang ảnh trước" onClick={() => step(-1)}>
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </RingButton>
          <p className="min-w-28 text-center font-title text-xl font-light text-muted-foreground tabular-nums">
            <span className="sr-only" aria-live="polite">{`Ảnh ${activeIndex + 1} trên ${count}`}</span>
            <span aria-hidden="true">
              <span className="text-foreground">{pad(activeIndex + 1)}</span>
              <span className="px-2 text-rule">/</span>
              {pad(count)}
            </span>
          </p>
          <RingButton label="Xoay sang ảnh tiếp theo" onClick={() => step(1)}>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </RingButton>
        </div>
      </div>

      <PhotoViewer
        photos={photos}
        title={title}
        index={viewerIndex}
        open={viewerOpen}
        onIndexChange={handleViewerIndex}
        onClose={handleViewerClose}
        getOriginElement={originElement}
        getReturnFocusElement={returnFocusElement}
      />
    </MotionConfig>
  )
}

function RingButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ornate"
            size="icon-lg"
            aria-label={label}
            onClick={onClick}
            className="size-10 border-rule hover:border-foreground"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
