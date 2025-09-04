"use client"

import { type ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import RouteTransition from "@/components/route-transition"

export default function ClientRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Announce route changes for screen readers
  useEffect(() => {
    const el = document.getElementById("route-change-announcer")
    if (el) el.textContent = `Navigated to ${pathname}`
  }, [pathname])

  return (
    <>
      <div id="route-change-announcer" className="sr-only" aria-live="polite" />
      <RouteTransition key={pathname}>{children}</RouteTransition>
    </>
  )
}
