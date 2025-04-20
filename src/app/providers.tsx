'use client'

import { Button, createTheme, Input, MantineProvider } from '@mantine/core'
import { Style_Script, Lora } from 'next/font/google'

const fontHeading = Style_Script({
  variable: '--font-heading',
  subsets: ['vietnamese'],
  weight: ['400'],
})

const fontSans = Lora({
  variable: '--font-sans',
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
})

const theme = createTheme({
  fontFamily: fontSans.style.fontFamily,
  headings: {
    fontFamily: fontHeading.style.fontFamily,
  },
  colors: {
    'wedding-red': ['#ffebeb', '#f9d2d2', '#f89f9f', '#f86a6a', '#f9413d', '#f92b22', '#fa2115', '#df180b', '#c70f07', '#ad0002'],
  },
  defaultRadius: 'md',
  primaryColor: 'wedding-red',
  components: {
    Button: Button.extend({
      styles: {
        label: {
          textShadow: '0 1px 1.5px #00000029',
        },
      },
      defaultProps: {
        variant: 'gradient',
        gradient: { from: 'red.8', to: 'red.5', deg: 0 },
      },
    }),
    Input: Input.extend({}),
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
