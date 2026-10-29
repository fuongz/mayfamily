import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { HugeiconsIcon } from "@hugeicons/react"
import { GridViewIcon, Orbit01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

export type AlbumView = "ring" | "grid"

const OPTIONS = [
  { value: "ring", label: "Vòng ảnh", icon: Orbit01Icon },
  { value: "grid", label: "Lưới", icon: GridViewIcon },
] as const

/** Two-option segmented control: photo ring or masonry grid. */
export function AlbumViewToggle({
  value,
  onValueChange,
  className,
}: {
  value: AlbumView
  onValueChange: (value: AlbumView) => void
  className?: string
}) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onValueChange(next[0] as AlbumView)
      }}
      aria-label="Kiểu xem album"
      className={cn(
        "inline-flex items-stretch hairline bg-background",
        className
      )}
    >
      {OPTIONS.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          className={cn(
            "inline-flex h-9 pointer-coarse:h-11 items-center gap-2 px-3.5 text-[0.6875rem] font-medium tracking-[0.16em] text-muted-foreground uppercase outline-none select-none not-first:border-s not-first:border-rule",
            "transition-colors duration-150 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
            "data-pressed:bg-foreground data-pressed:text-background"
          )}
        >
          <HugeiconsIcon icon={option.icon} strokeWidth={2} className="size-3.5" />
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
