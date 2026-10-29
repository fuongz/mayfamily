import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchRemoveIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@hugeicons/core-free-icons"

import { LightboxControl } from "./lightbox-control"

export type ZoomControlsProps = {
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
}

/** Zoom in / out / reset, fixed top-left above the lightbox overlay. */
export function ZoomControls({
  zoomIn,
  zoomOut,
  resetTransform,
}: ZoomControlsProps) {
  return (
    <div
      role="group"
      aria-label="Thu phóng"
      className="pointer-events-auto fixed top-4 left-4 z-50 flex gap-2"
    >
      <LightboxControl label="Phóng to" onClick={() => zoomIn()}>
        <HugeiconsIcon icon={ZoomInIcon} strokeWidth={2} />
      </LightboxControl>
      <LightboxControl label="Thu nhỏ" onClick={() => zoomOut()}>
        <HugeiconsIcon icon={ZoomOutIcon} strokeWidth={2} />
      </LightboxControl>
      <LightboxControl label="Đặt lại thu phóng" onClick={() => resetTransform()}>
        <HugeiconsIcon icon={SearchRemoveIcon} strokeWidth={2} />
      </LightboxControl>
    </div>
  )
}
