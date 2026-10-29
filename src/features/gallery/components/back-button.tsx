import { Link, type LinkProps } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"

import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/** Fixed top-left "back" link of the library pages. */
export function BackButton({ to, label }: { to: LinkProps["to"]; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            to={to}
            aria-label={label}
            className={cn(
              buttonVariants({ variant: "ornate", size: "icon-lg" }),
              "fixed top-4 left-4 z-40 size-11 border-rule bg-background/90 backdrop-blur-sm hover:border-foreground"
            )}
          />
        }
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} className="size-5" />
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
