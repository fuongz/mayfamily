"use client";

import { Masonry } from "@/components/features/gallery/components";
import { Container, Title } from "@mantine/core";

const images = [...Array(37)].map((_, index) => ({
  id: index,
  src: `/images/gallery/image-${index < 9 ? `0${index + 1}` : index + 1}.jpg`,
  alt: `Image ${index + 1}`,
}));

function GalleryPage() {
  return (
    <Container size="100%">
      <Title
        c="wedding-red.9"
        ta="center"
        fw={400}
        fz={{ base: 48, sm: 56 }}
        mt={32}
      >
        Thư viện ảnh
      </Title>
      <Masonry items={images} />
    </Container>
  );
}

export default GalleryPage;
