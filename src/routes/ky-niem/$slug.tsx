import { createFileRoute } from "@tanstack/react-router"

import { TIMELINE } from "@/constants/timeline"
import { getAlbum } from "@/features/gallery/api/get-album"
import { getTimelineEntry } from "@/features/timeline/api"
import { EntryPage } from "@/features/timeline/components"

export const Route = createFileRoute("/ky-niem/$slug")({
  loader: async ({ params: { slug } }) => {
    const [entry, album] = await Promise.all([
      getTimelineEntry({ data: { slug } }),
      getAlbum({ data: { slug } }),
    ])
    return { entry, album }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.entry.title} · Trinh & Phương` },
          ...(loaderData.entry.summary
            ? [{ name: "description", content: loaderData.entry.summary }]
            : []),
        ]
      : [{ title: "Kỷ niệm · Trinh & Phương" }],
  }),
  component: KyNiemRoute,
})

function KyNiemRoute() {
  const { entry, album } = Route.useLoaderData()
  const index = TIMELINE.findIndex((item) => item.slug === entry.slug)
  return (
    <EntryPage
      key={entry.slug}
      entry={entry}
      album={album}
      prev={TIMELINE[index - 1]}
      next={TIMELINE[index + 1]}
      number={index >= 0 ? index + 1 : undefined}
    />
  )
}
