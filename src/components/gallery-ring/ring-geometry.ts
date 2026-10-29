/**
 * Geometry of the gallery ring.
 *
 * Cards sit on a vertical cylinder, one every `RING_STEP_DEG` degrees. The
 * radius comes from the card width so neighbours keep a constant gap:
 * chord = cardWidth * (1 + RING_GAP_RATIO) and r = chord / (2 * sin(step / 2)).
 *
 * The ring is "virtual": with more photos than fit on 360deg, a card is drawn
 * at the copy of its position nearest to the current offset, and only cards
 * within `RING_VISIBLE_SLOTS` of the front are shown. A card only changes copy
 * while it is behind the ring, so the swap is never seen.
 */

/** Angle between two neighbouring cards. 20deg = 18 cards on a full turn. */
const RING_STEP_DEG = 20

/** Gap between cards, as a fraction of the card width. */
export const RING_GAP_RATIO = 0.16

/** Radius / card width: (1 + gap) / (2 * sin(step / 2)), as a CSS factor. */
export const RING_RADIUS_FACTOR =
  (1 + RING_GAP_RATIO) / (2 * Math.sin(((RING_STEP_DEG / 2) * Math.PI) / 180))

/** Fewer photos than this are repeated round the ring so it still loops. */
const RING_MIN_SLOTS = 14

/** Cards further than this (in card steps) from the front are hidden (~95deg). */
export const RING_VISIBLE_SLOTS = 4.75

/** Cards within this many steps of the front get their image requested. */
export const RING_PRELOAD_SLOTS = 7

/** Floor-friendly modulo: mod(-1, 5) === 4. */
export function mod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus
}

/** Number of cards on the ring: every photo, repeated until the ring can loop. */
export function ringSlotCount(photoCount: number) {
  if (photoCount <= 0) return 0
  if (photoCount >= RING_MIN_SLOTS) return photoCount
  return photoCount * Math.ceil(RING_MIN_SLOTS / photoCount)
}

/** The position `index + k * period` closest to `offset`. */
export function nearestPosition(index: number, offset: number, period: number) {
  return index + period * Math.round((offset - index) / period)
}

/** Shortest distance between two slots on a loop of `period`. */
export function loopDistance(a: number, b: number, period: number) {
  const d = mod(a - b, period)
  return Math.min(d, period - d)
}

/** Places a card at `position` (in card steps) on the cylinder. */
export function cardTransform(position: number) {
  return `translate(-50%, -50%) rotateY(${position * RING_STEP_DEG}deg) translateZ(var(--ring-r))`
}

/** Turns the whole ring so `offset` faces the viewer, the front card at z = 0. */
export function ringTransform(offset: number) {
  return `translateZ(calc(var(--ring-r) * -1)) rotateY(${-offset * RING_STEP_DEG}deg)`
}
