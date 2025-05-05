'use client'

import { MANTINE_THEME } from '@/config/theme'
import { createTheme, MantineProvider } from '@mantine/core'

const theme = createTheme(MANTINE_THEME)

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
