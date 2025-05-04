"use client";

import { Modal, ActionIcon, Group, Image, Box } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconX,
  IconZoomCancel,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import React, { useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

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
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  useHotkeys([
    ["ArrowLeft", onPrevious],
    ["ArrowRight", onNext],
    ["Escape", onClose],
  ]);

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
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "100%",
          zIndex: 101,
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
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
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 101,
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
        <TransformWrapper
          disablePadding
          smooth
          initialScale={1}
          ref={transformComponentRef}
        >
          {(utils) => (
            <React.Fragment>
              <Controls {...utils} />
              <TransformComponent>
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || ""}
                  fit="contain"
                  w="auto"
                />
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      )}
    </Modal>
  );
}

const Controls = ({
  zoomIn,
  zoomOut,
  resetTransform,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
}) => (
  <Group
    pos="absolute"
    top={8}
    gap={8}
    left={8}
    style={{ zIndex: 101, pointerEvents: "auto" }}
  >
    <Box
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 8,
      }}
    >
      <ActionIcon
        variant="transparent"
        c="white"
        size={36}
        onClick={() => zoomIn()}
      >
        <IconZoomIn size={16} />
      </ActionIcon>
    </Box>
    <Box
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        borderRadius: 8,
      }}
    >
      <ActionIcon
        variant="transparent"
        c="white"
        size={36}
        onClick={() => zoomOut()}
      >
        <IconZoomOut size={16} />
      </ActionIcon>
    </Box>

    <Box
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        borderRadius: 8,
      }}
    >
      <ActionIcon
        variant="transparent"
        c="white"
        size={36}
        onClick={() => resetTransform()}
      >
        <IconZoomCancel size={16} />
      </ActionIcon>
    </Box>
  </Group>
);
