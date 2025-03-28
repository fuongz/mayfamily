'use client'

import { Button, createTheme, Input, MantineProvider } from '@mantine/core'
import { Bricolage_Grotesque } from 'next/font/google'

const fontSans = Bricolage_Grotesque({
  variable: '--font-sans',
  subsets: ['vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
})

const theme = createTheme({
  fontFamily: fontSans.style.fontFamily,
  defaultRadius: 'md',
  primaryColor: 'red',
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
