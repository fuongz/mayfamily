import { useEffect, useRef, type ReactNode, type RefObject } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

/**
 * 1 normally, 0 once mounted with reduced motion. Server and first client
 * render always see 1, so markup matches; the effect then switches it off.
 */
function useMotionEnabled() {
  const reduceMotion = useReducedMotion()
  const enabled = useMotionValue(1)
  useEffect(() => {
    enabled.set(reduceMotion ? 0 : 1)
  }, [enabled, reduceMotion])
  return enabled
}

/**
 * Scroll progress (0 → 1) of `target` from when its top meets the viewport top
 * until its bottom leaves it — the usual range for a hero that scrolls away.
 */
export function useScrollAway(target: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] })
  return scrollYProgress
}

export type ParallaxLayerProps = {
  /** Shared progress, e.g. from `useScrollAway(heroRef)`. */
  progress: MotionValue<number>
  /** Pixels the layer drifts down by the end; larger = feels closer to the viewer. */
  distance: number
  /** Fade out while scrolling away. */
  fade?: boolean
  className?: string
  children: ReactNode
}

/**
 * One depth layer of a hero: drifts down slower than the page scrolls, so
 * layers with different `distance` separate into depth. Transform/opacity only;
 * disabled for reduced motion.
 */
export function ParallaxLayer({ progress, distance, fade = false, className, children }: ParallaxLayerProps) {
  const enabled = useMotionEnabled()
  const transform = useTransform([progress, enabled], ([p, on]: number[]) => `translateY(${p * distance * on}px)`)
  const opacity = useTransform([progress, enabled], ([p, on]: number[]) =>
    fade && on ? 1 - Math.min(1, Math.max(0, p / 0.7)) : 1
  )
  return (
    <motion.div className={className} style={{ transform, opacity }}>
      {children}
    </motion.div>
  )
}

export type ParallaxProps = {
  /** Pixels of drift on each side of the resting position while the element crosses the viewport. */
  distance?: number
  className?: string
  children: ReactNode
}

/**
 * Drifts its content from +distance to -distance as it crosses the viewport,
 * so it moves a little slower than the page. Disabled for reduced motion.
 */
export function Parallax({ distance = 40, className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = useMotionEnabled()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const transform = useTransform(
    [scrollYProgress, enabled],
    ([p, on]: number[]) => `translateY(${(1 - 2 * p) * distance * on}px)`
  )
  return (
    <motion.div ref={ref} className={className} style={{ transform }}>
      {children}
    </motion.div>
  )
}
