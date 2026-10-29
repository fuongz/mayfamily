import { memo, useCallback, useState, type CSSProperties, type Ref } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type { RingPhoto } from "./types"

export type RingCardProps = {
  photo: RingPhoto
  slot: number
  label: string
  /** Request the image (cards far behind the ring don't). */
  load: boolean
  /** The photo is out in the viewer: leave its empty frame on the ring. */
  lifted: boolean
  /** Initial placement; the ring updates it imperatively afterwards. */
  style: CSSProperties
  cardRef: Ref<HTMLButtonElement>
  photoRef: Ref<HTMLSpanElement>
  onOpen: (slot: number) => void
}

/** One photo on the ring, hung in a thin hairline frame. Its transform is owned by GalleryRing, never by React state. */
export const RingCard = memo(function RingCard({
  photo,
  slot,
  label,
  load,
  lifted,
  style,
  cardRef,
  photoRef,
  onOpen,
}: RingCardProps) {
  const [loaded, setLoaded] = useState(false)
  // A cached image can fire `load` before hydration attaches the handler.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <button
      ref={cardRef}
      type="button"
      tabIndex={-1}
      aria-label={label}
      data-slot="ring-card"
      onClick={() => onOpen(slot)}
      style={style}
      className={cn(
        "group/card absolute top-1/2 left-1/2 block w-(--card-w) cursor-pointer plate p-1 outline-none backface-hidden sm:p-1.5",
        "focus-visible:ring-3 focus-visible:ring-ring/60"
      )}
    >
      <span
        ref={photoRef}
        className={cn(
          "relative block aspect-2/3 overflow-hidden bg-muted",
          lifted && "invisible"
        )}
      >
        {!loaded && <Skeleton aria-hidden="true" className="absolute inset-0 rounded-none bg-muted" />}
        {load && (
          <img
            ref={imgRef}
            src={photo.src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </span>
    </button>
  )
})
