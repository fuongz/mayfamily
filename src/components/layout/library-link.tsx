import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Album02Icon } from "@hugeicons/core-free-icons"

import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { cornerButtonClassName } from "./theme-toggle"

/** Corner shortcut to the photo library (/thu-vien); inverted while you are there. */
export function LibraryLink() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            to="/thu-vien"
            aria-label="Thư viện ảnh"
            className={cn(
              buttonVariants({ variant: "ornate", size: "icon-lg" }),
              cornerButtonClassName,
              "data-[status=active]:border-foreground data-[status=active]:bg-foreground data-[status=active]:text-background"
            )}
            activeProps={{ "aria-current": "page" }}
          />
        }
      >
        <HugeiconsIcon icon={Album02Icon} strokeWidth={2} className="size-5" />
      </TooltipTrigger>
      <TooltipContent side="bottom">Thư viện ảnh</TooltipContent>
    </Tooltip>
  )
}
