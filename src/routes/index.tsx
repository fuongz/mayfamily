import { createFileRoute } from "@tanstack/react-router"

import { getHomeImages } from "@/features/home/api/get-home-images"
import { HomePage } from "@/features/home/components"
import { getTimeline } from "@/features/timeline/api"

export const Route = createFileRoute("/")({
  loader: async () => {
    const [timeline, images] = await Promise.all([
      getTimeline(),
      // The photo strip is a preview: a CDN hiccup must not take the museum down.
      getHomeImages().catch(() => []),
    ])
    return { timeline, images }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { timeline, images } = Route.useLoaderData()
  return <HomePage timeline={timeline} images={images} />
}
