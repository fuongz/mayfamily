import { useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"

import { Ornament, formatCatalogueNumber } from "@/components/common"
import { GalleryRing, type RingPhoto } from "@/components/gallery-ring"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GalleryItem, TimelineAlbum } from "@/types"

import { AlbumViewToggle, type AlbumView } from "./album-view-toggle"
import { PhotoMasonry, largeSrc } from "./photo-masonry"

export type AlbumSectionProps = {
  album: TimelineAlbum
  /** Position in the page, shown as the chapter number. */
  index: number
  /** h1 on the album's own page, h2 when listed with others. */
  headingLevel?: "h1" | "h2"
  className?: string
}

/** "2025-05-25T11:00:00" -> "25 · 05 · 2025". Parsed by hand: no timezone drift between server and client. */
export function formatAlbumDate(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-")
  return `${day} · ${month} · ${year}`
}

/** Element id of an album section (anchor target, heading id prefix). */
function albumAnchor(slug: string) {
  return `album-${slug}`
}

function toRingPhoto(item: GalleryItem): RingPhoto {
  return {
    id: item.id,
    src: item.file_url,
    largeSrc: item.has_large_size ? largeSrc(item) : undefined,
    alt: item.filename,
  }
}

/** The ring only pays off with enough photos to go round; smaller albums are a plain grid. */
const RING_MIN_PHOTOS = 6

/** One timeline entry's album: chapter heading, photo count, link to its page, ring or grid. */
export function AlbumSection({ album, index, headingLevel = "h2", className }: AlbumSectionProps) {
  const Heading = headingLevel
  const { entry, items } = album
  const headingId = `${albumAnchor(entry.slug)}-title`
  const [view, setView] = useState<AlbumView>("ring")
  const photos = useMemo(() => items.map(toRingPhoto), [items])
  const canRing = items.length >= RING_MIN_PHOTOS

  return (
    <section
      id={albumAnchor(entry.slug)}
      aria-labelledby={headingId}
      className={cn("scroll-mt-20", className)}
    >
      <header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="caption flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-foreground">{formatCatalogueNumber(index + 1)}</span>
            <span aria-hidden="true" className="h-px w-6 bg-rule" />
            <time dateTime={entry.date.slice(0, 10)}>{formatAlbumDate(entry.date)}</time>
            <span aria-hidden="true" className="h-px w-6 bg-rule" />
            <span>{items.length} ảnh</span>
          </p>
          <Heading
            id={headingId}
            className="font-heading text-3xl leading-tight font-normal tracking-[-0.01em] sm:text-4xl"
          >
            {entry.title}
          </Heading>
          {entry.summary && (
            <p className="max-w-prose leading-relaxed text-pretty text-muted-foreground">{entry.summary}</p>
          )}
        </div>

        <Link
          to="/ky-niem/$slug"
          params={{ slug: entry.slug }}
          className={cn(
            buttonVariants({ variant: "ornate", size: "lg" }),
            "self-start px-4 sm:self-auto"
          )}
        >
          Xem kỷ niệm
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Link>
      </header>

      {items.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <p aria-hidden="true" className="caption max-sm:hidden">
              {canRing && view === "ring" ? "Kéo hoặc dùng mũi tên để xoay" : "Chạm một tấm để xem lớn"}
            </p>
            {canRing && <AlbumViewToggle value={view} onValueChange={setView} className="ms-auto" />}
          </div>
          {canRing && view === "ring" ? (
            <GalleryRing photos={photos} title={entry.title} />
          ) : (
            <PhotoMasonry items={items} />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 border border-dashed border-rule px-6 py-12 text-center text-muted-foreground">
          <Ornament variant="divider" className="w-16" />
          <p>Album này đang được dán ảnh vào, ghé lại sau nhé.</p>
        </div>
      )}
    </section>
  )
}
