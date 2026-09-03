// OOP: Encapsulation — This provider encapsulates theme switching and system preference handling.
// OOP: Abstraction — Offers a reusable theme wrapper so components can rely on a consistent theme API.

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!event.key) {
        return
      }

      if (event.defaultPrevented || event.repeat) {
        return
      }

      // Support Ctrl+Shift+D or Cmd+Shift+D
      const isMac = typeof window !== 'undefined' && navigator.userAgent.includes('Mac')
      const modifierKey = isMac ? event.metaKey : event.ctrlKey
      
      if (!modifierKey || !event.shiftKey || event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      // Prevent default browser bookmark shortcut behavior
      event.preventDefault()

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
