import type { ComponentProps, ReactElement, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Square hairline control on the gallery-wall overlay: black on white by day,
 * white on black at night; fills on hover. Flat, no shadow.
 */
export const lightboxControlClassName =
  "rounded-none border border-rule bg-background/90 text-foreground backdrop-blur-sm hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-35"

/** Icon button with a tooltip, for the lightbox chrome. */
export function LightboxControl({
  label,
  children,
  render,
  ...props
}: Omit<ComponentProps<typeof Button>, "render"> & {
  label: string
  children: ReactNode
  /** Element the trigger renders as (defaults to a Button). */
  render?: ReactElement
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          render ?? (
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label={label}
              {...props}
              className={cn("size-10", lightboxControlClassName, props.className)}
            />
          )
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
