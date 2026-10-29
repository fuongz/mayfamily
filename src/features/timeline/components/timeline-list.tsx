import { useEffect, useRef, type RefObject } from "react"
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

import { formatCatalogueNumber } from "@/components/common"
import { useTimelineStatus } from "@/hooks/use-timeline-status"
import { cn } from "@/lib/utils"
import type { TimelineEntry } from "@/types"

import { dateParts } from "./format"
import { TimelineEntryCard } from "./timeline-entry-card"

/*
 * Newest moment on top, oldest at the bottom, each with its catalogue number
 * (chronological: the oldest is No. 01). The spine is a 1px rule: solid between
 * two moments that have already happened (it draws itself in as it scrolls
 * into view), dashed from a moment still ahead. Markers are black squares; a
 * wedding is a red diamond, the only colour on the wall besides the photos.
 * Every marker is centred 1.75rem from the item top.
 *
 * Scrolling stacks the pages like an album: each item is sticky, the next one
 * slides over it, and the covered page settles back (scale + dim) with its
 * date and thread fading out. An item taller than the viewport (an open
 * invitation) only sticks once its bottom is in view, so nothing is hidden
 * before it has been read.
 */

const columns = "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 lg:grid-cols-[8rem_3rem_minmax(0,1fr)] lg:gap-x-5"
const spineColumn = "relative col-start-1 row-start-1 lg:col-start-2"

/** First sticky offset (clears the fixed music button) and how much each older page peeks out. */
const STACK_TOP_REM = 5
const STACK_STEP_REM = 0.75
/** Space kept under a tall item when it sticks by its bottom edge. */
const STACK_BOTTOM_REM = 1.5

function Marker({ entry, past }: { entry: TimelineEntry; past: boolean }) {
  if (entry.kind === "wedding") {
    return (
      <span
        className={cn(
          "absolute top-[1.3125rem] left-1/2 size-3.5 -translate-x-1/2 rotate-45 ring-4 ring-background",
          past ? "bg-mark" : "border border-mark bg-background"
        )}
      />
    )
  }
  return (
    <span
      className={cn(
        "absolute top-6 left-1/2 size-2.5 -translate-x-1/2 ring-4 ring-background",
        past ? "bg-foreground" : "border border-foreground bg-background"
      )}
    />
  )
}

/** Exposes the element's height as --item-h so its sticky `top` can account for it. */
function useItemHeightVar(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      el.style.setProperty("--item-h", `${entry.borderBoxSize[0].blockSize}px`)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

/**
 * 0 → 1 while the next (older) item slides over this one: 0 when its top meets
 * this item's bottom, 1 when it reaches its own sticky position. Read from the
 * rendered rects, so it stays correct while items are stuck.
 */
function useCoverProgress(
  selfRef: RefObject<HTMLElement | null>,
  nextRef: RefObject<HTMLElement | null> | undefined
): MotionValue<number> {
  const progress = useMotionValue(0)
  const { scrollY } = useScroll()

  const update = () => {
    const self = selfRef.current
    const next = nextRef?.current
    if (!self || !next) return
    const bottom = self.getBoundingClientRect().bottom
    const stickTop = Number.parseFloat(getComputedStyle(next).top) || 0
    const overlap = bottom - next.getBoundingClientRect().top
    progress.set(Math.min(1, Math.max(0, overlap / Math.max(1, bottom - stickTop))))
  }

  useMotionValueEvent(scrollY, "change", update)
  useEffect(update)

  return progress
}

type TimelineItemProps = {
  entry: TimelineEntry
  older?: TimelineEntry
  index: number
  /** Catalogue number, chronological (oldest = 1). */
  number: number
  itemRef: RefObject<HTMLLIElement | null>
  olderRef?: RefObject<HTMLLIElement | null>
}

function TimelineItem({ entry, older, index, number, itemRef, olderRef }: TimelineItemProps) {
  const status = useTimelineStatus(entry.date)
  const past = status.status === "past"
  const { day, month, year } = dateParts(entry.date)
  const reduceMotion = useReducedMotion()

  useItemHeightVar(itemRef)
  const covered = useCoverProgress(itemRef, olderRef)
  // Reduced motion keeps the stack (no movement involved) but drops the settle-back.
  const pageTransform = useTransform(covered, [0, 1], ["scale(1)", reduceMotion ? "scale(1)" : "scale(0.94)"])
  const shade = useTransform(covered, [0, 1], [0, 1])
  const asideOpacity = useTransform(covered, [0, 0.5], [1, 0])

  const top = `min(${STACK_TOP_REM + index * STACK_STEP_REM}rem, calc(100svh - var(--item-h, 0px) - ${STACK_BOTTOM_REM}rem))`

  return (
    <li ref={itemRef} className={cn(columns, "sticky pb-12 sm:pb-16")} style={{ top }}>
      {/* Thread segment down to the older marker; the oldest moment ends the thread. */}
      <motion.div aria-hidden className={spineColumn} style={{ opacity: asideOpacity }}>
        {older &&
          (past ? (
            <motion.span
              className="absolute top-7 -bottom-7 left-1/2 w-px -translate-x-1/2 origin-top bg-foreground"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <span className="absolute top-7 -bottom-7 left-1/2 -translate-x-1/2 border-l border-dashed border-foreground/40" />
          ))}
        <Marker entry={entry} past={past} />
      </motion.div>

      {/* Date, wide screens only (the card carries it on mobile). */}
      <motion.div
        aria-hidden
        className="hidden pt-2 text-right lg:col-start-1 lg:row-start-1 lg:block"
        style={{ opacity: asideOpacity }}
      >
        <p
          className={cn(
            "font-title text-6xl leading-none font-light tracking-[-0.03em] tabular-nums",
            past ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {String(day).padStart(2, "0")}
        </p>
        <p className="caption mt-2">
          Tháng {month} · {year}
        </p>
        <p className="caption mt-4 text-foreground">{formatCatalogueNumber(number)}</p>
      </motion.div>

      <motion.div
        className="col-start-2 row-start-1 origin-top lg:col-start-3"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="relative origin-top" style={{ transform: pageTransform }}>
          <TimelineEntryCard entry={entry} status={status} number={number} />
          {/* Frosts the page as the next one covers it: the blur is fixed and only the
              layer's opacity animates, so scrolling never re-rasterises the blur radius. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-background/70 backdrop-blur-[6px]"
            style={{ opacity: shade }}
          />
        </motion.div>
      </motion.div>
    </li>
  )
}

export type TimelineListProps = {
  entries: TimelineEntry[]
  className?: string
}

/** Vertical timeline of every moment, newest first. `entries` come oldest first. */
export function TimelineList({ entries, className }: TimelineListProps) {
  const newestFirst = [...entries].reverse()
  // One ref per item so each page can watch the older page sliding over it.
  const refs = useRef(new Map<string, RefObject<HTMLLIElement | null>>())
  const refFor = (slug: string) => {
    let ref = refs.current.get(slug)
    if (!ref) {
      ref = { current: null }
      refs.current.set(slug, ref)
    }
    return ref
  }

  return (
    <div className={className}>
      {/* Loose end of the thread: the pages still to come. */}
      <div className={cn(columns, "pb-4")}>
        <div aria-hidden className={cn(spineColumn, "h-24")}>
          <span className="absolute top-0 -bottom-7 left-1/2 -translate-x-1/2 border-l border-dashed border-foreground/40 [mask-image:linear-gradient(to_top,black,transparent)]" />
        </div>
        <p className="col-start-2 row-start-1 self-start pt-1 font-title text-2xl font-light text-muted-foreground italic sm:text-3xl lg:col-start-3">
          Còn nhiều trang để dành cho mai sau…
        </p>
      </div>
      <ol className="flex flex-col">
        {newestFirst.map((entry, index) => {
          const older = newestFirst[index + 1]
          return (
            <TimelineItem
              key={entry.slug}
              entry={entry}
              older={older}
              index={index}
              number={newestFirst.length - index}
              itemRef={refFor(entry.slug)}
              olderRef={older ? refFor(older.slug) : undefined}
            />
          )
        })}
      </ol>
    </div>
  )
}
