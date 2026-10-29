import { createServerFn } from "@tanstack/react-start"

import { env } from "@/config/env"
import { TIMELINE, findTimelineEntry } from "@/constants/timeline"
import type { GalleryItem, TimelineAlbum, TimelineEntry } from "@/types"

/** Fetches a CDN album JSON. Never throws: a missing or broken album is []. */
async function fetchAlbum(album: string): Promise<Array<GalleryItem>> {
  try {
    const res = await fetch(`${env.CDN_URL}/${album}`)
    if (!res.ok) return []
    const items: unknown = await res.json()
    return Array.isArray(items) ? (items as Array<GalleryItem>) : []
  } catch {
    return []
  }
}

/** An entry's photos: its in-repo `photos` first, then its CDN `album` (if any). */
async function entryPhotos(entry: TimelineEntry, album = entry.album): Promise<Array<GalleryItem>> {
  const local = entry.photos ?? []
  return album ? [...local, ...(await fetchAlbum(album))] : local
}

/** Photos of one timeline entry; [] when it has none or the album fetch fails. */
export const getAlbum = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<Array<GalleryItem>> => {
    const entry = findTimelineEntry(data.slug)
    return entry ? entryPhotos(entry) : []
  })

/**
 * Every entry that has photos, oldest first. A CDN album file shared by
 * several entries (both weddings use gallery.json) is shown once, under the
 * first entry that uses it; /thu-vien would otherwise show it twice.
 */
export const getAlbums = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<TimelineAlbum>> => {
    const seen = new Set<string>()
    const albums: Array<Promise<TimelineAlbum>> = []
    for (const entry of TIMELINE) {
      const album = entry.album && !seen.has(entry.album) ? entry.album : undefined
      if (album) seen.add(album)
      if (!album && !entry.photos?.length) continue
      albums.push(entryPhotos(entry, album).then((items) => ({ entry, items })))
    }
    return Promise.all(albums)
  }
)
