import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import type { InvitationPrint } from "@/types"

import { Crest } from "./crest"

/*
 * The card's panels, typeset after the print. Every size is in container
 * units (cqw of the panel), so the card keeps its proportions from a phone
 * to a desktop the way the paper does.
 */

/** One panel of card stock; must sit inside an `@container` as wide as the panel. */
export function Panel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // At least the printed panel's proportion (527 × 745), measured against
        // the card frame's width (the frame is the size container); grows with
        // its text. Not clipped: the die-cut magnolia stands above the edge.
        "@container relative flex min-h-[141.4cqw] flex-col border border-ink/30 bg-paper text-ink",
        "shadow-[0_1px_2px_rgb(0_0_0/0.06),0_12px_32px_-12px_rgb(0_0_0/0.25)]",
        className
      )}
      {...props}
    />
  )
}

/** How far the die-cut flower rises above the panel, in panel widths (see OpeningInvitation). */
export const MAGNOLIA_RISE = 0.18
const MAGNOLIA_TOP = "-top-[18cqw]"

const small = "font-heading text-[max(0.75rem,3.1cqw)] leading-snug"
const display = "font-heading font-light uppercase leading-[1.05] tracking-[0.01em]"

/** Left panel: the magnolia, both families, the couple, the ceremony at home. */
export function PanelFamilies({ print }: { print: InvitationPrint }) {
  const [left, right] = print.families
  const [first, second] = print.couple
  return (
    <>
      {/* Die-cut like the print: the flower stands up past the top edge. */}
      <img
        src="/images/invitation/magnolia.webp"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={cn("absolute left-[2%] w-[76%] drop-shadow-[0_2px_2px_rgb(0_0_0/0.08)]", MAGNOLIA_TOP)}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-[3.2cqw] px-[7%] pt-[50%] pb-[8%] text-center">
        <div className="grid w-full grid-cols-2 gap-x-[4cqw]">
          {[left, right].map((family, i) => (
            <p key={i} className={cn(small, "text-[max(0.7rem,2.7cqw)]", i === 0 ? "text-right" : "text-left")}>
              <span className="block">Ông Bà</span>
              {family.parents.map((name) => (
                <span key={name} className="block font-semibold uppercase">
                  {name}
                </span>
              ))}
            </p>
          ))}
        </div>

        <p className={cn(small, "font-medium")}>{print.announcement}</p>

        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-[2.5cqw]">
          <PersonName person={first} align="right" />
          <span aria-hidden className="font-title text-[7cqw] italic">&amp;</span>
          <PersonName person={second} align="left" />
        </div>

        <div className={cn(small, "flex flex-col gap-[1.6cqw]")}>
          <p className="font-medium">{print.homeCeremony.title}</p>
          <p>
            {print.homeCeremony.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </>
  )
}

function PersonName({ person, align }: { person: InvitationPrint["couple"][number]; align: "left" | "right" }) {
  return (
    <p className={align === "right" ? "text-right" : "text-left"}>
      <span className={cn(display, "block text-[5.4cqw] whitespace-nowrap")}>
        {person.surname}
        <span className="block">{person.given}</span>
      </span>
      <span className={cn(small, "mt-[1.5cqw] block")}>{person.role}</span>
    </p>
  )
}

/** Right panel: crest, the reception venue and time. */
export function PanelReception({ print, guest }: { print: InvitationPrint; guest?: string }) {
  const { reception } = print
  return (
    <div className="relative flex flex-1 flex-col items-center gap-[3.4cqw] px-[8%] pt-[6%] pb-[8%] text-center">
      <Crest crest={print.crest} className="w-[40%]" />
      <p className={small}>Trân trọng kính mời</p>
      {guest ? (
        <GuestName name={guest} className="-my-[1cqw] w-[92%] border-b border-dotted border-ink/30 pb-[1cqw] text-[5.4cqw] text-balance" />
      ) : (
        <span aria-hidden className="h-px w-[68%] bg-ink/25" />
      )}
      <p className={small}>{reception.intro}</p>

      <div className="flex flex-col items-center gap-[1cqw]">
        <p className={cn(display, "text-[6.4cqw]")}>
          {reception.venue.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        {reception.hall && <p className={cn(display, "text-[3.8cqw]")}>{reception.hall}</p>}
        <p className={cn(small, "font-medium")}>
          {reception.address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="flex flex-col items-center gap-[1cqw]">
        <p className={cn(display, "text-[6.8cqw]")}>
          <span className="block">{reception.time}</span>
          <span className="block">{reception.date}</span>
        </p>
        <p className={small}>{reception.lunar}</p>
      </div>

      <p className={small}>
        {reception.closing.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      {reception.schedule && <p className={cn(small, "font-semibold")}>{reception.schedule}</p>}
    </div>
  )
}

/** The guest's name, handwritten in pink as on the printed cards. */
export function GuestName({ name, className }: { name: string; className?: string }) {
  return <p className={cn("text-center font-hand leading-tight text-pen", className)}>{name}</p>
}
