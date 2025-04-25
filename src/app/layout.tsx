import type { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'

import './globals.css'

import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'

import Providers from './providers'
import { League_Gothic } from 'next/font/google'

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
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={fontTitle.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
