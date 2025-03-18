'use client'

import { createTheme, MantineProvider } from '@mantine/core'
import { Cabin, Playwrite_VN } from 'next/font/google'

const headingMono = Playwrite_VN({
  weight: ['400'],
})

const fontSans = Cabin({
  variable: '--font-sans',
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
})

const theme = createTheme({
  fontFamily: fontSans.style.fontFamily,
  headings: {
    fontFamily: headingMono.style.fontFamily,
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
