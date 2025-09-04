import Image from "next/image"

export type LeaderboardEntry = {
  user_id: string
  total_points: number
  name: string
  avatar_url?: string | null
}

export function LeaderboardTable({ entries, caption }: { entries: LeaderboardEntry[]; caption?: string }) {
  return (
    <div className="rounded-lg border bg-card">
      {caption ? <div className="border-b px-4 py-2 text-sm text-muted-foreground">{caption}</div> : null}
      <ol className="divide-y">
        {entries.map((e, idx) => (
          <li key={`${e.user_id}-${idx}`} className="flex items-center gap-3 px-4 py-3">
            <span className="w-6 shrink-0 text-sm tabular-nums">{idx + 1}</span>
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
              {e.avatar_url ? (
                <Image src={e.avatar_url || "/placeholder.svg"} alt="" fill className="object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">{e.name?.[0]?.toUpperCase() || "U"}</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{e.name || "User"}</p>
            </div>
            <div className="text-sm font-semibold tabular-nums">+{e.total_points}</div>
          </li>
        ))}
        {!entries.length && <li className="px-4 py-6 text-center text-sm text-muted-foreground">No data yet.</li>}
      </ol>
    </div>
  )
}
