import { CONFIG, SIDE } from '@/constants/data'
import { AspectRatio, Button, Container, Flex, Image, Stack, Text, Title } from '@mantine/core'
import { IconHeartFilled, IconMapSearch } from '@tabler/icons-react'
function Maps() {
  return (
    <Container h="100%" fluid>
      <Flex direction="column" ta="center" justify="center" align="center" h="100%">
        <Title pt={16} c="wedding-red.9" ta="center" fw={400} fz={{ base: 48, sm: 56 }}>
          Bản đồ
        </Title>

        <Flex direction="column" w="100%">
          <AspectRatio ratio={16 / 9} w="100%" h={{ base: 200, sm: 500 }}>
            <iframe title="map" src={CONFIG[SIDE].map} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </AspectRatio>

          <Stack align="center" justify="center">
            <Button component="a" href={CONFIG[SIDE].map_direction} size="lg" variant="filled" color="yellow.6" c="black" leftSection={<IconMapSearch />} target="_blank" mt={8}>
              Tìm đường
            </Button>
            <Text c="wedding-red.9" ta="center" fw={500} className="text-shadow">
              Made with
              <IconHeartFilled
                style={{
                  display: 'inline-block',
                  marginLeft: 4,
                  marginRight: 4,
                }}
                size={16}
              />
              by Trinh & Phương
            </Text>
            <Image src="/images/wedding-cartoon.png" alt="map" w="100px" mt={8} />
          </Stack>
        </Flex>
      </Flex>
    </Container>
  )
}

export { Maps }
