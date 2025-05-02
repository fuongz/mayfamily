"use client";

import { ActionIcon, Box, Transition } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconMusic, IconMusicOff } from "@tabler/icons-react";
import { useRef, useState } from "react";

const audios = [
  {
    src: "/audio/Elvis_Presley_Cant_Help_Falling_In_Love_Cover_by_Elliot_James_Reay.mp3",
    title: "Elvis Presley - Can't Help Falling in Love",
  },
];

function AudioPlayer() {
  const mounted = useMounted();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Transition
      mounted={mounted}
      transition="fade-down"
      enterDelay={500}
      duration={700}
      timingFunction="ease"
    >
      {(transitionStyles) => (
        <Box
          style={{
            ...transitionStyles,
            zIndex: 1000,
          }}
          pos="fixed"
          top={16}
          right={16}
        >
          <audio
            ref={audioRef}
            src={audios[0].src}
            onEnded={() => setIsPlaying(false)}
          />
          <ActionIcon
            size={56}
            autoContrast
            color="wedding-red.9"
            radius="xl"
            onClick={togglePlay}
            aria-label="Play/pause"
          >
            {isPlaying ? (
              <IconMusic className="animate-spin duration-700" />
            ) : (
              <IconMusicOff />
            )}
          </ActionIcon>
        </Box>
      )}
    </Transition>
  );
}

export { AudioPlayer };
