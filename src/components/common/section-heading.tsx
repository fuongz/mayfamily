import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Ornament } from "./ornament"

/** Museum catalogue number: 1 → "No. 01", 12 → "No. 12". Strings pass through after "No. ". */
export function formatCatalogueNumber(value: number | string): string {
  const digits = typeof value === "number" ? String(value).padStart(2, "0") : value
  return `No. ${digits}`
}

export type SectionHeadingProps = {
  title: ReactNode
  /** Small museum caption above the title, e.g. a date or room name. */
  eyebrow?: ReactNode
  /** Catalogue number shown before the eyebrow as `No. 01`. */
  number?: number | string
  description?: ReactNode
  /** Heading level; defaults to h2. */
  as?: "h1" | "h2" | "h3"
  /** `display` sets the title light and large, at hero scale. */
  size?: "default" | "display"
  align?: "center" | "start"
  /** Hairline rule under the title. */
  ornament?: boolean
  className?: string
  id?: string
}

/** Caption line (No. + eyebrow) + serif title + optional hairline + description. */
export function SectionHeading({
  title,
  eyebrow,
  number,
  description,
  as: Heading = "h2",
  size = "default",
  align = "center",
  ornament = false,
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === "center"
  const hasNumber = number !== undefined && number !== ""
  return (
    <header
      data-slot="section-heading"
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "items-start text-start",
        className
      )}
    >
      {(hasNumber || eyebrow) && (
        <p className="caption flex flex-wrap items-center gap-x-3 gap-y-1">
          {hasNumber && <span className="text-foreground">{formatCatalogueNumber(number)}</span>}
          {hasNumber && eyebrow && <span aria-hidden className="h-px w-6 bg-rule" />}
          {eyebrow && <span>{eyebrow}</span>}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          "text-foreground",
          size === "display"
            ? "font-title text-5xl leading-[1.02] font-light tracking-[-0.02em] sm:text-7xl"
            : "font-heading text-3xl leading-tight font-normal tracking-[-0.01em] sm:text-4xl"
        )}
      >
        {title}
      </Heading>
      {ornament && (
        <Ornament variant="divider" className="w-16" />
      )}
      {description && (
        <p className="max-w-prose text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </header>
  )
}
