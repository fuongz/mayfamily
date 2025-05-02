import {
  SimpleGrid,
  Box,
  Image,
  MantineTheme,
  ActionIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

interface MasonryProps {
  items: {
    id: string | number;
    src: string;
    alt?: string;
  }[];
}

function Masonry({ items }: MasonryProps) {
  return (
    <Box w="100%">
      <ActionIcon
        pos="fixed"
        top={16}
        left={16}
        variant="filled"
        color="wedding-red.9"
        radius="xl"
        size={56}
        component={Link}
        href="/"
      >
        <IconArrowLeft />
      </ActionIcon>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={16}>
        {items.map((item) => (
          <UnstyledButton key={item.id}>
            <Image
              src={item.src}
              alt={item.alt || ""}
              fit="cover"
              styles={(theme: MantineTheme) => ({
                root: {
                  overflow: "hidden",
                  borderRadius: theme.radius.md,
                },
                image: {
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                },
              })}
            />
          </UnstyledButton>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export { Masonry };
