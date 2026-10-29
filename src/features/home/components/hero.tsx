import { useRef } from "react"
import { Link } from "@tanstack/react-router"
import { motion, type Variants } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown02Icon } from "@hugeicons/core-free-icons"

import { CountUp, ParallaxLayer, useScrollAway } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { formatLunarDate, formatShortDate } from "@/features/timeline/components"
import { useTimelineStatus } from "@/hooks/use-timeline-status"
import { MAY } from "@/constants/family"
import { cn } from "@/lib/utils"
import type { TimelineEntry } from "@/types"

import { MayName } from "./may-name"

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

/** One museum-label cell: caption over a figure. */
function Stat({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1 lg:items-start", className)}>
      <span className="caption">{label}</span>
      {children}
    </div>
  )
}

/** Wedding date, days together, Mây's days at home: the exhibit's label. */
function Stats({ wedding }: { wedding: TimelineEntry }) {
  const together = useTimelineStatus(wedding.date)
  const may = useTimelineStatus(MAY.arrived)
  const lunar = wedding.invitation?.date_lunar
  const number = "font-title leading-none font-light tabular-nums"
  return (
    <div className="grid w-full grid-cols-3 gap-4 hairline-t pt-6 sm:gap-8">
      <Stat label="Ngày cưới">
        <time dateTime={wedding.date.slice(0, 10)} className={cn(number, "text-2xl tracking-[0.02em] text-foreground sm:text-3xl")}>
          {formatShortDate(wedding.date)}
        </time>
        {lunar && <span className="caption text-[0.65rem]">{formatLunarDate(lunar)}</span>}
      </Stat>
      {together.status === "past" && (
        <Stat label="Đã bên nhau">
          <span className="flex items-baseline gap-1.5">
            {/* The one red number on the page. Counts 1 → N over 5s. */}
            <CountUp value={together.daysAgo} duration={5} delay={0.9} className={cn(number, "text-4xl text-mark sm:text-5xl")} />
            <span className="font-title text-muted-foreground italic">ngày</span>
          </span>
        </Stat>
      )}
      {may.status === "past" && (
        <Stat label={`${MAY.name} về nhà`}>
          <span className="flex items-baseline gap-1.5">
            <CountUp value={may.daysAgo} duration={5} delay={0.9} className={cn(number, "text-4xl text-foreground sm:text-5xl")} />
            <span className="font-title text-muted-foreground italic">ngày</span>
          </span>
        </Stat>
      )}
    </div>
  )
}

/**
 * The first page, as an exhibition poster: the family's names set large on
 * one side, on the other the exhibit itself (an ink drawing of the couple,
 * Mây at their feet) with its museum label. The drawing rises in, Mây hops
 * in after; on scroll the two sides drift apart.
 */
export function Hero({ wedding, timelineId }: { wedding?: TimelineEntry; timelineId: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const away = useScrollAway(sectionRef)

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative overflow-hidden px-5 pt-20 pb-14 sm:px-8 lg:px-12 lg:py-0"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:min-h-svh lg:grid-cols-[1.1fr_1fr] lg:gap-4">
        {/* ---- The names ---- */}
        <motion.div
          className="order-2 flex flex-col items-center gap-6 text-center lg:order-1 lg:items-start lg:text-left"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <ParallaxLayer progress={away} distance={30} fade className="flex flex-col items-center gap-5 lg:items-start">
            <motion.p variants={item} className="flex items-center gap-3">
              <span className="caption text-foreground">Triển lãm nhỏ của gia đình mình</span>
            </motion.p>

            <motion.h1
              id="hero-title"
              variants={item}
              className="flex flex-col font-title text-7xl leading-[0.86] font-light tracking-[-0.04em] text-foreground sm:text-8xl lg:text-[7.25rem] xl:text-[8rem]"
            >
              <span>Trinh</span>
              <span className="whitespace-nowrap lg:ps-[0.5em]">
                <span className="font-extralight text-muted-foreground italic">&amp; </span>Phương
              </span>
            </motion.h1>

            {/* The third member of the family. */}
            <motion.p
              variants={item}
              className="flex items-baseline gap-3 font-title text-3xl font-light text-muted-foreground italic sm:text-4xl lg:ps-[0.2em]"
            >
              <span aria-hidden>&amp;</span>
              <MayName />
            </motion.p>
          </ParallaxLayer>

          {wedding && (
            <ParallaxLayer progress={away} distance={90} fade className="w-full max-w-lg">
              <motion.div variants={item}>
                <Stats wedding={wedding} />
              </motion.div>
            </ParallaxLayer>
          )}

          <ParallaxLayer progress={away} distance={150} fade>
            <motion.div variants={item}>
              <a href={`#${timelineId}`} className={buttonVariants({ variant: "ornate", size: "lg", className: "px-4" })}>
                Lật từng trang
                <HugeiconsIcon icon={ArrowDown02Icon} strokeWidth={2} data-icon="inline-end" />
              </a>
            </motion.div>
          </ParallaxLayer>
        </motion.div>

        {/* ---- The exhibit ---- */}
        <ParallaxLayer progress={away} distance={-60} className="order-1 lg:order-2">
          <Exhibit />
        </ParallaxLayer>
      </div>
    </section>
  )
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Rises in on mount; `delay` staggers the figures. */
function riseIn(delay: number) {
  return {
    initial: { opacity: 0, transform: "translateY(24px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 1, ease: EASE, delay },
  } as const
}

/**
 * The exhibit: the three of them drawn in ink, side by side.
 * The couple rise in one after the other, Mây hops in
 * last; she waves on hover and opens her page.
 */
function Exhibit() {
  return (
    <div className="relative mx-auto flex w-full max-w-[26rem] flex-col sm:max-w-[30rem] lg:max-w-[38rem]">
      <div className="relative flex h-[50svh] items-end justify-center lg:h-[72svh]">
        <motion.img
          src="/images/hero/bride.webp"
          alt="Tranh mực: Trinh trong váy cưới"
          decoding="async"
          fetchPriority="high"
          className="relative z-10 h-[94%] w-auto max-w-[64%] object-contain object-bottom"
          {...riseIn(0.2)}
        />
        <motion.img
          src="/images/hero/groom.webp"
          alt="Tranh mực: Phương trong bộ vest"
          decoding="async"
          fetchPriority="high"
          className="relative -ms-[7%] h-full w-auto max-w-[32%] object-contain object-bottom"
          {...riseIn(0.4)}
        />

        <motion.div
          className="absolute right-0 bottom-0 z-20 w-[30%] sm:right-[-8%] lg:right-[-12%]"
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ type: "spring", duration: 0.7, bounce: 0.35, delay: 1.2 }}
        >
          <Link
            to="/ky-niem/$slug"
            params={{ slug: MAY.slug }}
            aria-label={`${MAY.name}: xem ngày ${MAY.name} về nhà`}
            className="group/cat block rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {/* Sitting; on hover/focus she lifts a paw and waves (the two drawings swap). */}
            <span className="relative block origin-bottom transition-transform duration-200 ease-album group-hover/cat:-translate-y-[4%] group-focus-visible/cat:-translate-y-[4%] motion-reduce:transition-none">
              <img
                src="/images/hero/may.webp"
                alt=""
                decoding="async"
                className="w-full transition-opacity duration-150 group-hover/cat:opacity-0 group-focus-visible/cat:opacity-0"
              />
              <img
                src="/images/hero/may-wave.webp"
                alt=""
                decoding="async"
                className="absolute inset-0 w-full opacity-0 transition-opacity duration-150 group-hover/cat:opacity-100 group-focus-visible/cat:opacity-100"
              />
            </span>
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
