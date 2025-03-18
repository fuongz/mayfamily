import type { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'

import './globals.css'
import '@mantine/core/styles.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Trinh & Phương',
  description: 'Trang web gia đình bé nhỏ của chúng mình!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
