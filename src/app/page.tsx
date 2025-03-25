'use client'

import { AnimatedGroup } from '@/components/motions'
import { Flex, Stack, Text, Title } from '@mantine/core'
import Image from 'next/image'

export default function Home() {
  return (
    <Stack p="xl" align="center" justify="center" mih="100vh">
      <AnimatedGroup preset="scale">
        <Title c="red.8" ta="center">
          Trinh + Phương
        </Title>
        <Flex justify="center">
          <Image src="/images/chu-hy.png" width={300} height={300} alt="Chữ hỷ" />
        </Flex>
        <Text mt={32} fz="h3" ta="center" c="red.6">
          Trang web của tụi mình đang trong quá trình hoàn thiện...
        </Text>
      </AnimatedGroup>
    </Stack>
  )
}
