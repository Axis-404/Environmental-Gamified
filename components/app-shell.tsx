import type React from "react"
import { AppBottomNav } from "./app-bottom-nav"

export default function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-pretty">{title}</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {children}
        <div className="h-16" />
      </main>

      <AppBottomNav />
    </div>
  )
}
