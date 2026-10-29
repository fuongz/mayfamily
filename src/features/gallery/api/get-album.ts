import { TIMELINE, findTimelineEntry } from "@/constants/timeline"
import type { GalleryItem, TimelineAlbum, TimelineEntry } from "@/types"

/** An entry's photos: its in-repo `photos` first, then its `album` list (if any). */
function entryPhotos(entry: TimelineEntry, album = entry.album): GalleryItem[] {
  return [...(entry.photos ?? []), ...(album ?? [])]
}

/** Photos of one timeline entry; [] when it has none. */
export function getAlbum(slug: string): GalleryItem[] {
  const entry = findTimelineEntry(slug)
  return entry ? entryPhotos(entry) : []
}

/**
 * Every entry that has photos, oldest first. An album list shared by several
 * entries (both weddings use the wedding shoot) is shown once, under the
 * first entry that uses it; /thu-vien would otherwise show it twice.
 */
export function getAlbums(): TimelineAlbum[] {
  const seen = new Set<readonly GalleryItem[]>()
  const albums: TimelineAlbum[] = []
  for (const entry of TIMELINE) {
    const album = entry.album && !seen.has(entry.album) ? entry.album : undefined
    if (album) seen.add(album)
    if (!album?.length && !entry.photos?.length) continue
    albums.push({ entry, items: entryPhotos(entry, album) })
  }
  return albums
}
