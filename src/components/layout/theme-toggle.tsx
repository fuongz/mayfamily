import { useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/** Explicit choice, "light" | "dark". Absent = follow the system. */
const THEME_KEY = "mayfamily:theme"

/**
 * Runs blocking in <head> before first paint: applies the stored choice or
 * the OS setting to <html>, so there is no flash of the wrong theme.
 */
export const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_KEY)});var d=s==="dark"||(s!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`

function applyTheme(dark: boolean) {
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.style.colorScheme = dark ? "dark" : "light"
}

function storedTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

/** Shared look of the fixed top-right controls (library, theme, music). */
export const cornerButtonClassName =
  "size-11 rounded-none border-rule bg-background/90 text-foreground backdrop-blur-sm hover:border-foreground hover:bg-foreground hover:text-background"

/**
 * Light / dark switch. Markup is the same on server and client: both icons
 * and both labels render, the `.dark` class picks which one shows.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // With no stored choice, follow live OS changes.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (event: MediaQueryListEvent) => {
      if (storedTheme() === null) applyTheme(event.matches)
    }
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark")
    applyTheme(dark)
    try {
      window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light")
    } catch {
      // Storage unavailable: the switch still applies for this visit.
    }
  }

  const iconClassName =
    "absolute size-5 transition-[opacity,rotate,scale] duration-300 ease-album motion-reduce:transition-none"

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ornate"
            size="icon-lg"
            onClick={toggle}
            className={cn("relative", cornerButtonClassName, className)}
          />
        }
      >
        {/* Shows the theme you will switch to: moon by day, sun at night. */}
        <HugeiconsIcon
          icon={Moon02Icon}
          strokeWidth={2}
          aria-hidden="true"
          className={cn(iconClassName, "dark:scale-50 dark:-rotate-90 dark:opacity-0")}
        />
        <HugeiconsIcon
          icon={Sun03Icon}
          strokeWidth={2}
          aria-hidden="true"
          className={cn(iconClassName, "scale-50 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100")}
        />
        <span className="sr-only dark:hidden">Chuyển sang giao diện tối</span>
        <span className="sr-only hidden dark:inline">Chuyển sang giao diện sáng</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="dark:hidden">Giao diện tối</span>
        <span className="hidden dark:inline">Giao diện sáng</span>
      </TooltipContent>
    </Tooltip>
  )
}
