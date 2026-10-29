import { createFileRoute, notFound } from "@tanstack/react-router"

import { PageShell } from "@/components/common"
import { getAlbums } from "@/features/gallery/api/get-album"
import { AlbumSection, BackButton } from "@/features/gallery/components"

export const Route = createFileRoute("/thu-vien/$slug")({
  loader: ({ params: { slug } }) => {
    // Same list as the folders, so the album number matches its folder.
    const albums = getAlbums()
    const index = albums.findIndex((album) => album.entry.slug === slug)
    if (index < 0) throw notFound()
    return { album: albums[index], index }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData ? `${loaderData.album.entry.title} · ` : ""}Thư viện ảnh · Trinh & Phương` }],
  }),
  component: AlbumRoute,
})

function AlbumRoute() {
  const { album, index } = Route.useLoaderData()
  return (
    <>
      <BackButton to="/thu-vien" label="Về thư viện" />
      <PageShell width="wide" spacing="compact" className="pt-20 pb-24 sm:pt-24">
        <AlbumSection key={album.entry.slug} album={album} index={index} headingLevel="h1" />
      </PageShell>
    </>
  )
}
