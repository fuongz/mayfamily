'use client'

import { Box, Image, MantineTheme, ActionIcon } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { LightBox } from '../lightbox/LightBox'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface MasonryProps {
  items: {
    type: 'landscape' | 'portrait'
    has_large_size: boolean
    id: number
    file_url: string
    filename: string
    folder: string
  }[]
}

function Masonry({ items }: MasonryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [opened, setOpened] = useState(false)

  if (!items || items.length === 0) {
    return <></>
  }

  return (
    <>
      <Box w="100%">
        <ActionIcon pos="fixed" top={16} left={16} variant="filled" color="wedding-red.9" radius="xl" size={56} component={Link} href="/">
          <IconArrowLeft />
        </ActionIcon>

        <AnimatePresence>
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 xl:grid-cols-10 gap-1"
            variants={{
              hidden: {
                transition: {
                  staggerChildren: 0.02,
                  staggerDirection: -1,
                },
              },
              show: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    scale: 0.8,
                    transition: { type: 'spring', bounce: 0.4 },
                  },
                  show: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.4 } },
                }}
                className={`cursor-pointer ${item.type === 'landscape' ? 'col-span-2' : ''}`}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  setCurrentIndex(index)
                  setOpened(true)
                }}
              >
                <Image
                  src={item.file_url}
                  alt={item.filename}
                  h={{ base: 150, sm: 170, lg: 200 }}
                  fit="cover"
                  styles={(theme: MantineTheme) => ({
                    root: {
                      overflow: 'hidden',
                      borderRadius: theme.radius.md,
                    },
                    image: {
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    },
                  })}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Box>

      <LightBox
        images={items.map((item) => ({
          id: item.id,
          type: item.type,
          src: item.has_large_size ? item.file_url.replace('.jpg', '@3x.jpg') : item.file_url,
        }))}
        currentIndex={currentIndex}
        opened={opened}
        onClose={() => {
          setOpened(false)
        }}
        onPrevious={() => {
          setCurrentIndex((prev) => {
            if (prev > 0) {
              return prev - 1
            }
            return prev
          })
        }}
        onNext={() => {
          setCurrentIndex((prev) => {
            if (prev < items.length - 1) {
              return prev + 1
            }
            return prev
          })
        }}
      />
    </>
  )
}

export { Masonry }
