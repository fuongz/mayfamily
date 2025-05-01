import React, { useRef } from "react";
import { InvitationEnvelope } from "@/components/features/invitation-envelope/InvitationEnvelope";
import { Introduce } from "@/components/features/introduce/Introduce";
import { Quote } from "@/components/features/quote/Quote";
import { Landing } from "@/components/features/landing/Landing";
import { Box, Image, Transition } from "@mantine/core";
import { useMediaQuery, useMounted } from "@mantine/hooks";
import { Gallery } from "@/components/features/gallery/Gallery";
import FullScreenScroll from "@/components/animations/full-screen-scroll/FullScreenScroll";
import { Map } from "@/components/features/maps/Map";
function Home() {
  const mounted = useMounted();
  const container = useRef<HTMLDivElement | null>(null);
  const matches = useMediaQuery("(min-width: 56.25em)");
  return (
    <div ref={container}>
      <Box>
        <Transition
          mounted={mounted}
          transition="fade-down"
          duration={700}
          timingFunction="ease"
        >
          {(transitionStyles) => (
            <Box
              style={transitionStyles}
              hiddenFrom="sm"
              pos="fixed"
              w="100wh"
              top={0}
              left={0}
            >
              <Image
                alt="background-top"
                src="/images/bg.png"
                style={{ objectFit: "cover" }}
              />
            </Box>
          )}
        </Transition>

        <FullScreenScroll>
          <Landing />
          {!matches && <Quote />}
          {!matches && <Introduce />}
          {!matches && <Gallery />}
          <InvitationEnvelope />
          <Map />
        </FullScreenScroll>

        <Transition
          mounted={mounted}
          transition="fade-down"
          duration={700}
          timingFunction="ease"
        >
          {(transitionStyles) => (
            <Box
              style={transitionStyles}
              hiddenFrom="sm"
              className="transform rotate-180"
              pos="fixed"
              w="100%"
              bottom={0}
              left={0}
            >
              <Image
                alt="background-bottom"
                src="/images/bg.png"
                style={{ objectFit: "cover" }}
              />
            </Box>
          )}
        </Transition>
      </Box>
    </div>
  );
}

export { Home };
