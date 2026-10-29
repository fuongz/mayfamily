import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const plateVariants = cva("rounded-none shadow-none ring-0 plate", {
  variants: {
    tone: {
      /** Text-first plate: card colour, hairline edge. */
      plate: "",
      /** A photo hung on the wall: thin margin around the image, hairline edge. */
      print:
        "gap-3 p-2 pb-3 has-[>img:first-child]:pt-2 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none",
    },
    tilt: {
      none: "",
      left: "-rotate-1",
      right: "rotate-1",
    },
  },
  compoundVariants: [
    {
      tilt: ["left", "right"],
      className:
        "transition-transform duration-500 ease-album motion-safe:hover:rotate-0 motion-reduce:rotate-0",
    },
  ],
  defaultVariants: { tone: "plate", tilt: "none" },
})

export type PlateProps = ComponentProps<typeof Card> & VariantProps<typeof plateVariants>

/**
 * shadcn Card as a flat museum plate: no shadow, no radius, 1px hairline.
 * Compose with CardHeader / CardTitle / CardContent / CardFooter as usual.
 */
export function Plate({ className, tone, tilt, ...props }: PlateProps) {
  return (
    <Card
      data-tone={tone ?? "plate"}
      className={cn(plateVariants({ tone, tilt }), className)}
      {...props}
    />
  )
}
