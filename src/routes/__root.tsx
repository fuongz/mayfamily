import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import { AudioPlayer } from "@/components/layout/audio-player"
import { THEME_SCRIPT } from "@/components/layout/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { env } from "@/config/env"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
      },
      { title: "Trinh & Phương" },
      {
        name: "description",
        content:
          "Triển lãm nhỏ của gia đình Trinh & Phương: từ ngày cưới tới hôm nay, và những trang còn để dành cho mai sau.",
      },
      // Light and dark palettes both ship: the OS setting, or the visitor's choice from the theme toggle.
      { name: "color-scheme", content: "light dark" },
      { name: "apple-mobile-web-app-title", content: "Trinh & Phuong" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      {
        src: "https://cloud.umami.is/script.js",
        defer: true,
        "data-website-id": env.UMAMI_WEBSITE_ID,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="caption">Không tìm thấy trang</p>
      <h1 className="font-title text-6xl font-light tracking-[-0.02em] sm:text-8xl">404</h1>
      <span aria-hidden className="h-px w-16 bg-rule" />
      <p className="max-w-sm text-pretty text-muted-foreground">
        Phòng này chưa có hiện vật nào. Có thể đường dẫn đã đổi hoặc trang chưa được trưng bày.
      </p>
      <Link to="/" className={buttonVariants({ variant: "ornate", size: "lg" })}>
        Về trang chủ
      </Link>
    </div>
  ),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  return (
    <TooltipProvider>
      <main>
        <Outlet />
      </main>
      <AudioPlayer />
    </TooltipProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // The theme script sets class/style on <html> before hydration.
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Blocking, before the stylesheet: no flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        {children}
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
