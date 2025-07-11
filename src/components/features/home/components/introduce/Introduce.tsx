import { InView } from '@/components/motions/in-view/InView'
import { Box, Flex, Grid, Image, Text, Title } from '@mantine/core'

function Introduce({ side }: { side: any }) {
  return (
    <Flex direction="column" pos="relative" h="100%" pt={16}>
      <Box pos="absolute" top={16} left={'50%'} style={{ transform: 'translateX(-50%)' }}>
        <Image alt="chu-hy-top" src="/images/chu-hy-top.png" w={{ base: 128, sm: 148 }} h={{ base: 128, sm: 148 }} />
      </Box>
      <Grid columns={2} px={{ base: 32, sm: 32 }} mt={100}>
        <Grid.Col span={1} pos="relative">
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
            <Text className="z-10" pos="relative" ta="left" c="wedding-red.9" ff="var(--font-title)" fz={{ base: 24, sm: 36 }} mb={8}>
              {side.introduce.left_side_title}
            </Text>
            <Title className="z-10" pos="relative" ta="left" c="wedding-red.9" fw={400} fz={{ base: 48, sm: 56 }}>
              {side.introduce.left_side_name}
            </Title>
          </InView>
        </Grid.Col>
        <Grid.Col span={1} pos="relative">
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
            <Text className="z-10" pos="relative" c="wedding-red.9" ta="right" ff="var(--font-title)" fz={{ base: 24, sm: 36 }} mb={8}>
              {side.introduce.right_side_title}
            </Text>
            <Title className="z-10" pos="relative" c="wedding-red.9" ta="right" fw={400} fz={{ base: 48, sm: 56 }}>
              {side.introduce.right_side_name}
            </Title>
          </InView>
        </Grid.Col>
      </Grid>
      <Box pos="absolute" bottom={0} left={0}>
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
          viewOptions={{ margin: '0px 0px -300px 0px' }}
        >
          <Image alt={side.introduce.left_side_title} src={side.introduce.left_side_avatar} w={{ sm: 400, base: 200 }} h={{ sm: 800, base: 400 }} />
        </InView>
      </Box>

      <Box pos="absolute" bottom={0} right={0}>
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
          viewOptions={{ margin: '0px 0px -300px 0px' }}
        >
          <Image alt={side.introduce.right_side_title} src={side.introduce.right_side_avatar} w={{ sm: 400, base: 200 }} h={{ sm: 800, base: 400 }} />
        </InView>
      </Box>
    </Flex>
  )
}

export { Introduce }
