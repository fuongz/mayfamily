import React, { useRef } from 'react'
import styles from './FullScreenScrolling.module.css'
import { InvitationEnvelope } from '@/components/features/invitation-envelope/InvitationEnvelope'
import { Introduce } from '@/components/features/introduce/Introduce'
import { Quote } from '@/components/features/quote/Quote'
import { Landing } from '@/components/features/landing/Landing'
import { Box, Image, Transition } from '@mantine/core'
import { useMediaQuery, useMounted } from '@mantine/hooks'
import { Gallery } from '@/components/features/gallery/Gallery'

function FullScreenScrolling() {
  const mounted = useMounted()
  const container = useRef<HTMLDivElement | null>(null)
  const matches = useMediaQuery('(min-width: 56.25em)')
  return (
    <div className="overflow-hidden" ref={container}>
      <Box>
        <Transition mounted={mounted} transition="fade-down" duration={700} timingFunction="ease">
          {(transitionStyles) => (
            <Box style={transitionStyles} hiddenFrom="sm" pos="fixed" w="100%" top={0} left={0}>
              <Image alt="background-top" src="/images/bg.png" style={{ objectFit: 'cover' }} />
            </Box>
          )}
        </Transition>

        <Box id="section-0" className={`${styles.panel} panel1`}>
          <div className="content relative w-full h-screen flex flex-col items-center justify-center">
            <Landing />
          </div>
        </Box>

        {!matches && (
          <Box id="section-1" hiddenFrom="sm" className={`${styles.panel} panel2`}>
            <div className="content relative w-full h-screen flex flex-col items-center justify-center">
              <Quote />
            </div>
          </Box>
        )}

        {!matches && (
          <Box id="section-2" hiddenFrom="sm" className={`${styles.panel} panel3`}>
            <div className="content relative w-full h-screen">
              <Introduce />
            </div>
          </Box>
        )}
        {!matches && (
          <Box id="section-3" hiddenFrom="sm" className={`${styles.panel} panel4`}>
            <div className="content relative w-full">
              <Gallery />
            </div>
          </Box>
        )}

        <Box id="section-4" className={`${styles.panel} panel5`}>
          <div className="content relative w-full h-screen">
            <InvitationEnvelope />
          </div>
        </Box>

        <Transition mounted={mounted} transition="fade-down" duration={700} timingFunction="ease">
          {(transitionStyles) => (
            <Box style={transitionStyles} hiddenFrom="sm" className="transform rotate-180" pos="fixed" w="100%" bottom={0} left={0}>
              <Image alt="background-bottom" src="/images/bg.png" style={{ objectFit: 'cover' }} />
            </Box>
          )}
        </Transition>
      </Box>
    </div>
  )
}

export { FullScreenScrolling }
