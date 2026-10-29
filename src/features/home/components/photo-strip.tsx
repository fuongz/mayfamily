import { useMemo, useRef } from "react"
import { useScroll } from "motion/react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Image01Icon } from "@hugeicons/core-free-icons"

import { SectionHeading } from "@/components/common"
import { GalleryRing, type RingPhoto } from "@/components/gallery-ring"
import { buttonVariants } from "@/components/ui/button"
import type { HomeImage } from "@/types"

const TITLE = "Lật nhanh vài tấm trong album"
/** Scroll distance that turns the ring by one photo. */
const SVH_PER_PHOTO = 55

/**
 * A few photos from the album on a turning ring. The section pins to the
 * screen and scrolling turns the ring photo by photo; after the last one the
 * page scrolls on. Each photo still opens large.
 */
export function PhotoStrip({ images }: { images: HomeImage[] }) {
  const photos = useMemo<RingPhoto[]>(
    () => images.map((image) => ({ id: image.id, src: image.file_url, alt: image.filename })),
    [images]
  )

  const pinRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] })
  const turns = Math.max(photos.length - 1, 0)

  return (
    <section aria-labelledby="photo-strip-title">
      <div ref={pinRef} className="relative" style={{ height: `calc(100svh + ${turns * SVH_PER_PHOTO}svh)` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-2 pt-14 sm:gap-4 sm:pt-0">
          <SectionHeading id="photo-strip-title" eyebrow="Thư viện ảnh" title={TITLE} ornament />

          {photos.length > 0 && (
            <GalleryRing
              photos={photos}
              title={TITLE}
              scrollProgress={scrollYProgress}
              // Shorter than the standalone ring so heading, ring and controls share one screen.
              className="gap-4 py-2 sm:min-h-0 sm:gap-4 [--card-w:min(70vw,30svh)] sm:[--card-w:min(38vw,30svh)] lg:[--card-w:min(26vw,32svh)]"
            />
          )}

          <div className="flex justify-center">
            <Link to="/thu-vien" className={buttonVariants({ variant: "cta", size: "lg" })}>
              <HugeiconsIcon icon={Image01Icon} strokeWidth={2} data-icon="inline-start" />
              Xem toàn bộ ảnh
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
