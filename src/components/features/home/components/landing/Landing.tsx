import { InView } from '@/components/motions/in-view/InView'
import { CONFIG, SIDE } from '@/constants/data'
import { Box, Flex, Image, Text, Title } from '@mantine/core'

function Landing() {
  return (
    <Flex justify="center" align="center" h="100%">
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
        <Box ta="center">
          <Text c="wedding-red.9" ff="var(--font-title)" fz={{ base: 28, sm: 64 }} mb={8}>
            {CONFIG[SIDE].title}
          </Text>
          <Title c="wedding-red.9" fw={400} fz={{ base: 56, sm: 72 }}>
            {CONFIG[SIDE].name}
          </Title>
          <Title c="wedding-red.9" fw={400} fz={{ base: 48, sm: 72 }}>
            &
          </Title>
          <Title c="wedding-red.9" fw={400} fz={{ base: 56, sm: 72 }}>
            {CONFIG[SIDE].name_2}
          </Title>
          <Flex justify="center" mt={16}>
            <Image alt="chu-hy-landing" src="/images/chu-hy.png" w={200} h={200} />
          </Flex>
          <Text c="wedding-red.9" ff="var(--font-title)" fz={{ base: 48, sm: 64 }}>
            {CONFIG[SIDE].date}
          </Text>
          <Text c="wedding-red.9" ff="var(--font-title)" fz={{ base: 20, sm: 64 }}>
            ({CONFIG[SIDE].date_lunar} ÂL)
          </Text>
        </Box>
      </InView>
    </Flex>
  )
}

export { Landing }
