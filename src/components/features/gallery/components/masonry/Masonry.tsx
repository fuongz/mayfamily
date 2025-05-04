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
import { LightBox } from "../lightbox/LightBox";
import { useState } from "react";
interface MasonryProps {
  items: {
    id: string | number;
    src: string;
    alt?: string;
  }[];
}

function Masonry({ items }: MasonryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opened, setOpened] = useState(false);

  return (
    <>
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

        <SimpleGrid cols={{ base: 3, sm: 5, md: 7, xl: 10 }} spacing={4}>
          {items.map((item, index) => (
            <UnstyledButton
              key={item.id}
              onClick={() => {
                setCurrentIndex(index);
                setOpened(true);
              }}
            >
              <Image
                src={item.src}
                alt={item.alt || ""}
                h={{ base: 150, sm: 170, lg: 200 }}
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

      <LightBox
        images={items.map((item) => ({
          id: item.id,
          src: item.src,
        }))}
        currentIndex={currentIndex}
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        onPrevious={() => {
          if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          }
        }}
        onNext={() => {
          if (currentIndex < items.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
        }}
      />
    </>
  );
}

export { Masonry };
