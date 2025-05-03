"use client";

import { ActionIcon, Box, Transition } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconMusic, IconMusicOff } from "@tabler/icons-react";
import { useRef, useState } from "react";

const audios = [
  {
    src: "/audio/Until_I_Found_You.mp3",
    title: "Until I Found You",
  },
  {
    src: "/audio/Put_Your_Head_On_My_Shoulder.mp3",
    title: "Put Your Head On My Shoulder",
  },
  {
    src: "/audio/Cant_Help_Falling_In_Love.mp3",
    title: "Can't Help Falling In Love",
  },
  {
    src: "/audio/I_Think_They_Call_This_Love.mp3",
    title: "I Think They Call This Love",
  },
];

function AudioPlayer() {
  const mounted = useMounted();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
            src={audios[currentIndex].src}
            onEnded={() => {
              const nextIndex = (currentIndex + 1) % audios.length;
              setCurrentIndex(nextIndex);
              audioRef.current?.addEventListener("canplay", () => {
                audioRef.current?.play();
              });
            }}
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
