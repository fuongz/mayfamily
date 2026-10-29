import { MotionConfig } from "motion/react"

import { PageShell, SectionHeading } from "@/components/common"
import { Parallax } from "@/components/motion"
import { TimelineList } from "@/features/timeline/components"
import type { HomeImage, TimelineEntry } from "@/types"

import { Hero } from "./hero"
import { PhotoStrip } from "./photo-strip"
import { SiteFooter } from "./site-footer"

const TIMELINE_ID = "dong-thoi-gian"

export type HomePageProps = {
  timeline: TimelineEntry[]
  images: HomeImage[]
}

export function HomePage({ timeline, images }: HomePageProps) {
  const wedding = timeline.find((entry) => entry.kind === "wedding")

  return (
    <MotionConfig reducedMotion="user">
      <Hero wedding={wedding} timelineId={TIMELINE_ID} />

      <PageShell
        width="default"
        id={TIMELINE_ID}
        aria-labelledby="timeline-title"
        role="region"
        className="flex scroll-mt-6 flex-col gap-12 sm:gap-16"
      >
        <Parallax distance={36}>
          <SectionHeading
            id="timeline-title"
            eyebrow="Dòng thời gian"
            title="Từng trang của nhà mình"
            description="Từ ngày Mây về nhà, qua ngày cưới, tới hôm nay, và cả những ngày còn ở phía trước."
            ornament
          />
        </Parallax>
        <TimelineList entries={timeline} className="mx-auto w-full max-w-3xl lg:max-w-4xl" />
      </PageShell>

      <PageShell width="wide">
        <PhotoStrip images={images} />
      </PageShell>

      <SiteFooter />
    </MotionConfig>
  )
}
