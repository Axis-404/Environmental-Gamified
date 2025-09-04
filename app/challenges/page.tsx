import AppShell from "@/components/app-shell"
import Link from "next/link"
import { challenges } from "@/lib/challenges"

export default function Page() {
  return (
    <AppShell title="Challenges">
      <ul className="space-y-3">
        {challenges.map((c) => (
          <li key={c.slug} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.points} pts</p>
              </div>
              <Link
                href={`/challenges/${c.slug}`}
                className="rounded-md bg-secondary px-3 py-2 text-secondary-foreground text-sm"
                aria-label={`Open challenge ${c.title}`}
              >
                Join
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  )
}
