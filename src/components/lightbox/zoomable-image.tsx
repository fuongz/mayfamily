import { useState } from "react"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { ZoomControls } from "./zoom-controls"

export type ZoomableImageProps = {
  src: string
  alt?: string
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [loaded, setLoaded] = useState(false)

  if (!src) return null

  return (
    <TransformWrapper disablePadding smooth initialScale={1}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <ZoomControls
            zoomIn={() => zoomIn()}
            zoomOut={() => zoomOut()}
            resetTransform={() => resetTransform()}
          />
          <div className="relative">
            {!loaded && (
              <Skeleton
                aria-hidden="true"
                className="absolute inset-0 min-h-64 rounded-none bg-muted"
              />
            )}
            <TransformComponent>
              <img
                src={src}
                alt={alt ?? ""}
                ref={(img) => {
                  if (img?.complete && img.naturalWidth > 0) setLoaded(true)
                }}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                className={cn(
                  "block h-auto max-h-[calc(100dvh-2rem)] w-auto max-w-full object-contain transition-opacity duration-300 motion-reduce:transition-none",
                  loaded ? "opacity-100" : "min-h-64 opacity-0"
                )}
              />
            </TransformComponent>
          </div>
        </>
      )}
    </TransformWrapper>
  )
}
