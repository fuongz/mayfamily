import { useEffect, useMemo } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { LightboxControl, lightboxControlClassName } from "./lightbox-control"
import { ZoomableImage } from "./zoomable-image"

export type LightboxImage = {
  id: string | number
  src: string
  type: "landscape" | "portrait"
  alt?: string
}

export type LightboxProps = {
  images: LightboxImage[]
  currentIndex: number
  opened: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export function Lightbox({
  images,
  currentIndex,
  opened,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  const currentImage = useMemo(() => {
    if (!images || images.length === 0) return null
    if (currentIndex < 0) return images[0]
    if (currentIndex >= images.length) return images[images.length - 1]
    return images[currentIndex]
  }, [currentIndex, images])

  const isFirst = currentIndex <= 0
  const isLast = currentIndex >= images.length - 1
  const position = Math.min(Math.max(currentIndex, 0), images.length - 1) + 1

  // Escape is handled by the dialog itself (onOpenChange -> onClose).
  useEffect(() => {
    if (!opened) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && !isFirst) onPrevious()
      else if (event.key === "ArrowRight" && !isLast) onNext()
    }
    // Capture phase: Base UI's Dialog.Popup stops arrow keys from bubbling.
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [opened, isFirst, isLast, onPrevious, onNext])

  const isLandscape = currentImage?.type === "landscape"

  return (
    <Dialog
      open={opened}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogPortal>
        {/* The gallery wall: near-opaque page colour, so the photo is the only colour on screen. */}
        <DialogOverlay className="bg-background/96 supports-backdrop-filter:backdrop-blur-sm motion-reduce:animate-none" />
        {/* Centered with inset + margin (no transform) so the fixed controls
            below stay relative to the viewport, not the popup. */}
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          aria-label={currentImage?.alt || "Ảnh"}
          className={cn(
            "fixed inset-0 z-50 m-auto h-fit max-h-dvh max-w-[calc(100%-1.5rem)] outline-none sm:max-w-[calc(100%-8rem)]",
            // Opacity only: a transform/scale here would re-anchor the fixed controls to the popup.
            "transition-opacity duration-200 ease-album data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
            isLandscape ? "w-fit" : "w-[480px]"
          )}
        >
          {/* Counter: bottom-centre between the arrows on phones, top-centre from sm.
              Zoom controls (rendered by ZoomableImage) sit top-left. */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-center sm:top-0 sm:bottom-auto sm:h-18">
            <Badge
              aria-live="polite"
              aria-label={`Ảnh ${position} trên ${images.length}`}
              className="caption pointer-events-auto h-7 rounded-none border-rule bg-background/90 px-3 text-foreground backdrop-blur-sm"
            >
              {position} / {images.length}
            </Badge>
          </div>

          <div className="fixed top-4 right-4 z-50">
            <LightboxControl
              label="Đóng"
              render={
                <DialogPrimitive.Close
                  render={
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      aria-label="Đóng"
                      className={cn("size-10", lightboxControlClassName)}
                    />
                  }
                />
              }
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </LightboxControl>
          </div>

          <div className="fixed bottom-4 left-4 z-50 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2">
            <LightboxControl
              label="Ảnh trước"
              className="size-12"
              onClick={onPrevious}
              disabled={isFirst}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-6" />
            </LightboxControl>
          </div>
          <div className="fixed right-4 bottom-4 z-50 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2">
            <LightboxControl
              label="Ảnh tiếp theo"
              className="size-12"
              onClick={onNext}
              disabled={isLast}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-6" />
            </LightboxControl>
          </div>

          {currentImage && (
            <ZoomableImage
              key={currentImage.id}
              src={currentImage.src}
              alt={currentImage.alt}
            />
          )}
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
