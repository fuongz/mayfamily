'use client'

import { LightBox } from '@/components/features/gallery/components/lightbox/LightBox'
import { InView } from '@/components/motions/in-view/InView'
import { Carousel } from '@mantine/carousel'
import { Button, Flex, Image, Title } from '@mantine/core'
import { IconPhotoFilled } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'
import styles from './Gallery.module.css'
function Gallery({ images }: { images: Array<{ file_url: string; filename: string; id: string }> }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Flex pos="relative" direction="column" align="center" justify="center" h="100%">
        <InView
          variants={{
            hidden: {
              opacity: 0,
              x: -100,
            },
            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          viewOptions={{ margin: '0px 0px -200px 0px' }}
        >
          <Title c="wedding-red.9" ta="center" fw={400} fz={{ base: 48, sm: 56 }} mt={16} mb={8}>
            Thư viện ảnh
          </Title>
        </InView>
        <InView
          variants={{
            hidden: {
              opacity: 0,
              x: 100,
            },
            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          viewOptions={{ margin: '0px 0px -200px 0px' }}
        >
          <Carousel
            controlSize={36}
            withControls
            draggable
            height="100%"
            slideGap="sm"
            slideSize={{
              base: '100%',
              sm: '50%',
              md: '33.333333%',
              lg: '25%',
              xl: '20%',
            }}
            classNames={styles}
          >
            {images.map((image, index: number) => (
              <Carousel.Slide
                key={image.id}
                h="100%"
                w="100%"
                pos="relative"
                onClick={() => {
                  setCurrentIndex(index)
                  setOpened(true)
                }}
              >
                <Image radius="lg" fit="contain" h={{ base: 450, sm: 500 }} alt={image.filename} src={image.file_url} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </InView>

        <Button component={Link} href="/thu-vien" size="lg" variant="filled" color="yellow.6" c="black" leftSection={<IconPhotoFilled />} mt={16}>
          Xem toàn bộ ảnh
        </Button>
      </Flex>

      <LightBox
        images={images.map((image) => ({
          id: image.id,
          type: 'portrait',
          src: image.file_url,
        }))}
        currentIndex={currentIndex}
        opened={opened}
        onClose={() => setOpened(false)}
        onPrevious={() => setCurrentIndex((prev) => prev - 1)}
        onNext={() => setCurrentIndex((prev) => prev + 1)}
      />
    </>
  )
}

export { Gallery }
