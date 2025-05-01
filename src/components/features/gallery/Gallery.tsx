import { Carousel } from "@mantine/carousel";
import { Flex, Image, Title } from "@mantine/core";

function Gallery() {
  return (
    <Flex
      pos="relative"
      direction="column"
      align="center"
      justify="center"
      h="100%"
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
              src={`/images/gallery/image-${
                index < 9 ? `0${index + 1}` : index + 1
              }.jpg`}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Flex>
  );
}

export { Gallery };
