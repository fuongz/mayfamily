'use client'

import { Button, Flex, Image, Modal, Text } from '@mantine/core'
import { useMounted } from '@mantine/hooks'
import { useEffect, useState } from 'react'

interface Props {
  onMusicStatusChange: (status: boolean) => void
}

function InitialModal({ onMusicStatusChange }: Props) {
  const [opened, setOpened] = useState(false)

  const onClose = () => {
    setOpened(false)
  }

  const mounted = useMounted()

  useEffect(() => {
    if (mounted) {
      setOpened(true)
    }
  }, [mounted])

  return (
    <Modal closeOnEscape={false} closeOnClickOutside={false} opened={opened} onClose={onClose} centered size={480} withCloseButton={false}>
      <Flex justify="center" mb={16}>
        <Image src="/images/wedding-cartoon.png" w={128} alt="music" />
      </Flex>

      <Text fz={18} fw={600} ta="center">
        Nghe nhạc và xem hành trình của chúng mình nhé!
      </Text>

      <Text fs="italic" fz={14} c="gray.6" ta="center" mt={8}>
        Kindly use headphones to enjoy the best experience!
      </Text>

      <Flex gap={16} mt={{ base: 16, md: 48 }} direction={{ base: 'column', md: 'row' }} align="center" w="100%" justify="space-between">
        <Button
          variant="filled"
          size="lg"
          w={{ base: '100%', md: 'auto' }}
          color="wedding-red.9"
          onClick={() => {
            onMusicStatusChange(true)
            onClose()
          }}
        >
          Ok luôn 🥳
        </Button>

        <Button size="md" variant="transparent" c="gray.7" onClick={onClose}>
          Đang không tiện nghe 🥲
        </Button>
      </Flex>
    </Modal>
  )
}

export default InitialModal
