import { AspectRatio, Container, Flex, Title } from '@mantine/core'

function MV() {
  return (
    <Container h="100%" fluid>
      <Flex direction="column" ta="center" justify="center" align="center" h="100%">
        <Title pt={16} c="wedding-red.9" ta="center" fw={400} fz={{ base: 48, sm: 56 }}>
          Video
        </Title>
      </Flex>

      <Flex direction="column" w="100%">
        <AspectRatio ratio={16 / 9}>
          <iframe
            src="https://www.youtube.com/embed/mzJ4vCjSt28"
            title="YouTube video player"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </AspectRatio>
      </Flex>
    </Container>
  )
}

export { MV }
