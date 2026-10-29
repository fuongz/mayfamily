import { useEffect } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"

/** easeOutCubic: counts briskly, then slows into the final number. */
const COUNT_EASE = [0.33, 1, 0.68, 1] as const

export type CountUpProps = {
  /** Integer to count up to. */
  value: number
  /** Number to start from. */
  from?: number
  /** Seconds to count from `from` to `value`. */
  duration?: number
  /** Seconds to wait after mount, e.g. until a fade-in has finished. */
  delay?: number
  className?: string
}

/**
 * Counts 1, 2, 3… up to `value` when it mounts (each route load). The text is
 * driven by a motion value, so it updates without re-rendering React; width is
 * reserved for the final number so nothing shifts while it counts. Server and
 * first client render show `from`; with reduced motion the final value shows
 * at once.
 */
export function CountUp({ value, from = 1, duration = 3, delay = 0, className }: CountUpProps) {
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(from)
  const text = useTransform(count, (latest) => Math.round(latest).toString())

  useEffect(() => {
    if (reduceMotion) {
      count.set(value)
      return
    }
    count.set(from)
    const controls = animate(count, value, { duration, delay, ease: COUNT_EASE })
    return () => controls.stop()
  }, [count, value, from, duration, delay, reduceMotion])

  return (
    <>
      {/* Screen readers get the final number once, not every step of the count. */}
      <span className="sr-only">{value}</span>
      <motion.span
        aria-hidden
        className={className}
        style={{ display: "inline-block", minWidth: `${String(value).length}ch`, textAlign: "right" }}
      >
        {text}
      </motion.span>
    </>
  )
}
