import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { Ornament, formatCatalogueNumber } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Dialog, DialogPortal } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { mod } from "./ring-geometry"
import type { RingPhoto } from "./types"

export type PhotoViewerProps = {
  photos: RingPhoto[]
  /** Index of the photo shown. */
  index: number
  open: boolean
  /** Heading of the viewer, e.g. the album title. */
  title: string
  onIndexChange: (index: number) => void
  /** Fires once the close transition has finished. */
  onClose: () => void
  /** Element the photo flies out of on open and back into on close. */
  getOriginElement?: (index: number) => HTMLElement | null
  /** Element focused after closing (defaults to the previously focused one). */
  getReturnFocusElement?: (index: number) => HTMLElement | null
}

/** The project's album curve (`--ease-album`). */
const EASE_ALBUM = [0.22, 1, 0.36, 1] as const
const FLIGHT_IN_S = 0.5
const FLIGHT_OUT_S = 0.42
const IDENTITY = "translate(0px, 0px) scale(1)"
const NO_CLIP = "inset(0px 0px 0px 0px)"
/** Portrait prints until the real ratio is known. */
const FALLBACK_RATIO = 2 / 3

function pad(value: number) {
  return String(value).padStart(2, "0")
}

/**
 * Transform + clip that make the viewer's photo box (`to`) cover exactly the
 * origin rect (`from`): uniform scale, cropped to the origin's aspect, so the
 * photo never stretches mid-flight.
 */
function flightFrom(from: DOMRect, to: DOMRect) {
  const scale = Math.max(from.width / to.width, from.height / to.height)
  const x = from.left + from.width / 2 - (to.left + to.width / 2)
  const y = from.top + from.height / 2 - (to.top + to.height / 2)
  const insetX = Math.max(0, (to.width - from.width / scale) / 2)
  const insetY = Math.max(0, (to.height - from.height / scale) / 2)
  return {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    clipPath: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px)`,
  }
}

/**
 * Expanded photo: large framed print on the left, counter, title and
 * Prev / Next / Close on the right, thumbnail strip along the bottom.
 * Built on the Base UI Dialog (focus trap, scroll lock, Esc, a11y).
 */
export function PhotoViewer(props: PhotoViewerProps) {
  const { open, onClose, index, getReturnFocusElement } = props
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const exitRef = useRef<(() => Promise<void>) | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    closingRef.current = false
    setClosing(false)
  }, [open])

  const requestClose = useCallback(async () => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    try {
      await exitRef.current?.()
    } finally {
      onClose()
    }
  }, [onClose])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) void requestClose()
      }}
    >
      <DialogPortal>
        <DialogPrimitive.Popup
          ref={popupRef}
          data-slot="photo-viewer"
          initialFocus={popupRef}
          finalFocus={() => getReturnFocusElement?.(index) ?? true}
          className={cn(
            "fixed inset-0 z-50 flex flex-col text-foreground outline-none",
            // Room left for the photo once the side panel and thumbnails are placed.
            "[--viewer-max-h:calc(100dvh-19rem)] [--viewer-max-w:calc(100vw-3rem)]",
            "lg:[--viewer-max-h:calc(100dvh-13rem)] lg:[--viewer-max-w:calc(100vw-34rem)]"
          )}
        >
          <MotionConfig reducedMotion="user">
            <ViewerContent {...props} closing={closing} exitRef={exitRef} onRequestClose={requestClose} />
          </MotionConfig>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}

type ViewerContentProps = PhotoViewerProps & {
  closing: boolean
  exitRef: RefObject<(() => Promise<void>) | null>
  onRequestClose: () => void
}

const fade: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2, ease: EASE_ALBUM } },
  shown: { opacity: 1, transition: { duration: 0.25, ease: EASE_ALBUM } },
}

const rise: Variants = {
  hidden: { opacity: 0, transform: "translateY(10px)", transition: { duration: 0.16, ease: EASE_ALBUM } },
  shown: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.3, delay: 0.12, ease: EASE_ALBUM },
  },
}

function ViewerContent({
  photos,
  index,
  title,
  closing,
  exitRef,
  onIndexChange,
  onRequestClose,
  getOriginElement,
}: ViewerContentProps) {
  const reduceMotion = useReducedMotion()
  const count = photos.length
  const photo = photos[Math.min(Math.max(index, 0), count - 1)]
  const boxRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(index)
  indexRef.current = index

  // Aspect ratios learnt from loaded images (ring card, thumbnails, the photo itself).
  const ratios = useRef(new Map<string | number, number>())
  const [, setRatioVersion] = useState(0)
  const learnRatio = useCallback((id: string | number, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return
    const ratio = img.naturalWidth / img.naturalHeight
    if (ratios.current.get(id) === ratio) return
    ratios.current.set(id, ratio)
    setRatioVersion((v) => v + 1)
  }, [])
  // The ring card's image is already loaded: size the box right from the first frame.
  if (!ratios.current.has(photo.id)) {
    const originImg = getOriginElement?.(index)?.querySelector("img")
    if (originImg?.naturalWidth) ratios.current.set(photo.id, originImg.naturalWidth / originImg.naturalHeight)
  }
  const ratio = ratios.current.get(photo.id) ?? FALLBACK_RATIO

  const goTo = useCallback((next: number) => onIndexChange(mod(next, count)), [count, onIndexChange])
  const previous = useCallback(() => goTo(indexRef.current - 1), [goTo])
  const next = useCallback(() => goTo(indexRef.current + 1), [goTo])

  // Fly in from the ring card.
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    box.style.transform = ""
    box.style.clipPath = ""
    const origin = getOriginElement?.(indexRef.current)
    if (reduceMotion || !origin) {
      const fadeIn = animate(box, { opacity: [0, 1] }, { duration: 0.2, ease: EASE_ALBUM })
      return () => fadeIn.stop()
    }
    const from = flightFrom(origin.getBoundingClientRect(), box.getBoundingClientRect())
    box.style.transform = from.transform
    box.style.clipPath = from.clipPath
    const flight = animate(
      box,
      { transform: [from.transform, IDENTITY], clipPath: [from.clipPath, NO_CLIP] },
      { duration: FLIGHT_IN_S, ease: EASE_ALBUM }
    )
    flight.then(() => {
      box.style.clipPath = ""
    })
    return () => flight.stop()
    // Mount only: later index changes swap the photo in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fly back into the ring card (or fade) before the dialog unmounts.
  useEffect(() => {
    exitRef.current = async () => {
      const box = boxRef.current
      if (!box) return
      const origin = getOriginElement?.(indexRef.current)
      if (reduceMotion || !origin) {
        await animate(box, { opacity: 0 }, { duration: 0.18, ease: EASE_ALBUM })
        return
      }
      box.style.transform = ""
      box.style.clipPath = ""
      const from = flightFrom(origin.getBoundingClientRect(), box.getBoundingClientRect())
      await animate(
        box,
        { transform: [IDENTITY, from.transform], clipPath: [NO_CLIP, from.clipPath] },
        { duration: FLIGHT_OUT_S, ease: EASE_ALBUM }
      )
    }
    return () => {
      exitRef.current = null
    }
  }, [exitRef, getOriginElement, reduceMotion])

  // ←/→ anywhere in the viewer. Capture phase: the Base UI popup stops arrow keys bubbling.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (closing) return
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        previous()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        next()
      }
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [closing, next, previous])

  const state = closing ? "hidden" : "shown"
  const boxStyle: CSSProperties = {
    aspectRatio: ratio,
    width: `min(var(--viewer-max-w), calc(var(--viewer-max-h) * ${ratio}))`,
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-background"
        variants={fade}
        initial="hidden"
        animate={state}
      />

      <div className="relative flex min-h-0 flex-1 flex-col gap-5 px-6 pt-6 lg:flex-row lg:gap-12 lg:px-12 lg:pt-12">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="relative">
            {/* A hairline frame appears around the photo once it has landed. */}
            <motion.div
              aria-hidden="true"
              className="absolute -inset-2 hairline sm:-inset-3"
              variants={rise}
              initial="hidden"
              animate={state}
            />
            <div ref={boxRef} style={boxStyle} className="relative overflow-hidden bg-muted">
              <AnimatePresence initial={false}>
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: EASE_ALBUM }}
                >
                  <ViewerImage photo={photo} onRatio={learnRatio} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.aside
          variants={rise}
          initial="hidden"
          animate={state}
          className="flex shrink-0 items-end justify-between gap-4 lg:w-80 lg:flex-col lg:items-start lg:justify-center lg:gap-6"
        >
          <div className="flex min-w-0 flex-col gap-1 lg:gap-4">
            <p className="caption">
              <span className="sr-only" aria-live="polite">{`Ảnh ${index + 1} trên ${count}`}</span>
              <span aria-hidden="true">
                <span className="text-foreground">{formatCatalogueNumber(pad(index + 1))}</span>
                <span className="px-2 text-rule">/</span>
                {pad(count)}
              </span>
            </p>
            <DialogPrimitive.Title className="line-clamp-2 font-title text-2xl leading-[1.05] font-light tracking-[-0.02em] text-balance lg:line-clamp-4 lg:text-5xl">
              {title}
            </DialogPrimitive.Title>
            <Ornament variant="divider" className="w-16 max-lg:hidden" />
            <p className="caption max-lg:hidden">
              ← → lật ảnh · Esc đóng
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ViewerButton label="Ảnh trước" onClick={previous}>
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </ViewerButton>
            <ViewerButton label="Ảnh tiếp theo" onClick={next}>
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </ViewerButton>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ornate"
                    size="lg"
                    aria-label="Đóng"
                    onClick={onRequestClose}
                    className="size-11 px-0 lg:ms-2 lg:w-auto lg:px-4"
                  />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} data-icon="inline-start" />
                <span className="max-lg:sr-only">Đóng</span>
              </TooltipTrigger>
              <TooltipContent>Đóng (Esc)</TooltipContent>
            </Tooltip>
          </div>
        </motion.aside>
      </div>

      <motion.div variants={fade} initial="hidden" animate={state} className="relative flex shrink-0 justify-center px-4 py-4 lg:px-12 lg:py-6">
        <Thumbnails photos={photos} index={index} onSelect={goTo} onRatio={learnRatio} />
      </motion.div>
    </>
  )
}

function ViewerImage({
  photo,
  onRatio,
}: {
  photo: RingPhoto
  onRatio: (id: string | number, img: HTMLImageElement) => void
}) {
  const [largeLoaded, setLargeLoaded] = useState(false)
  const large = photo.largeSrc && photo.largeSrc !== photo.src ? photo.largeSrc : null

  return (
    <>
      <img
        src={photo.src}
        alt={photo.alt}
        decoding="async"
        draggable={false}
        ref={(img) => {
          if (img?.complete) onRatio(photo.id, img)
        }}
        onLoad={(event) => onRatio(photo.id, event.currentTarget)}
        className="absolute inset-0 size-full object-cover"
      />
      {large && (
        <img
          src={large}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0) setLargeLoaded(true)
          }}
          onLoad={() => setLargeLoaded(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
            largeLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </>
  )
}

function Thumbnails({
  photos,
  index,
  onSelect,
  onRatio,
}: {
  photos: RingPhoto[]
  index: number
  onSelect: (index: number) => void
  onRatio: (id: string | number, img: HTMLImageElement) => void
}) {
  const reduceMotion = useReducedMotion()
  const items = useRef<Array<HTMLButtonElement | null>>([])
  const first = useRef(true)

  useEffect(() => {
    items.current[index]?.scrollIntoView({
      behavior: first.current || reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    })
    first.current = false
  }, [index, reduceMotion])

  return (
    <div
      role="group"
      aria-label="Chọn ảnh"
      className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain px-1 py-2 [scrollbar-width:none] sm:gap-3"
    >
      {photos.map((photo, i) => (
        <button
          key={`${photo.id}-${i}`}
          ref={(el) => {
            items.current[i] = el
          }}
          type="button"
          aria-label={`Ảnh ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => onSelect(i)}
          className={cn(
            "relative h-16 w-11 shrink-0 overflow-hidden bg-muted opacity-45 ring-offset-2 ring-offset-background outline-none transition-opacity duration-200 hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/60 lg:h-20 lg:w-14",
            "aria-[current=true]:opacity-100 aria-[current=true]:ring-1 aria-[current=true]:ring-foreground"
          )}
        >
          <img
            src={photo.src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={(event) => onRatio(photo.id, event.currentTarget)}
            className="size-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}

function ViewerButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ornate"
            size="icon-lg"
            aria-label={label}
            onClick={onClick}
            className="size-11 border-rule hover:border-foreground"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
