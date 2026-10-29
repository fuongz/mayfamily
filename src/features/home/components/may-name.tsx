import { Link } from "@tanstack/react-router"

import { MAY } from "@/constants/family"
import { cn } from "@/lib/utils"

/** A small paw print in the seal red, Mây's mark next to her name. */
function PawMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("fill-current text-mark", className)}>
      <ellipse cx="12" cy="16.2" rx="5.2" ry="4.4" />
      <ellipse cx="5.4" cy="10.4" rx="2.1" ry="2.7" transform="rotate(-18 5.4 10.4)" />
      <ellipse cx="9.6" cy="6.4" rx="2.1" ry="2.8" transform="rotate(-6 9.6 6.4)" />
      <ellipse cx="14.4" cy="6.4" rx="2.1" ry="2.8" transform="rotate(6 14.4 6.4)" />
      <ellipse cx="18.6" cy="10.4" rx="2.1" ry="2.7" transform="rotate(18 18.6 10.4)" />
    </svg>
  )
}

/**
 * "Mây" in the hero, a link to the day she came home. On devices that can
 * hover, her photo pops up above the name; touch goes straight to her page.
 */
export function MayName({ className }: { className?: string }) {
  return (
    <Link
      to="/ky-niem/$slug"
      params={{ slug: MAY.slug }}
      aria-label={`${MAY.name}, mèo của nhà mình: xem ngày ${MAY.name} về nhà`}
      className={cn("group/may relative inline-flex items-baseline gap-2 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50", className)}
    >
      <img
        src={MAY.avatar}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 mb-3 size-20 -translate-x-1/2 origin-bottom rounded-full border-2 border-background object-cover shadow-[0_10px_24px_-10px_rgb(0_0_0/0.45)]",
          "scale-90 opacity-0 transition-[opacity,scale] duration-200 ease-album",
          "group-hover/may:scale-100 group-hover/may:opacity-100 group-focus-visible/may:scale-100 group-focus-visible/may:opacity-100",
          "motion-reduce:transition-none"
        )}
      />
      <span className="text-foreground underline decoration-rule decoration-1 underline-offset-[0.2em] transition-colors group-hover/may:decoration-foreground">
        {MAY.name}
      </span>
      <PawMark className="size-[0.55em] translate-y-[-0.05em]" />
    </Link>
  )
}
