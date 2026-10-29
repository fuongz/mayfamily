import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"

import { Plate, formatCatalogueNumber } from "@/components/common"
import { Button, buttonVariants } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { TimelineStatusResult } from "@/hooks/use-timeline-status"
import { cn } from "@/lib/utils"
import type { TimelineEntry } from "@/types"

import { formatLongDate } from "./format"
import { InvitationCard } from "./invitation-card"
import { TimelineCountdown, TimelineStatusBadge } from "./timeline-status"

/** Height-animated panel; Base UI exposes the measured height as a CSS var. */
export const collapsiblePanelClassName =
  "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-500 ease-album data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"

export type TimelineEntryCardProps = {
  entry: TimelineEntry
  status: TimelineStatusResult
  /** Catalogue number, chronological: the oldest moment is No. 01. */
  number?: number
  className?: string
}

/** One moment on the home timeline: summary, status and a link to its page. */
export function TimelineEntryCard({ entry, status, number, className }: TimelineEntryCardProps) {
  const [open, setOpen] = useState(false)
  const titleId = `moc-${entry.slug}`
  const upcoming = status.status === "upcoming"

  return (
    <Plate
      role="article"
      aria-labelledby={titleId}
      className={cn("gap-0 py-0", upcoming && "border-dashed! border-foreground/40!", className)}
    >
      {entry.cover && (
        <img
          src={entry.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[3/2] w-full bg-muted object-cover"
          style={entry.coverFocus ? { objectPosition: entry.coverFocus } : undefined}
        />
      )}

      <CardHeader className="gap-3 pt-5 sm:px-6 sm:pt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {number !== undefined && (
            <span className="caption text-foreground lg:sr-only">{formatCatalogueNumber(number)}</span>
          )}
          {number !== undefined && <span aria-hidden className="h-px w-6 bg-rule lg:hidden" />}
          <time dateTime={entry.date.slice(0, 10)} className="caption lg:sr-only">
            {formatLongDate(entry.date)}
          </time>
          <TimelineStatusBadge status={status} className="ms-auto" />
        </div>
        <CardTitle className="text-2xl leading-tight font-normal tracking-[-0.01em] sm:text-3xl">
          <h3 id={titleId} className="font-heading font-normal">
            {entry.title}
          </h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 pt-3 pb-5 sm:px-6 sm:pb-6">
        {entry.summary && (
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">{entry.summary}</p>
        )}
        {upcoming && <TimelineCountdown status={status} />}
      </CardContent>

      {entry.invitation && (
        <Collapsible open={open} onOpenChange={setOpen} className="px-4 pb-5 sm:px-6">
          <CollapsibleTrigger
            render={<Button variant="ornate" size="lg" className="w-full sm:w-auto" />}
          >
            {open ? "Gấp thiệp mời lại" : "Xem thiệp mời"}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              data-icon="inline-end"
              className={cn(
                "transition-transform duration-300 ease-album motion-reduce:transition-none",
                open && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className={collapsiblePanelClassName}>
            <div className="pt-5">
              <InvitationCard invitation={entry.invitation} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      <CardFooter className="justify-end rounded-none border-rule bg-transparent sm:px-6">
        <Link to="/ky-niem/$slug" params={{ slug: entry.slug }} className={buttonVariants({ variant: "link", className: "h-auto min-h-11 px-0 text-xs tracking-[0.16em] text-foreground uppercase underline-offset-[6px]" })}>
          {upcoming ? "Xem trang đang chờ" : "Mở trang kỷ niệm"}
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Link>
      </CardFooter>
    </Plate>
  )
}
