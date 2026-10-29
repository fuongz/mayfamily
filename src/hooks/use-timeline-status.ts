import { useEffect, useState } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import { TIMELINE_TIMEZONE } from "@/constants/timeline"

dayjs.extend(utc)
dayjs.extend(timezone)

export type TimelineStatus = "past" | "upcoming"

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** Milliseconds left; 0 once the moment has arrived. */
  totalMs: number
}

export type TimelineStatusResult = {
  status: TimelineStatus
  /** Whole days since the date (0 on the day itself and for upcoming dates). */
  daysAgo: number
  /** Whole days until the date (0 for past dates). */
  daysUntil: number
  /** Live countdown for upcoming dates; null for past dates. */
  countdown: Countdown | null
  /**
   * false during SSR and the hydration render, when values are computed at day
   * precision (countdown hours/minutes/seconds are 0). true once ticking.
   */
  live: boolean
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * Past/upcoming status of a timeline date (read in Asia/Ho_Chi_Minh).
 *
 * The first render (server + hydration) only uses calendar days, so server and
 * client agree except within the seconds around midnight. After mount it ticks
 * every second while the date is upcoming, and flips to "past" when it arrives.
 */
export function useTimelineStatus(date: string): TimelineStatusResult {
  const [now, setNow] = useState<number | null>(null)

  const target = dayjs.tz(date, TIMELINE_TIMEZONE)
  const targetMs = target.valueOf()

  useEffect(() => {
    setNow(Date.now())
    if (targetMs <= Date.now()) return
    const id = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= targetMs) window.clearInterval(id)
    }, SECOND)
    return () => window.clearInterval(id)
  }, [targetMs])

  if (now === null) {
    const today = dayjs().tz(TIMELINE_TIMEZONE).startOf("day")
    const targetDay = target.startOf("day")
    const diff = targetDay.diff(today, "day")
    const status: TimelineStatus = diff > 0 ? "upcoming" : "past"
    return {
      status,
      daysAgo: status === "past" ? -diff : 0,
      daysUntil: status === "upcoming" ? diff : 0,
      countdown:
        status === "upcoming"
          ? { days: diff, hours: 0, minutes: 0, seconds: 0, totalMs: diff * DAY }
          : null,
      live: false,
    }
  }

  const remaining = targetMs - now
  if (remaining <= 0) {
    const daysAgo = dayjs(now)
      .tz(TIMELINE_TIMEZONE)
      .startOf("day")
      .diff(target.startOf("day"), "day")
    return { status: "past", daysAgo, daysUntil: 0, countdown: null, live: true }
  }

  return {
    status: "upcoming",
    daysAgo: 0,
    daysUntil: Math.ceil(remaining / DAY),
    countdown: {
      days: Math.floor(remaining / DAY),
      hours: Math.floor((remaining % DAY) / HOUR),
      minutes: Math.floor((remaining % HOUR) / MINUTE),
      seconds: Math.floor((remaining % MINUTE) / SECOND),
      totalMs: remaining,
    },
    live: true,
  }
}
