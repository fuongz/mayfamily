import { useEffect, useState } from "react"

import { Ornament } from "@/components/common"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type MusicPromptDialogProps = {
  /** Called when the visitor accepts ("Ok luôn 🥳"); the dialog then closes. */
  onPlayMusic: () => void
}

/** Remembers that the visitor already answered, so the prompt is asked once. */
const ANSWERED_KEY = "mayfamily:music-prompt"

function hasAnswered() {
  try {
    return window.localStorage.getItem(ANSWERED_KEY) !== null
  } catch {
    return false
  }
}

function rememberAnswer(answer: "play" | "skip") {
  try {
    window.localStorage.setItem(ANSWERED_KEY, answer)
  } catch {
    // Storage unavailable (private mode, blocked): just ask again next time.
  }
}

/**
 * Asks the visitor whether to play background music. Opens right after
 * mount unless they already answered on this browser, and can only be
 * closed with one of its two buttons. Browsers block autoplay without a
 * click, so a returning visitor starts the music from the player button.
 */
export function MusicPromptDialog({ onPlayMusic }: MusicPromptDialogProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (hasAnswered()) return
    // Open only once the page has loaded and gone idle: the modal marks the
    // rest of the page aria-hidden, and doing that while lazy route content
    // is still hydrating makes React report an attribute mismatch.
    let idle: number | undefined
    let timer: number | undefined
    const show = () => {
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(() => setOpen(true), { timeout: 1500 })
      } else {
        timer = window.setTimeout(() => setOpen(true), 300)
      }
    }
    if (document.readyState === "complete") show()
    else window.addEventListener("load", show, { once: true })
    return () => {
      window.removeEventListener("load", show)
      if (idle !== undefined) window.cancelIdleCallback(idle)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    // onOpenChange is ignored: Esc and outside clicks must not dismiss it.
    <Dialog open={open} onOpenChange={() => {}} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-none bg-card p-6 pt-8 ring-0 hairline sm:max-w-md sm:p-8 sm:pt-10 motion-reduce:animate-none"
      >
        <DialogHeader className="items-center gap-3 text-center">
          <img
            src="/images/wedding-cartoon.png"
            alt=""
            width={128}
            height={128}
            className="w-28 sm:w-32"
          />
          <p className="caption">Âm nhạc</p>
          <DialogTitle className="font-title text-2xl leading-tight font-light tracking-[-0.01em] text-balance">
            Nghe nhạc và xem hành trình của chúng mình nhé!
          </DialogTitle>
          <Ornament variant="divider" className="w-16" />
          <DialogDescription className="font-title text-base italic">
            Kindly use headphones to enjoy the best experience!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="-mx-6 mt-8 -mb-6 items-center gap-3 rounded-none border-rule bg-transparent px-6 py-5 sm:-mx-8 sm:-mb-8 sm:flex-row-reverse sm:justify-between sm:px-8">
          <Button
            variant="cta"
            size="xl"
            className="w-full rounded-none text-sm sm:w-auto"
            onClick={() => {
              rememberAnswer("play")
              onPlayMusic()
              setOpen(false)
            }}
          >
            Ok luôn 🥳
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full rounded-none px-4 text-muted-foreground sm:w-auto"
            onClick={() => {
              rememberAnswer("skip")
              setOpen(false)
            }}
          >
            Đang không tiện nghe 🥲
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
