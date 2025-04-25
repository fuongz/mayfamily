import { Carousel } from '@mantine/carousel'
import { Box, Image, Title } from '@mantine/core'

function Gallery() {
  return (
    <Box mt={128} p={16}>
      <Title c="wedding-red.9" fw={400} fz={{ base: 48, sm: 56 }} mb={32}>
        Thư viện ảnh
      </Title>
      <Carousel controlSize={36} loop withIndicators slideSize="70%" height="100%" align="start" slideGap="sm">
        {[...Array(3)].map((_, index: number) => (
          <Carousel.Slide key={`gallery-${index}`}>
            <Image src={`/images/gallery/image-${index}.jpg`} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  )
}

export { Gallery }
