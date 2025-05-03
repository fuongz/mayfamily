import { Modal, ActionIcon, Group, Image } from "@mantine/core";
import {
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconX,
} from "@tabler/icons-react";

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
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      styles={{
        root: {
          padding: 0,
          zIndex: 101,
        },
        body: {
          padding: 0,
        },
        content: {
          overflow: "hidden",
        },
      }}
    >
      <Group
        pos="fixed"
        top={8}
        right={8}
        gap="xs"
        style={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "100%",
        }}
      >
        <ActionIcon variant="transparent" c="white" size={36} onClick={onClose}>
          <IconX size={16} />
        </ActionIcon>
      </Group>

      <Group
        pos="fixed"
        justify="space-between"
        left={0}
        right={0}
        bottom={0}
        style={{
          pointerEvents: "none",
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <ActionIcon
          variant="transparent"
          size={48}
          radius="0"
          color="rgba(255, 255, 255, 1)"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          style={{ pointerEvents: "auto" }}
        >
          <IconChevronLeftPipe size={24} />
        </ActionIcon>

        <ActionIcon
          variant="transparent"
          radius="0"
          color="rgba(255, 255, 255, 1)"
          size={48}
          onClick={onNext}
          disabled={currentIndex === images.length - 1}
          style={{ pointerEvents: "auto", marginLeft: "auto" }}
        >
          <IconChevronRightPipe size={24} />
        </ActionIcon>
      </Group>

      {currentImage && (
        <Image
          src={currentImage.src}
          alt={currentImage.alt || ""}
          fit="contain"
          w="auto"
        />
      )}
    </Modal>
  );
}
