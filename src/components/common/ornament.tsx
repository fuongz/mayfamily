import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export type OrnamentVariant = "divider"

export type OrnamentProps = Omit<ComponentProps<"svg">, "children"> & {
  /**
   * - `divider`: a single 1px hairline rule (240 wide)
   */
  variant?: OrnamentVariant
}

const VIEWBOX: Record<OrnamentVariant, string> = {
  divider: "0 0 240 2",
}

const DEFAULT_CLASS: Record<OrnamentVariant, string> = {
  divider: "h-px w-48 text-rule",
}

/**
 * Hairline rules, in currentColor. Always aria-hidden.
 * Hairlines use a non-scaling 1px stroke, so they stay 1px at any size.
 */
export function Ornament({ variant = "divider", className, ...props }: OrnamentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX[variant]}
      preserveAspectRatio={variant === "divider" ? "none" : undefined}
      aria-hidden="true"
      focusable="false"
      data-slot="ornament"
      data-variant={variant}
      stroke="currentColor"
      fill="none"
      className={cn("shrink-0", DEFAULT_CLASS[variant], className)}
      {...props}
    >
      {variant === "divider" && (
        <path d="M0 1H240" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      )}

    </svg>
  )
}
