import { InView } from "@/components/motions/in-view/InView";
import { Carousel } from "@mantine/carousel";
import { Button, Flex, Image, Title } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import Link from "next/link";

function Gallery() {
  return (
    <Flex
      pos="relative"
      direction="column"
      align="center"
      justify="center"
      h="100%"
    >
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
        transition={{ duration: 0.5, ease: "easeInOut" }}
        viewOptions={{ margin: "0px 0px -200px 0px" }}
      >
        <Title
          c="wedding-red.9"
          ta="center"
          fw={400}
          fz={{ base: 48, sm: 56 }}
          mb={32}
        >
          Thư viện ảnh
        </Title>
      </InView>
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
        transition={{ duration: 0.5, ease: "easeInOut" }}
        viewOptions={{ margin: "0px 0px -200px 0px" }}
      >
        <Carousel
          controlSize={36}
          loop
          withControls
          slideSize="70%"
          height="100%"
          align="start"
          slideGap="sm"
        >
          {[...Array(20)].map((_, index: number) => (
            <Carousel.Slide key={`gallery-${index}`}>
              <Image
                radius="lg"
                alt={`gallery-${index}`}
                src={`/images/gallery/image-${
                  index < 9 ? `0${index + 1}` : index + 1
                }.jpg`}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </InView>

      <Button
        component={Link}
        href="/thu-vien"
        size="lg"
        variant="filled"
        color="yellow.6"
        c="black"
        leftSection={<IconPhoto />}
        mt={16}
      >
        Xem album
      </Button>
    </Flex>
  );
}

export { Gallery };
