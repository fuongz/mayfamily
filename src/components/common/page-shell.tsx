import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pageShellVariants = cva("mx-auto w-full px-4 sm:px-6", {
  variants: {
    width: {
      prose: "max-w-2xl",
      default: "max-w-5xl",
      wide: "max-w-7xl",
      full: "max-w-none",
    },
    spacing: {
      default: "py-12 sm:py-20",
      compact: "py-6 sm:py-10",
      none: "",
    },
  },
  defaultVariants: { width: "default", spacing: "default" },
})

export type PageShellProps = ComponentProps<"div"> & VariantProps<typeof pageShellVariants>

/**
 * Centered page column. The root route already renders <main> and paints the
 * page background on <body>, so this is a plain <div>.
 */
export function PageShell({ className, width, spacing, ...props }: PageShellProps) {
  return (
    <div
      data-slot="page-shell"
      className={cn(pageShellVariants({ width, spacing }), className)}
      {...props}
    />
  )
}
