import { Modal, ActionIcon, Group, Image } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react";

interface LightBoxProps {
  images: {
    id: string | number;
    src: string;
    alt?: string;
  }[];
  currentIndex: number;
  opened: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function LightBox({
  images,
  currentIndex,
  opened,
  onClose,
  onPrevious,
  onNext,
}: LightBoxProps) {
  const currentImage = images[currentIndex];

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false}>
      <Group pos="fixed" top={16} left={16} gap="xs">
        <ActionIcon
          variant="filled"
          color="wedding-red.9"
          radius="xl"
          size={56}
          onClick={onClose}
        >
          <IconX size={24} />
        </ActionIcon>
      </Group>

      <Group pos="fixed" left={16} right={16} style={{ pointerEvents: "none" }}>
        <ActionIcon
          variant="filled"
          color="wedding-red.9"
          radius="xl"
          size={56}
          onClick={onPrevious}
          disabled={currentIndex === 0}
          style={{ pointerEvents: "auto" }}
        >
          <IconArrowLeft size={24} />
        </ActionIcon>

        <ActionIcon
          variant="filled"
          color="wedding-red.9"
          radius="xl"
          size={56}
          onClick={onNext}
          disabled={currentIndex === images.length - 1}
          style={{ pointerEvents: "auto", marginLeft: "auto" }}
        >
          <IconArrowRight size={24} />
        </ActionIcon>
      </Group>

      {currentImage && (
        <Image
          src={currentImage.src}
          alt={currentImage.alt || ""}
          fit="contain"
          h="90vh"
          w="auto"
          style={{ maxWidth: "90vw" }}
        />
      )}
    </Modal>
  );
}
