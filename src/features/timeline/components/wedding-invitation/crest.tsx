import { cn } from "@/lib/utils"
import type { InvitationPrint } from "@/types"

/**
 * The oval wreath crest with the couple's names typeset inside (the art has
 * an empty oval). Sizes are in container units, so it scales like print.
 */
export function Crest({ crest, className }: { crest: InvitationPrint["crest"]; className?: string }) {
  const [first, second] = crest.names
  return (
    <div className={cn("@container relative aspect-[560/709]", className)}>
      <img src="/images/invitation/crest.webp" alt="" aria-hidden loading="lazy" decoding="async" className="absolute inset-0 size-full" />
      <p className="absolute inset-x-[24%] top-[27%] bottom-[24%] flex flex-col items-center justify-center text-center font-heading leading-[0.95] font-normal text-ink uppercase">
        <span className="text-[9.5cqw] tracking-[0.02em] text-balance">{first}</span>
        <span className="my-[1cqw] font-title text-[9cqw] normal-case italic">&amp;</span>
        <span className="text-[9.5cqw] tracking-[0.02em] text-balance">{second}</span>
        <span className="mt-[3cqw] text-[4.2cqw] tracking-[0.12em]">{crest.date}</span>
      </p>
    </div>
  )
}
