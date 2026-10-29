/**
 * Date helpers for timeline copy. They read the digits straight from the ISO
 * string (no Date / timezone maths), so server and client always print the same.
 */

export type DateParts = { day: number; month: number; year: number }

/** "2025-05-25" or "2025-05-25T11:00:00" -> { day: 25, month: 5, year: 2025 } */
export function dateParts(iso: string): DateParts {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number)
  return { day, month, year }
}

const pad = (value: number) => String(value).padStart(2, "0")

/** "25.05.2025" */
export function formatShortDate(iso: string) {
  const { day, month, year } = dateParts(iso)
  return `${pad(day)}.${pad(month)}.${year}`
}

/** "25 tháng 5, 2025" */
export function formatLongDate(iso: string) {
  const { day, month, year } = dateParts(iso)
  return `${day} tháng ${month}, ${year}`
}

/** Invitation lunar date "28-04" -> "28 tháng 4 Âm lịch" */
export function formatLunarDate(lunar: string) {
  const [day, month] = lunar.split("-").map(Number)
  return `${day} tháng ${month} Âm lịch`
}

/** Splits a body text into paragraphs on blank lines. */
export function paragraphs(text: string | undefined) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
