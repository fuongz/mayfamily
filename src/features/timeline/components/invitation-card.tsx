import { useSearch } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, MapsSearchIcon } from "@hugeicons/core-free-icons"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import { useTimelineStatus } from "@/hooks/use-timeline-status"
import { cn } from "@/lib/utils"
import type { WeddingEvent } from "@/types"

import { OpeningInvitation } from "./wedding-invitation"

export type InvitationCardProps = {
  invitation: WeddingEvent
  className?: string
}

/**
 * The original wedding invitation, kept as a museum piece: the printed card
 * opening out of its envelope, then the map, "Tìm đường" and, while the day
 * is still ahead, "Lưu lại sự kiện".
 */
export function InvitationCard({ invitation, className }: InvitationCardProps) {
  const status = useTimelineStatus(invitation.countdown)
  // ?khach=Gia đình Anh Hùng: written on the envelope and the card, like the printed ones.
  const { khach } = useSearch({ strict: false }) as { khach?: unknown }
  const guest = typeof khach === "string" && khach.trim() ? khach.trim().slice(0, 60) : undefined
  const location = [invitation.location_line_1, invitation.location_line_2].filter(Boolean).join(" ")

  return (
    <section
      aria-label={`Thiệp mời ${invitation.title.toLowerCase()}`}
      className={cn("relative plate px-4 py-8 sm:px-10 sm:py-12", className)}
    >
      <div className="flex flex-col items-center gap-8">
        {invitation.print && <OpeningInvitation print={invitation.print} title={invitation.title} guest={guest} />}

        <div className="w-full">
          <div className="plate p-2">
            <AspectRatio ratio={4 / 3} className="overflow-hidden bg-muted sm:aspect-video">
              <iframe
                title={`Bản đồ tới ${location}`}
                src={invitation.map}
                className="absolute inset-0 size-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </AspectRatio>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={invitation.map_direction} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "cta", size: "lg" })}>
            <HugeiconsIcon icon={MapsSearchIcon} strokeWidth={2} data-icon="inline-start" />
            Tìm đường
          </a>
          {status.status === "upcoming" && (
            <a href={invitation.calendar_url} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ornate", size: "lg" })}>
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} data-icon="inline-start" />
              Lưu lại sự kiện
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
