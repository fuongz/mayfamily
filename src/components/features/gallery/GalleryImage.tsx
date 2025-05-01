import { Image, Skeleton } from "@mantine/core";
import { useState } from "react";

interface GalleryImageProps {
  src: string;
}

function GalleryImage({ src }: GalleryImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Skeleton height={400} />}
      <Image
        src={src}
        loading="lazy"
        fit="contain"
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? "none" : "block" }}
      />
    </>
  );
}

export { GalleryImage };
