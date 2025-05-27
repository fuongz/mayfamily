import type { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'

import './globals.css'

import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'

import Providers from './providers'
import { League_Gothic } from 'next/font/google'
import { AudioPlayer } from '@/components/layout/audio-player/AudioPlayer'
import Script from 'next/script'
import { URL } from '@/config/url'

export const metadata: Metadata = {
  title: 'Trinh & Phương',
  description: 'Trang web gia đình bé nhỏ của chúng mình!',
}

const fontTitle = League_Gothic({
  variable: '--font-title',
  subsets: ['vietnamese'],
  weight: ['400'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Trinh & Phuong" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script src="https://cloud.umami.is/script.js" data-website-id={URL.WEBSITE_ID} />
      </head>
      <body className={fontTitle.variable}>
        <Providers>
          <main>{children}</main>
          <AudioPlayer />
        </Providers>
      </body>
    </html>
  )
}
