import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MotionConfig, motion, type Variants } from "motion/react"

import { Lightbox, type LightboxImage } from "@/components/lightbox"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { GalleryItem } from "@/types"

export type PhotoMasonryProps = {
  items: GalleryItem[]
  className?: string
}

/** Full-size URL for the lightbox (the CDN serves an @3x variant for some photos). */
export function largeSrc(item: GalleryItem) {
  return item.has_large_size ? item.file_url.replace(".jpg", "@3x.jpg") : item.file_url
}

// Same variants on server and client (no hydration mismatch); MotionConfig
// reducedMotion="user" drops the rise for people who ask for less motion.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
}

/**
 * Shared photo wall: true masonry via CSS columns, each photo hung flat, no
 * frame, whitespace between. Click (or Enter) opens the lightbox at
 * that photo.
 * Used by /thu-vien and /ky-niem/$slug.
 */
export function PhotoMasonry({ items, className }: PhotoMasonryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [opened, setOpened] = useState(false)

  const images = useMemo<LightboxImage[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        type: item.type,
        alt: item.filename,
        src: largeSrc(item),
      })),
    [items]
  )

  const lastIndex = items.length - 1
  const handleClose = useCallback(() => setOpened(false), [])
  const handlePrevious = useCallback(
    () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    []
  )
  const handleNext = useCallback(
    () => setCurrentIndex((prev) => Math.min(prev + 1, lastIndex)),
    [lastIndex]
  )

  if (items.length === 0) return null

  return (
    <MotionConfig reducedMotion="user">
      <motion.ul
        data-slot="photo-masonry"
        className={cn("columns-2 gap-3 sm:columns-3 sm:gap-6 lg:columns-4", className)}
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.02 }}
      >
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            variants={itemVariants}
            className="mb-3 break-inside-avoid sm:mb-6"
          >
            <PhotoPrint
              item={item}
              index={index}
              total={items.length}
              onOpen={() => {
                setCurrentIndex(index)
                setOpened(true)
              }}
            />
          </motion.li>
        ))}
      </motion.ul>

      <Lightbox
        images={images}
        currentIndex={currentIndex}
        opened={opened}
        onClose={handleClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </MotionConfig>
  )
}

type PhotoPrintProps = {
  item: GalleryItem
  index: number
  total: number
  onOpen: () => void
}

function PhotoPrint({ item, index, total, onOpen }: PhotoPrintProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  // The image may finish loading before hydration attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <motion.button
      type="button"
      aria-label={`Mở ảnh ${index + 1} / ${total}`}
      onClick={onOpen}
      className="group block w-full cursor-zoom-in outline-none focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <span
        className={cn(
          "relative block overflow-hidden bg-muted",
          item.type === "landscape" ? "aspect-3/2" : "aspect-2/3"
        )}
      >
        {!loaded && (
          <Skeleton aria-hidden="true" className="absolute inset-0 rounded-none bg-muted" />
        )}
        <img
          ref={imgRef}
          src={item.file_url}
          alt={item.filename}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-[opacity,scale] duration-700 ease-album motion-reduce:transition-none",
            "motion-safe:group-hover:scale-[1.03]",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      </span>
    </motion.button>
  )
}
