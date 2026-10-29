import { SlidingNumber } from "@/components/motion"
import { Badge } from "@/components/ui/badge"
import type { TimelineStatusResult } from "@/hooks/use-timeline-status"
import { cn } from "@/lib/utils"

/** "Đã diễn ra · 157 ngày trước" or "Sắp tới". */
export function TimelineStatusBadge({
  status,
  className,
}: {
  status: TimelineStatusResult
  className?: string
}) {
  if (status.status === "upcoming") {
    return (
      <Badge className={cn("h-auto min-h-6 whitespace-normal rounded-none bg-foreground px-2.5 text-[0.6875rem] tracking-[0.16em] text-background uppercase", className)}>
        Sắp tới
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className={cn("h-6 rounded-none border-rule px-2.5 text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase", className)}
    >
      {status.daysAgo === 0
        ? "Đang diễn ra · hôm nay"
        : `Đã diễn ra · ${status.daysAgo} ngày trước`}
    </Badge>
  )
}

const UNITS = [
  { key: "days", label: "ngày" },
  { key: "hours", label: "giờ" },
  { key: "minutes", label: "phút" },
  { key: "seconds", label: "giây" },
] as const

/**
 * Live countdown for an upcoming moment. Digits slide; screen readers get one
 * static sentence instead of a value that changes every second.
 */
export function TimelineCountdown({
  status,
  size = "default",
  className,
}: {
  status: TimelineStatusResult
  size?: "default" | "lg"
  className?: string
}) {
  const { countdown } = status
  if (status.status !== "upcoming" || !countdown) return null

  return (
    <div className={className}>
      <p className="sr-only">Còn {status.daysUntil} ngày nữa.</p>
      <div aria-hidden className="flex items-start gap-1.5 sm:gap-2">
        {UNITS.map(({ key, label }, index) => (
          <div key={key} className="flex items-start gap-1.5 sm:gap-2">
            {index > 0 && (
              <span
                className={cn(
                  "font-title font-light text-muted-foreground",
                  size === "lg" ? "text-3xl leading-[1.6] sm:text-4xl" : "text-xl leading-[1.6]"
                )}
              >
                :
              </span>
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex min-w-[2.5ch] justify-center bg-card font-title font-light text-foreground tabular-nums hairline",
                  size === "lg"
                    ? "px-2 py-2.5 text-3xl sm:px-3 sm:py-3 sm:text-5xl"
                    : "px-1.5 py-1.5 text-xl sm:text-2xl"
                )}
              >
                <SlidingNumber value={countdown[key]} padStart />
              </div>
              <span className="caption">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
