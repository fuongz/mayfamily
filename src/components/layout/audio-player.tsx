import { useCallback, useEffect, useRef, useState } from "react"
import { MotionConfig, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MusicNote01Icon, VolumeOffIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { LibraryLink } from "./library-link"
import { MusicPromptDialog } from "./music-prompt-dialog"
import { ThemeToggle, cornerButtonClassName } from "./theme-toggle"

const tracks = [
  { src: "/audio/Until_I_Found_You.mp3", title: "Until I Found You" },
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
]

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const continueOnTrackChange = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const track = tracks[currentIndex]

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setIsPlaying(true)
    audio.play().catch(() => setIsPlaying(false))
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = () => (isPlaying ? pause() : play())

  // After a track ends, start the next one once its src is swapped in.
  useEffect(() => {
    if (!continueOnTrackChange.current) return
    continueOnTrackChange.current = false
    play()
  }, [currentIndex, play])

  return (
    <>
      <MusicPromptDialog onPlayMusic={play} />
      {/* Library, theme switch + music, one row top-right on every page.
          Own view-transition name: stays put while pages cross-fade.
          z-40: below dialogs (z-50) so the lightbox and its tooltips cover it.
          Same `initial` on server and client; MotionConfig drops the slide
          (keeps the fade) for reduced motion, so hydration markup matches. */}
      <MotionConfig reducedMotion="user">
      <motion.div
        className="fixed top-4 right-4 z-40 flex items-center gap-2 [view-transition-name:corner-controls]"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <audio
          ref={audioRef}
          src={track.src}
          preload="none"
          onEnded={() => {
            continueOnTrackChange.current = true
            setCurrentIndex((index) => (index + 1) % tracks.length)
          }}
        />
        <LibraryLink />
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ornate"
                size="icon-lg"
                className={cn(
                  cornerButtonClassName,
                  isPlaying
                    ? "border-foreground bg-foreground text-background hover:bg-foreground/85"
                    : "text-muted-foreground"
                )}
                onClick={togglePlay}
                aria-label={isPlaying ? `Tạm dừng nhạc: ${track.title}` : `Phát nhạc: ${track.title}`}
                aria-pressed={isPlaying}
              />
            }
          >
            {isPlaying ? (
              <HugeiconsIcon
                icon={MusicNote01Icon}
                strokeWidth={2}
                className="size-5 motion-safe:animate-spin motion-safe:[animation-duration:3s]"
              />
            ) : (
              <HugeiconsIcon icon={VolumeOffIcon} strokeWidth={2} className="size-5" />
            )}
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" className="flex-col items-start gap-0.5">
            <span className="text-[0.65rem] tracking-[0.16em] uppercase opacity-70">
              {isPlaying ? "Đang phát" : "Đã tạm dừng"}
            </span>
            <span className="font-medium">{track.title}</span>
          </TooltipContent>
        </Tooltip>
      </motion.div>
      </MotionConfig>
    </>
  )
}
