'use client'

import React, { useRef } from 'react'
import { Box, Image, Transition } from '@mantine/core'
import { useMediaQuery, useMounted } from '@mantine/hooks'
import { FullScreenScroll } from '@/components/animations'
import { Gallery, Introduce, InvitationEnvelope, Landing, Maps, Quote } from '@/components/features/home'

function Home({ images }: { images: Array<{ file_url: string; filename: string; id: string }> }) {
  const mounted = useMounted()
  const container = useRef<HTMLDivElement | null>(null)
  const matches = useMediaQuery('(min-width: 56.25em)')
  return (
    <div ref={container}>
      <Box>
        <Transition mounted={mounted} transition="fade-down" duration={700} timingFunction="ease">
          {(transitionStyles) => (
            <Box style={transitionStyles}>
              <Box style={transitionStyles} hiddenFrom="sm" pos="fixed" w="100wh" top={0} left={0}>
                <Image alt="background-top" src="/images/bg.png" style={{ objectFit: 'cover' }} />
              </Box>

              <Box visibleFrom="sm" pos="fixed" top={0} left={0} w="300px">
                <Image alt="border-pattern" src="/images/border-pattern.png" style={{ objectFit: 'cover' }} />
              </Box>

              <Box style={{ transform: 'rotate(90deg)' }} visibleFrom="sm" pos="fixed" top={-75} right={75} w="300px">
                <Image alt="border-pattern" src="/images/border-pattern.png" style={{ objectFit: 'cover' }} />
              </Box>
            </Box>
          )}
        </Transition>

        <FullScreenScroll>
          <Landing />
          <Quote />
          {!matches && <Introduce />}
          <Gallery images={images} />
          <InvitationEnvelope />
          <Maps />
        </FullScreenScroll>

        <Transition mounted={mounted} transition="fade-up" duration={700} timingFunction="ease">
          {(transitionStyles) => (
            <Box style={transitionStyles}>
              <Box hiddenFrom="sm" className="transform rotate-180" pos="fixed" w="100%" bottom={0} left={0}>
                <Image alt="background-bottom" src="/images/bg.png" style={{ objectFit: 'cover' }} />
              </Box>

              <Box visibleFrom="sm" pos="fixed" bottom={-73} left={73} w="300px" style={{ transform: 'rotate(270deg)' }}>
                <Image alt="border-pattern" src="/images/border-pattern.png" style={{ objectFit: 'cover' }} />
              </Box>

              <Box style={{ transform: 'rotate(180deg)' }} visibleFrom="sm" pos="fixed" bottom={0} right={0} w="300px">
                <Image alt="border-pattern" src="/images/border-pattern.png" style={{ objectFit: 'cover' }} />
              </Box>
            </Box>
          )}
        </Transition>
      </Box>
    </div>
  )
}

export { Home }
