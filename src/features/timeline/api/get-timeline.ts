import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { TIMELINE, findTimelineEntry } from "@/constants/timeline"
import type { TimelineEntry } from "@/types"

/** Every timeline entry, oldest first. */
export const getTimeline = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<TimelineEntry>> => [...TIMELINE]
)

/** One entry by slug; throws `notFound()` when the slug is unknown. */
export const getTimelineEntry = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<TimelineEntry> => {
    const entry = findTimelineEntry(data.slug)
    if (!entry) throw notFound()
    return entry
  })
