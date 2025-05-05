import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { ZoomableImageControls } from "../.";
import React, { useRef } from "react";
import { Image } from "@mantine/core";

interface Props {
  src: string;
  alt?: string;
}

function ZoomableImage({ src, alt }: Props) {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  return (
    src && (
      <TransformWrapper
        disablePadding
        smooth
        initialScale={1}
        ref={transformComponentRef}
      >
        {(utils) => (
          <React.Fragment>
            <ZoomableImageControls {...utils} />
            <TransformComponent>
              <Image src={src} alt={alt || ""} fit="contain" w="auto" />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    )
  );
}

export { ZoomableImage };
