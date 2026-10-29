import type { TimelineEntry } from "@/types"

import { EVENTS } from "./events"
import { MAY } from "./family"

/** Timezone every timeline date is read in. */
export const TIMELINE_TIMEZONE = "Asia/Ho_Chi_Minh"

/**
 * The family museum, in any order — `TIMELINE` below sorts it by date.
 *
 * To add a moment: copy an entry, give it a unique `slug` (used in
 * /ky-niem/<slug>), an ISO `date`, and optionally an `album` JSON on the CDN.
 */
const ENTRIES: TimelineEntry[] = [
  {
    slug: MAY.slug,
    date: MAY.arrived,
    title: "Mây về nhà",
    summary: "Một bé mèo trắng nhỏ xíu ngồi cạnh chậu cây, ngày đầu tiên ở nhà mình.",
    // TODO(Trinh & Phương): kể thêm về ngày Mây về.
    body: undefined,
    kind: "milestone",
    cover: "/images/may/ngay-dau.webp",
    // The kitten sits low in a tall photo: crop around her.
    coverFocus: "50% 74%",
    photos: [
      {
        id: 10001,
        type: "portrait",
        has_large_size: false,
        file_url: "/images/may/ngay-dau.webp",
        filename: "Mây ngày đầu về nhà, ngồi cạnh chậu cây",
        folder: MAY.slug,
      },
    ],
    album: undefined,
  },
  {
    slug: "le-vu-quy",
    date: EVENTS.bridal.countdown,
    title: "Lễ Vu Quy",
    // TODO(Trinh & Phương): viết lại vài dòng kể về buổi lễ.
    summary:
      "Ngày Hồng Trinh về nhà chồng, tại nhà hàng Minh Thuỳ, TP. Hồ Chí Minh.",
    // TODO(Trinh & Phương): câu chuyện đầy đủ cho trang chi tiết.
    body: undefined,
    kind: "wedding",
    // Váy cưới giữa tường hoa hồng đỏ (concept 06).
    cover: "https://cdn.trinhvaphuong.com/concept-06/image-13.jpg",
    album: "gallery.json",
    invitation: EVENTS.bridal,
  },
  {
    slug: "le-tan-hon",
    date: EVENTS.groom.countdown,
    title: "Lễ Tân Hôn",
    // TODO(Trinh & Phương): viết lại vài dòng kể về buổi lễ.
    summary:
      "Tiệc cưới nhà trai trên sân trường THCS Sông Hiến, TP. Cao Bằng.",
    // TODO(Trinh & Phương): câu chuyện đầy đủ cho trang chi tiết.
    body: undefined,
    kind: "wedding",
    // Nâng ly trên sân thượng lúc hoàng hôn (concept 02).
    cover: "https://cdn.trinhvaphuong.com/concept-02/image-12.jpg",
    // TODO(Trinh & Phương): tách album riêng cho lễ tân hôn nếu có (vd. "tan-hon.json").
    album: "gallery.json",
    invitation: EVENTS.groom,
  },
  {
    slug: "ky-niem-1-nam",
    date: "2026-05-25",
    title: "Kỷ niệm 1 năm ngày cưới",
    // TODO(Trinh & Phương): viết lại vài dòng kể về buổi kỷ niệm.
    summary: "Một năm bên nhau, kể từ ngày Lễ Vu Quy.",
    body: undefined,
    kind: "milestone",
    cover: "/images/ky-niem-1-nam/02-bang-happy-anniversary.jpg",
    photos: [
      {
        id: 10101,
        type: "landscape",
        has_large_size: false,
        file_url: "/images/ky-niem-1-nam/02-bang-happy-anniversary.jpg",
        filename: "Happy Anniversary — hai ly nước cam bên bảng chữ",
        folder: "ky-niem-1-nam",
      },
      {
        id: 10102,
        type: "portrait",
        has_large_size: false,
        file_url: "/images/ky-niem-1-nam/01-kem-happy-anniversary.jpg",
        filename: "Happy Anniversary — đĩa kem viết chữ sô-cô-la",
        folder: "ky-niem-1-nam",
      },
    ],
    album: undefined,
  },
  {
    slug: "ky-niem-2-nam",
    date: "2027-05-25",
    title: "Kỷ niệm 2 năm ngày cưới",
    // TODO(Trinh & Phương): mục mẫu cho một ngày sắp tới — sửa hoặc xoá.
    summary: "Hẹn nhau ở trang tiếp theo của cuốn album.",
    body: undefined,
    kind: "milestone",
    cover: undefined,
    album: undefined,
  },
]

/** All timeline entries, oldest first. Slugs are unique. */
export const TIMELINE: readonly TimelineEntry[] = [...ENTRIES].sort((a, b) =>
  a.date.localeCompare(b.date)
)

export function findTimelineEntry(slug: string): TimelineEntry | undefined {
  return TIMELINE.find((entry) => entry.slug === slug)
}
