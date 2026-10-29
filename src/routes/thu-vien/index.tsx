import { Link, createFileRoute } from "@tanstack/react-router"

import { Ornament, PageShell, Plate, SectionHeading } from "@/components/common"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAlbums } from "@/features/gallery/api/get-album"
import { AlbumFolders, BackButton } from "@/features/gallery/components"

export const Route = createFileRoute("/thu-vien/")({
  loader: () => getAlbums(),
  head: () => ({
    meta: [{ title: "Thư viện ảnh · Trinh & Phương" }],
  }),
  component: ThuVienRoute,
})

function ThuVienRoute() {
  // Newest album first; chapter numbers stay chronological (01 = oldest).
  const albums = [...Route.useLoaderData()].reverse()
  const photoCount = albums.reduce((sum, album) => sum + album.items.length, 0)

  return (
    <>
      <BackButton to="/" label="Về trang chủ" />

      <PageShell width="wide" spacing="compact" className="pt-20 pb-24 sm:pt-24">
        <SectionHeading
          as="h1"
          size="display"
          eyebrow="Triển lãm gia đình"
          title="Thư viện ảnh"
          ornament
          description={
            albums.length > 0
              ? `${albums.length} album, ${photoCount} tấm ảnh, xếp theo từng mốc của hành trình. Mở một album để xem tất cả ảnh.`
              : undefined
          }
        />

        {albums.length === 0 ? (
          <EmptyState />
        ) : (
          <AlbumFolders
            albums={albums}
            numberOf={(index) => albums.length - index}
            className="mt-12 sm:mt-16"
          />
        )}
      </PageShell>
    </>
  )
}

function EmptyState() {
  return (
    <Plate className="mx-auto mt-12 max-w-md items-center gap-4 px-6 py-10 text-center">
      <p className="caption">Phòng trưng bày</p>
      <h2 className="font-heading text-2xl font-normal">Album còn trống</h2>
      <Ornament variant="divider" className="w-16" />
      <p className="text-pretty text-muted-foreground">
        Ảnh của từng mốc kỷ niệm sẽ được dán vào đây. Hẹn bạn quay lại sau nhé.
      </p>
      <Link to="/" className={cn(buttonVariants({ variant: "cta", size: "lg" }), "mt-2 px-4")}>
        Về trang chủ
      </Link>
    </Plate>
  )
}
