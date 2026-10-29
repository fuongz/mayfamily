import { createFileRoute } from "@tanstack/react-router"

import { HOME_IMAGES } from "@/constants/gallery"
import { HomePage } from "@/features/home/components"
import { getTimeline } from "@/features/timeline/api"

export const Route = createFileRoute("/")({
  loader: async () => ({ timeline: await getTimeline(), images: [...HOME_IMAGES] }),
  component: RouteComponent,
})

function RouteComponent() {
  const { timeline, images } = Route.useLoaderData()
  return <HomePage timeline={timeline} images={images} />
}
