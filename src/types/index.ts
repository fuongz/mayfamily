export interface HomeImage {
  id: string
  file_url: string
  filename: string
}

export interface GalleryItem {
  type: "landscape" | "portrait"
  has_large_size: boolean
  id: number
  file_url: string
  filename: string
  folder: string
}

/** One family on the printed card: "Ông Bà" and the two parents. */
export interface PrintFamily {
  parents: [string, string]
}

/** One of the couple as printed: surname on the first line, given name below. */
export interface PrintPerson {
  surname: string
  given: string
  /** "Út Nữ", "Quý Nam"... */
  role: string
}

/**
 * The printed invitation (envelope + two-panel card), word for word. Lines
 * are kept as printed; the card typesets them, nothing is derived.
 */
export interface InvitationPrint {
  /** Crest names, e.g. ["Thế Phương", "Hồng Trinh"], and its short date "25.05.25". */
  crest: { names: [string, string]; date: string }
  /** Big date on the envelope, "25.05.2025". */
  envelopeDate: string
  /** Families left and right, in the order printed. */
  families: [PrintFamily, PrintFamily]
  announcement: string
  /** The couple left and right, in the order printed. */
  couple: [PrintPerson, PrintPerson]
  /** "Hôn Lễ Được Cử Hành Tại Tư Gia" with its time lines. */
  homeCeremony: { title: string; lines: string[] }
  reception: {
    intro: string
    venue: string[]
    hall?: string
    address: string[]
    time: string
    date: string
    lunar: string
    closing: string[]
    schedule?: string
  }
}

export interface WeddingEvent {
  title: string
  location_line_1: string
  location_line_2: string
  /** DD-MM (lunar calendar) */
  date_lunar: string
  /** ISO local datetime (Asia/Ho_Chi_Minh), e.g. "2025-05-25T11:00:00" */
  countdown: string
  calendar_url: string
  /** Google Maps embed URL */
  map: string
  map_direction: string
  /** The printed invitation, typeset on the opening envelope card. */
  print?: InvitationPrint
}

export type TimelineEntryKind = "wedding" | "milestone"

/** One page of the family museum: a dated moment on the timeline. */
export interface TimelineEntry {
  /** URL segment for /ky-niem/$slug. Lowercase, ASCII, kebab-case. */
  slug: string
  /** ISO date or local datetime (Asia/Ho_Chi_Minh), e.g. "2026-05-25" or "2025-05-25T11:00:00" */
  date: string
  title: string
  /** One or two sentences shown on the timeline card. */
  summary?: string
  /** Longer story for the detail page. Paragraphs are separated by a blank line. */
  body?: string
  kind: TimelineEntryKind
  /** Cover image URL (absolute, or a path under /public). */
  cover?: string
  /** CSS object-position for the cover's 3:2 crop, e.g. "50% 70%". Default centre. */
  coverFocus?: string
  /**
   * Photos kept in the repo (under /public), shown before the CDN `album`
   * photos on the detail page and in /thu-vien. Use for moments without a
   * CDN album yet.
   */
  photos?: GalleryItem[]
  /** CDN JSON path relative to VITE_CDN_URL, e.g. "gallery.json". Returns GalleryItem[]. */
  album?: string
  /** Wedding entries carry the original invitation details. */
  invitation?: WeddingEvent
}

/** A timeline entry paired with its album photos. */
export interface TimelineAlbum {
  entry: TimelineEntry
  items: GalleryItem[]
}
