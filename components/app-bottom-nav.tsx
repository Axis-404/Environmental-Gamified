"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
]

export function AppBottomNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Primary" className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card text-card-foreground">
      <ul className="mx-auto flex max-w-xl items-center justify-between px-4 py-2">
        {items.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname?.startsWith(it.href)
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="sr-only">{it.label}</span>
                <span aria-hidden className="whitespace-nowrap">
                  {it.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
