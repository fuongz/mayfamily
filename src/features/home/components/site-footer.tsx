import { HugeiconsIcon } from "@hugeicons/react"
import { FavouriteIcon } from "@hugeicons/core-free-icons"

import { Ornament } from "@/components/common"

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-5 px-4 pt-12 pb-28 text-center">
      <Ornament variant="divider" className="w-16" />
      <p className="caption">
        Made with
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={14}
          aria-hidden
          className="mx-1 inline-block fill-current align-[-2px] text-foreground"
        />
        <span className="sr-only">love</span> by{" "}
        <span className="text-foreground">Trinh &amp; Phương</span>
      </p>
    </footer>
  )
}
