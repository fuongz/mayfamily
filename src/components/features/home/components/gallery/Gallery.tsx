import { InView } from "@/components/motions/in-view/InView";
import { Carousel } from "@mantine/carousel";
import { Button, Flex, Image, Title } from "@mantine/core";
import { IconPhotoFilled } from "@tabler/icons-react";
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
          mt={16}
          mb={8}
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
          height="100%"
          align="start"
          slideGap="sm"
          slideSize={{
            base: "100%",
            sm: "50%",
            md: "33.333333%",
            lg: "25%",
            xl: "20%",
          }}
        >
          {[...Array(20)].map((_, index: number) => (
            <Carousel.Slide
              key={`gallery-${index}`}
              h="100%"
              w="100%"
              pos="relative"
            >
              <Image
                radius="lg"
                fit="contain"
                h={{ base: 450, sm: 500 }}
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
        leftSection={<IconPhotoFilled />}
        mt={16}
      >
        Xem toàn bộ
      </Button>
    </Flex>
  );
}

export { Gallery };
