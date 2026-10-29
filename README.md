# 👰‍♀️ 🐈 🤵‍♂️ May's Family!

TanStack Start + Vite + shadcn (Base UI, Hugeicons) + Tailwind v4 + motion, deployed to Cloudflare Workers.

## Setup

```bash
bun install
```

Create `.env.local` with:

```
VITE_CDN_URL=...
VITE_UMAMI_WEBSITE_ID=...
```

Both values are public and are inlined at **build time** (client and worker), so `.env.local` (or `.env.production`) must exist on the machine that runs `bun run build` / `bun run deploy`. They are not Wrangler vars.

## Develop

```bash
bun run dev        # http://localhost:3662
bun run typecheck  # tsc --noEmit
```

## Adding a moment to the family museum

The home page is a timeline built from `src/constants/timeline.ts`. To add a moment:

1. Add an entry to `ENTRIES` with a unique `slug` (its page is `/ky-niem/<slug>`), an ISO `date` (read in Asia/Ho_Chi_Minh time), `title`, `summary`, and optionally `body` and `cover` (a CDN image URL).
2. Photos, either way (both can be combined):
   - **In the repo:** put the files in `public/images/<slug>/` and list them in `photos` (`{ id, type: "landscape" | "portrait", has_large_size: false, file_url: "/images/<slug>/…", filename, folder }`); `ky-niem-1-nam` is an example. Set `cover` to one of them for the timeline card.
   - **On the CDN:** upload a JSON file in the same shape as `gallery.json` and set `album` to its path, e.g. `"albums/ky-niem-1-nam.json"`. Entries sharing one album file show it once on `/thu-vien`.
3. `bun run deploy`.

Moments in the past show "Đã diễn ra · N ngày trước"; future ones show a live countdown. Wedding entries carry an `invitation` from `src/constants/events.ts` and get a "Xem thiệp mời" toggle that reopens the original invitation.

## Build and deploy

```bash
bun run build      # vite build (client + worker)
bun run preview    # serve the build locally in workerd
bun run deploy     # build + wrangler deploy
bun run cf-typegen # regenerate worker-configuration.d.ts after editing wrangler.jsonc
```

## Structure

```
src/
  routes/              __root.tsx, index.tsx (/), ky-niem/$slug.tsx, thu-vien.tsx
  components/
    ui/                shadcn components
    common/            Ornament, SectionHeading, PageShell, PaperCard
    motion/            InView, AnimatedGroup, SlidingNumber, FullScreenScroll
    lightbox/          Lightbox with zoom
    layout/            AudioPlayer, MusicPromptDialog
  features/
    home/              api/ + components/ for / (hero, photo strip, footer)
    timeline/          api/ + components/ (timeline, entry page, invitation card)
    gallery/           api/ (albums) + components/ (PhotoMasonry, AlbumSection)
  config/env.ts        constants/{events,timeline}.ts   hooks/use-timeline-status.ts
  lib/utils.ts         types/index.ts                   styles.css (album palette, fonts, dark mode)
```
