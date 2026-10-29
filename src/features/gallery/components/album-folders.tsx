import { Link } from "@tanstack/react-router"

import { formatCatalogueNumber } from "@/components/common"
import { cn } from "@/lib/utils"
import type { TimelineAlbum } from "@/types"

import { formatAlbumDate } from "./album-section"

export type AlbumFoldersProps = {
  /** Albums in display order (newest first on /thu-vien). */
  albums: TimelineAlbum[]
  /** Catalogue number of the album at `index` (chronological, oldest = 1). */
  numberOf: (index: number) => number
  className?: string
}

/** Up to three preview photos: the entry cover first, then the album's first photos. */
function previewsOf({ entry, items }: TimelineAlbum) {
  const urls = items.map((item) => item.file_url)
  const ordered = entry.cover ? [entry.cover, ...urls.filter((url) => url !== entry.cover)] : urls
  return ordered.slice(0, 3)
}

/*
 * Photos tucked in the folder, back to front. On hover/focus they slide out
 * to the right one after another, fanning a little more each. `hover:` only
 * applies on devices that can hover (Tailwind v4), so touch just opens it.
 */
const previewPose = [
  "translate-x-[2%] group-hover/folder:translate-x-[28%] group-hover/folder:-translate-y-[7%] group-hover/folder:-rotate-3 group-focus-visible/folder:translate-x-[28%] group-focus-visible/folder:-translate-y-[7%] group-focus-visible/folder:-rotate-3",
  "translate-x-[4%] delay-40 group-hover/folder:translate-x-[58%] group-hover/folder:-translate-y-[2%] group-hover/folder:rotate-3 group-focus-visible/folder:translate-x-[58%] group-focus-visible/folder:-translate-y-[2%] group-focus-visible/folder:rotate-3",
  "translate-x-[6%] delay-80 group-hover/folder:translate-x-[92%] group-hover/folder:translate-y-[4%] group-hover/folder:rotate-9 group-focus-visible/folder:translate-x-[92%] group-focus-visible/folder:translate-y-[4%] group-focus-visible/folder:rotate-9",
]

const glide =
  "transition-transform duration-450 ease-album motion-reduce:transition-none motion-reduce:transform-none"

/**
 * Album folders, a frosted cover over the photos inside (they show through,
 * blurred). Hover or focus swings the cover open and slides the photos out;
 * each folder opens the album's own page (/thu-vien/$slug).
 */
export function AlbumFolders({ albums, numberOf, className }: AlbumFoldersProps) {
  return (
    <nav aria-label="Các album" className={className}>
      <ol className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-12 sm:gap-y-16 lg:grid-cols-4">
        {albums.map((album, index) => {
          const { entry, items } = album
          const previews = previewsOf(album)
          const number = formatCatalogueNumber(numberOf(index))
          return (
            // Raised while open so the photos slide over the next folder.
            <li key={entry.slug} className="relative hover:z-10 focus-within:z-10">
              <Link
                to="/thu-vien/$slug"
                params={{ slug: entry.slug }}
                className="group/folder flex flex-col gap-3 outline-none"
              >
                <div aria-hidden className="relative aspect-[4/5] perspective-[900px]">
                  {/* Back of the folder, peeking out on the right as its thickness. */}
                  <span className="absolute inset-0 translate-x-[3%] rounded-[10px] bg-foreground/90" />

                  {previews.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        "absolute top-[7%] left-[9%] h-[82%] w-[76%] rounded-[3px] border-[3px] border-paper object-cover shadow-[0_6px_16px_-8px_rgb(0_0_0/0.35)]",
                        previewPose[i + 3 - previews.length],
                        glide
                      )}
                    />
                  ))}

                  {/* Frosted cover, hinged on its left edge. */}
                  <span
                    className={cn(
                      // Smoked glass in the inverse of the page (ink on white, paper on black):
                      // stands off the background while the photos still glow through.
                      "absolute inset-0 flex origin-left flex-col justify-end gap-1 rounded-[10px] border border-background/15 bg-foreground/65 p-4 text-background backdrop-blur-md backdrop-saturate-150 sm:p-5",
                      "shadow-[0_14px_30px_-12px_rgb(0_0_0/0.45)] transform-3d",
                      "group-hover/folder:[transform:rotateY(-28deg)] group-focus-visible/folder:[transform:rotateY(-28deg)]",
                      "group-focus-visible/folder:ring-3 group-focus-visible/folder:ring-ring/50",
                      glide
                    )}
                  >
                    <span className="font-heading text-lg leading-snug text-balance sm:text-xl">
                      {entry.title}
                    </span>
                    <span className="caption text-background/70">
                      {number} · {items.length} ảnh
                    </span>
                    <span className="mt-2 h-px w-full bg-background/25" />
                    <span className="mt-1 h-px w-full bg-background/25" />
                  </span>
                </div>

                <span className="caption">
                  <span className="sr-only">
                    {entry.title}, {number}, {items.length} ảnh,{" "}
                  </span>
                  {formatAlbumDate(entry.date)}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
