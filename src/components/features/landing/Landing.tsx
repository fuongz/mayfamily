import { InView } from '@/components/motions/in-view/InView'
import { Box, Flex, Image, Text, Title } from '@mantine/core'

function Landing() {
  return (
    <Box>
      <InView
        variants={{
          hidden: {
            opacity: 0,
          },
          visible: {
            opacity: 1,
          },
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <Box>
          <Text c="wedding-red.9" ff="var(--font-title)" fz={{ base: 36, sm: 64 }} mb={8}>
            LỄ VU QUY
          </Text>
          <Title c="wedding-red.9" fw={400} fz={{ base: 68, sm: 72 }}>
            Hồng Trinh
          </Title>
          <Title c="wedding-red.9" fw={400} fz={{ base: 68, sm: 72 }}>
            &
          </Title>
          <Title c="wedding-red.9" fw={400} fz={{ base: 68, sm: 72 }}>
            Thế Phương
          </Title>
          <Flex justify="center" mt={16}>
            <Image alt="chu-hy-landing" src="/images/chu-hy.png" w={200} h={200} />
          </Flex>
          <Text c="wedding-red.9" ff="var(--font-title)" fz={{ base: 56, sm: 64 }}>
            25-05-2025
          </Text>
          <Text c="wedding-red.9" ff="var(--font-title)" fz={{ base: 24, sm: 64 }}>
            (28-4 ÂL)
          </Text>
        </Box>
      </InView>
    </Box>
  )
}

export { Landing }
