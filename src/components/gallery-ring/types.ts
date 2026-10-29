/** One photo shown on the ring and in the viewer. */
export type RingPhoto = {
  id: string | number
  /** Image used on the ring card, the thumbnails and as the viewer placeholder. */
  src: string
  /** Higher-resolution image for the viewer; falls back to `src`. */
  largeSrc?: string
  alt: string
}
