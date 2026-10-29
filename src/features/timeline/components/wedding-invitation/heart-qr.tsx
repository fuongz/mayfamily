import { useMemo } from "react"
import { encode } from "uqr"

import { cn } from "@/lib/utils"

/** Heart in a 100×100 box, point down. */
const HEART =
  "M50 96C22 74 2 56 2 32C2 15 15 3 30 3C40 3 47 9 50 17C53 9 60 3 70 3C85 3 98 15 98 32C98 56 78 74 50 96Z"

/**
 * The heart on the envelope flap: a real, scannable QR code (quiet zone kept)
 * set inside an ink heart, like the printed one.
 */
export function HeartQr({ url, className }: { url: string; className?: string }) {
  const { path, size } = useMemo(() => {
    const qr = encode(url, { ecc: "M", border: 0 })
    let d = ""
    qr.data.forEach((row, y) =>
      row.forEach((dark, x) => {
        if (dark) d += `M${x} ${y}h1v1h-1z`
      })
    )
    return { path: d, size: qr.size }
  }, [url])

  // QR square: 44 units wide, centred under the heart's dip.
  const box = 44
  const pad = 4
  const left = 50 - box / 2
  const top = 19

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`Mã QR tới ${url}`} className={cn("block", className)}>
      <path d={HEART} className="fill-ink" />
      <rect x={left - pad} y={top - pad} width={box + pad * 2} height={box + pad * 2} rx={2} className="fill-paper" />
      <g transform={`translate(${left} ${top}) scale(${box / size})`}>
        <path d={path} className="fill-ink" shapeRendering="crispEdges" />
      </g>
    </svg>
  )
}
