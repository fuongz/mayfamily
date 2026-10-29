import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useAnimate, useReducedMotion, type AnimationPlaybackControls } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { InvitationPrint } from "@/types"

import { GuestName, MAGNOLIA_RISE, Panel, PanelFamilies, PanelReception } from "./card-panels"
import { Crest } from "./crest"
import { HeartQr } from "./heart-qr"

/** Where the flap's QR leads: the site itself. */
const SITE_URL = "https://trinhvaphuong.com/"

/** Strong ease-out for things arriving; ease-in-out for things moving on screen. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

const FLAP_CLOSED = "rotateX(0deg)"
const FLAP_OPEN = "rotateX(180deg)"

/** One card pose. Always the same transform shape, so poses interpolate. */
function pose(x: number, y: number, rotate: number, scale: number) {
  return `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`
}
const HOME = pose(0, 0, 0, 1)

/**
 * sealed: the closed envelope · opening: flap up, cards rising ·
 * peek: both cards half out, waiting · revealing: cards coming out · open.
 */
type Stage = "sealed" | "opening" | "peek" | "revealing" | "open"

type Poses = { hidden: [string, string]; peek: [string, string]; drop: number }

/**
 * The printed invitation, opened by the guest in two taps, from the outside
 * in. Tap 1: the flap swings up and the two small cards inside rise half out
 * of the envelope. Tap 2: the envelope falls away and both cards come out
 * full size, one under the other. Reduced motion: the same two steps,
 * without the movement. `guest` is handwritten on the envelope and the card.
 */
export function OpeningInvitation({ print, title, guest }: { print: InvitationPrint; title: string; guest?: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const frameRef = useRef<HTMLDivElement>(null)
  const envelopeRef = useRef<HTMLDivElement>(null)
  const familiesRef = useRef<HTMLDivElement>(null)
  const receptionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useMemo(() => [familiesRef, receptionRef] as const, [])
  const controls = useRef<AnimationPlaybackControls | null>(null)

  const [stage, setStage] = useState<Stage>("sealed")
  const reduceMotion = useReducedMotion()

  /** Where each card sits in the envelope, measured on the untransformed layout. */
  const measure = useCallback((): Poses | null => {
    const frame = frameRef.current
    const envelope = envelopeRef.current
    const cards = cardRefs.map((ref) => ref.current)
    if (!frame || !envelope || !cards[0] || !cards[1]) return null
    const box = frame.getBoundingClientRect()
    const env = envelope.getBoundingClientRect()
    const cardH = cards[0].offsetHeight
    // Not laid out yet (e.g. inside a closed collapsible): nothing to measure.
    if (!cardH || !env.width || !env.height || !box.width) return null

    // Small enough that both fit side by side in the envelope, die-cut flower included.
    const rise = box.width * MAGNOLIA_RISE
    const scale = Math.min((env.width * 0.62) / box.width, (env.height * 0.9) / (cardH + rise))
    const envTop = env.top - box.top
    const restY = envTop + env.height * 0.96 - cardH * scale
    const shift = env.width * 0.13
    const [a, b] = cards.map((card) => card!.offsetTop)
    return {
      hidden: [pose(-shift / 2, restY - a, 0, scale), pose(shift / 2, restY - b, 0, scale)],
      // Fanned, the families card a little higher behind the reception card.
      peek: [
        pose(-shift, envTop - cardH * scale * 0.42 - a, -4, scale),
        pose(shift, envTop - cardH * scale * 0.3 - b, 5, scale),
      ],
      drop: env.height * 0.9,
    }
  }, [cardRefs])

  /** Puts both cards back inside the sealed envelope. */
  const seal = useCallback(() => {
    const poses = measure()
    if (!poses) return
    cardRefs.forEach((ref, i) => {
      const card = ref.current
      if (!card) return
      card.style.transform = poses.hidden[i]
      card.style.opacity = "1"
    })
  }, [cardRefs, measure])

  // Before paint: tuck the cards in (the server renders them invisible).
  const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect
  useIsoLayoutEffect(() => {
    if (stage === "sealed") seal()
  }, [stage, seal])

  // Re-tuck on any size change, including first becoming visible.
  useEffect(() => {
    const frame = frameRef.current
    if (stage !== "sealed" || !frame) return
    const observer = new ResizeObserver(() => seal())
    observer.observe(frame)
    return () => observer.disconnect()
  }, [stage, seal])

  const run = (sequence: Parameters<typeof animate>[0], then: Stage) => {
    controls.current = animate(sequence as never)
    controls.current.finished.then(() => {
      controls.current = null
      setStage(then)
    })
  }

  /** Tap 1: open the flap, the cards rise half out. */
  const openEnvelope = () => {
    const poses = measure()
    const [a, b] = cardRefs.map((ref) => ref.current)
    if (!poses || !a || !b) return
    setStage("opening")
    const t = reduceMotion ? 0 : 1
    run(
      [
        // The flap swings up; past halfway it drops behind the cards.
        ["[data-flap]", { transform: FLAP_OPEN }, { duration: 0.7 * t, ease: EASE_IN_OUT }],
        ["[data-flap-layer]", { zIndex: 5 }, { duration: 0.01, at: 0.35 * t }],
        [a, { transform: poses.peek[0] }, { duration: 0.75 * t, ease: EASE_OUT, at: "+0.05" }],
        [b, { transform: poses.peek[1] }, { duration: 0.75 * t, ease: EASE_OUT, at: `-${0.62 * t}` }],
      ],
      "peek"
    )
  }

  /** Tap 2: the envelope falls away, the cards come out full size. */
  const revealCards = () => {
    const poses = measure()
    const [a, b] = cardRefs.map((ref) => ref.current)
    if (!poses || !a || !b) return
    setStage("revealing")
    if (reduceMotion) {
      a.style.transform = HOME
      b.style.transform = HOME
      run(
        [
          ["[data-env]", { opacity: 0 }, { duration: 0.2 }],
          [[a, b], { opacity: [0, 1] }, { duration: 0.3 }],
        ],
        "open"
      )
      return
    }
    run(
      [
        ["[data-env]", { transform: `translateY(${poses.drop}px)`, opacity: 0 }, { duration: 0.7, ease: EASE_OUT }],
        [a, { transform: HOME }, { duration: 0.9, ease: EASE_IN_OUT, at: 0 }],
        [b, { transform: HOME }, { duration: 0.9, ease: EASE_IN_OUT, at: 0.12 }],
      ],
      "open"
    )
  }

  // Back in the envelope; the guest opens it again.
  const replay = () => setStage("sealed")

  const tappable = stage === "sealed" || stage === "peek"
  const lowerTitle = title.toLowerCase()

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={scope}
        role="group"
        aria-roledescription="thiệp mời"
        aria-label={`Thiệp mời ${lowerTitle}`}
        // Top padding: room for the die-cut flower once the cards are out.
        className="w-full max-w-md"
        style={{ paddingTop: `${MAGNOLIA_RISE * 100}%` }}
      >
        <div ref={frameRef} className="@container relative">
          {/* Two separate cards, one under the other once out of the envelope. */}
          <div className="relative z-10 grid auto-rows-fr gap-4">
            <Panel ref={cardRefs[0]} className="origin-top" style={{ opacity: 0 }}>
              <PanelFamilies print={print} />
            </Panel>
            <Panel ref={cardRefs[1]} className="origin-top" style={{ opacity: 0 }}>
              <PanelReception print={print} guest={guest} />
            </Panel>
          </div>

          {stage !== "open" && (
            <>
              {/* The flap: its own layer so it can pass behind the cards once open. */}
              <EnvelopeLayer data-flap-layer className="z-30 perspective-[1800px]">
                <div
                  data-flap
                  className="absolute inset-x-0 top-0 h-[46%] origin-top transform-3d"
                  style={{ transform: FLAP_CLOSED }}
                >
                  <FlapFace side="outside" />
                  <FlapFace side="inside" />
                </div>
              </EnvelopeLayer>

              {/* The envelope's face, in front of the tucked-in cards. */}
              <EnvelopeLayer className="z-20">
                <div ref={envelopeRef} className="absolute inset-0 @container border border-ink/30 bg-paper text-ink shadow-[0_18px_40px_-18px_rgb(0_0_0/0.35)]">
                  <Crest crest={print.crest} className="absolute top-[41%] left-1/2 w-[19%] -translate-x-1/2" />
                  <p className="absolute inset-x-0 top-[74%] text-center font-heading text-[5.6cqw] leading-none font-medium tracking-[0.06em]">
                    {print.envelopeDate}
                  </p>
                  <p className="absolute inset-x-0 top-[83.5%] text-center font-heading text-[2.6cqw]">Trân trọng kính mời</p>
                  <span aria-hidden className="absolute top-[94%] left-1/2 w-[56%] -translate-x-1/2 border-b border-dotted border-ink/50" />
                  {guest && (
                    <GuestName name={guest} className="absolute inset-x-[18%] top-[87.5%] -rotate-2 text-[4.2cqw]" />
                  )}
                </div>
              </EnvelopeLayer>

              {/* Tap target: the envelope (and the cards peeking out of it). */}
              {tappable && (
                <button
                  type="button"
                  onClick={stage === "sealed" ? openEnvelope : revealCards}
                  aria-label={stage === "sealed" ? `Mở phong bì thiệp mời ${lowerTitle}` : `Xem chi tiết thiệp mời ${lowerTitle}`}
                  className="absolute inset-x-0 top-0 z-40 h-1/2 cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
                />
              )}
            </>
          )}
        </div>
      </div>

      {tappable && (
        <p className="caption text-muted-foreground" aria-hidden>
          {stage === "sealed" ? "Chạm vào phong bì để mở" : "Chạm vào thiệp để xem chi tiết"}
        </p>
      )}
      {stage === "open" && (
        <Button variant="ghost" size="sm" onClick={replay} className="caption text-muted-foreground">
          <HugeiconsIcon icon={ArrowReloadHorizontalIcon} strokeWidth={2} data-icon="inline-start" />
          Cất thiệp vào phong bì
        </Button>
      )}
    </div>
  )
}

/**
 * Positions one envelope layer over the card's first panel, centred, at the
 * printed 18 × 13 cm proportion. Layers move together (`data-env`).
 */
function EnvelopeLayer({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-0 flex h-1/2 items-center", className)}
      {...props}
    >
      <div data-env className="relative mx-[3%] aspect-[18/13] w-full" style={{ transform: "translateY(0px)" }}>
        {children}
      </div>
    </div>
  )
}

/**
 * One side of the flap. Outside: pointing down over the envelope. Inside:
 * drawn pointing up and pre-flipped, so once the flap has swung open it reads
 * upright above the envelope, with the heart QR.
 */
function FlapFace({ side }: { side: "outside" | "inside" }) {
  const inside = side === "inside"
  return (
    <div className={cn("absolute inset-0 backface-hidden", inside && "[transform:rotateX(180deg)]")}>
      <svg
        viewBox="0 0 180 60"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible drop-shadow-[0_2px_3px_rgb(0_0_0/0.12)]"
      >
        <path
          d={inside ? "M0 60H180L104 6Q90 -3 76 6Z" : "M0 0H180L104 54Q90 63 76 54Z"}
          className="fill-paper stroke-ink/30"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {inside && (
        // The printed liner: a peony photo, inset from the flap's paper edge.
        <div
          aria-hidden
          className="absolute inset-0 bg-paper-shade bg-[url(/images/invitation/liner.webp)] bg-cover bg-center [clip-path:polygon(4%_100%,96%_100%,56.5%_17%,50%_10%,43.5%_17%)]"
        />
      )}
      {inside && (
        <div className="@container absolute inset-0 flex flex-col items-center justify-end pb-[6%]">
          <p className="bg-paper/85 px-[1.5cqw] font-heading text-[2.4cqw] text-ink italic">Quét để xem hành trình của chúng mình</p>
          <HeartQr url={SITE_URL} className="mt-[1.5cqw] w-[17%]" />
        </div>
      )}
    </div>
  )
}
