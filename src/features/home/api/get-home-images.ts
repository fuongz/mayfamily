import { createServerFn } from "@tanstack/react-start"

import { env } from "@/config/env"
import type { HomeImage } from "@/types"

export const getHomeImages = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<HomeImage>> => {
    const res = await fetch(`${env.CDN_URL}/home.json`)
    if (!res.ok) {
      throw new Error(`Failed to fetch home images: ${res.status}`)
    }
    return (await res.json()) as Array<HomeImage>
  }
)
