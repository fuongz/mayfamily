"use client";

import { Button, Flex, Group, Image, Modal, Text } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useEffect, useState } from "react";

interface Props {
  onMusicStatusChange: (status: boolean) => void;
}

function InitialModal({ onMusicStatusChange }: Props) {
  const [opened, setOpened] = useState(false);

  const onClose = () => {
    setOpened(false);
  };

  const mounted = useMounted();

  useEffect(() => {
    if (mounted) {
      setOpened(true);
    }
  }, [mounted]);

  return (
    <Modal
      closeOnEscape={false}
      closeOnClickOutside={false}
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
    >
      <Flex justify="center" mb={16}>
        <Image src="/images/wedding-cartoon.png" h={128} alt="music" />
      </Flex>

      <Text fz={18} fw={600} ta="center">
        Nghe nhạc và xem hành trình của chúng mình nhé!
      </Text>

      <Text fs="italic" fz={14} c="gray.6" ta="center" mt={16}>
        Kindly use headphones to enjoy the best experience!
      </Text>

      <Group mt={16} justify="space-between">
        <Button
          variant="filled"
          flex={1}
          color="wedding-red.9"
          onClick={() => {
            onMusicStatusChange(true);
            onClose();
          }}
        >
          Ok luôn 🥳
        </Button>

        <Button variant="transparent" c="wedding-red.9" onClick={onClose}>
          Lúc khác nhé 🥲
        </Button>
      </Group>
    </Modal>
  );
}

export default InitialModal;
