import { Masonry } from "@/components/features/gallery/components";
import { URL } from "@/config/url";
import { Container, Title } from "@mantine/core";

async function GalleryPage() {
  const res = await fetch(URL.CDN_URL + "/gallery.json");
  const images = await res.json();
  return (
    <Container size="100%" p={4}>
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
