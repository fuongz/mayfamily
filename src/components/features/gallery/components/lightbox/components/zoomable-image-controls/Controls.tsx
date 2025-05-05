import { ActionIcon, Box } from "@mantine/core";
import { Group } from "@mantine/core";
import { IconZoomCancel, IconZoomIn, IconZoomOut } from "@tabler/icons-react";

const ZoomableImageControls = ({
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

export { ZoomableImageControls };
