import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { MotionConfig, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons"

import { Ornament, PageShell, SectionHeading, formatCatalogueNumber } from "@/components/common"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { PhotoMasonry } from "@/features/gallery/components/photo-masonry"
import { useTimelineStatus } from "@/hooks/use-timeline-status"
import { cn } from "@/lib/utils"
import type { GalleryItem, TimelineEntry } from "@/types"

import { formatLongDate, paragraphs } from "./format"
import { InvitationCard } from "./invitation-card"
import { collapsiblePanelClassName } from "./timeline-entry-card"
import { TimelineCountdown, TimelineStatusBadge } from "./timeline-status"

function SiblingLink({ entry, direction }: { entry?: TimelineEntry; direction: "prev" | "next" }) {
  if (!entry) return <div aria-hidden className="hidden sm:block" />
  const isNext = direction === "next"
  return (
    <Link
      to="/ky-niem/$slug"
      params={{ slug: entry.slug }}
      rel={direction}
      className={cn(
        "group/sibling flex flex-col gap-2 plate p-5 transition-colors duration-300 ease-album outline-none hover:border-foreground focus-visible:ring-3 focus-visible:ring-ring/60",
        isNext && "sm:items-end sm:text-right"
      )}
    >
      <span className="caption flex items-center gap-1.5">
        {!isNext && <HugeiconsIcon icon={ArrowLeft02Icon} size={14} strokeWidth={2} aria-hidden />}
        {isNext ? "Trang sau" : "Trang trước"}
        {isNext && <HugeiconsIcon icon={ArrowRight02Icon} size={14} strokeWidth={2} aria-hidden />}
      </span>
      <span className="font-heading text-xl text-foreground underline-offset-4 group-hover/sibling:underline">
        {entry.title}
      </span>
      <span className="caption">{formatLongDate(entry.date)}</span>
    </Link>
  )
}

export type EntryPageProps = {
  entry: TimelineEntry
  album: GalleryItem[]
  prev?: TimelineEntry
  next?: TimelineEntry
  /** Catalogue number, chronological: the oldest moment is No. 01. */
  number?: number
}

/** /ky-niem/$slug: one moment of the family museum, in full. */
export function EntryPage({ entry, album, prev, next, number }: EntryPageProps) {
  const status = useTimelineStatus(entry.date)
  const [invitationOpen, setInvitationOpen] = useState(true)
  const upcoming = status.status === "upcoming"
  const body = paragraphs(entry.body)

  return (
    <MotionConfig reducedMotion="user">
      <PageShell width="default" spacing="compact" className="flex flex-col gap-12 pb-28 sm:gap-16">
        <nav aria-label="Điều hướng">
          <Link to="/" hash="dong-thoi-gian" className={buttonVariants({ variant: "ghost", className: "-ms-2.5 text-muted-foreground" })}>
            <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} data-icon="inline-start" />
            Về dòng thời gian
          </Link>
        </nav>

        <motion.article
          aria-labelledby="entry-title"
          className="mx-auto flex w-full max-w-2xl flex-col items-center gap-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="flex flex-col items-center gap-5 text-center">
            <p className="caption flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {number !== undefined && (
                <>
                  <span className="text-foreground">{formatCatalogueNumber(number)}</span>
                  <span aria-hidden className="h-px w-6 bg-rule" />
                </>
              )}
              <time dateTime={entry.date.slice(0, 10)}>{formatLongDate(entry.date)}</time>
            </p>
            <h1
              id="entry-title"
              className="font-title text-5xl leading-[1.02] font-light tracking-[-0.02em] text-balance text-foreground sm:text-7xl"
            >
              {entry.title}
            </h1>
            <TimelineStatusBadge status={status} />
            <Ornament variant="divider" className="w-16" />
            {entry.summary && (
              <p className="max-w-prose font-title text-xl leading-relaxed text-pretty text-muted-foreground italic">
                {entry.summary}
              </p>
            )}
          </header>

          {upcoming && (
            <div className="flex flex-col items-center gap-3">
              <p className="caption">Còn lại</p>
              <TimelineCountdown status={status} size="lg" />
            </div>
          )}

          {body.length > 0 && (
            <div className="flex max-w-prose flex-col gap-5 text-lg leading-relaxed text-pretty text-foreground">
              {body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {body.length === 0 && upcoming && (
            <p className="font-title text-2xl font-light text-muted-foreground italic sm:text-3xl">Trang này đang chờ được viết…</p>
          )}

          {entry.invitation && (
            <Collapsible
              open={invitationOpen}
              onOpenChange={setInvitationOpen}
              className="flex w-full flex-col items-center gap-5"
            >
              <CollapsibleTrigger render={<Button variant="ornate" size="lg" />}>
                {invitationOpen ? "Gấp thiệp mời lại" : "Xem thiệp mời"}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  data-icon="inline-end"
                  className={cn(
                    "transition-transform duration-300 ease-album motion-reduce:transition-none",
                    invitationOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className={cn(collapsiblePanelClassName, "w-full")}>
                <InvitationCard invitation={entry.invitation} />
              </CollapsibleContent>
            </Collapsible>
          )}
        </motion.article>

        {album.length > 0 && (
          <section aria-labelledby="album-title" className="flex flex-col gap-8">
            <SectionHeading
              id="album-title"
              eyebrow={`${album.length} ảnh`}
              title="Album của ngày này"
              ornament
            />
            <PhotoMasonry items={album} />
          </section>
        )}

        <Separator className="bg-rule" />

        <nav aria-label="Các trang kỷ niệm khác" className="grid gap-4 sm:grid-cols-2">
          <SiblingLink entry={prev} direction="prev" />
          <SiblingLink entry={next} direction="next" />
        </nav>
      </PageShell>
    </MotionConfig>
  )
}
