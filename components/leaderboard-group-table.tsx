export type GroupEntry = {
  id: string
  name: string
  total_points: number
}

export function LeaderboardGroupTable({ entries, caption }: { entries: GroupEntry[]; caption?: string }) {
  return (
    <div className="rounded-lg border bg-card">
      {caption ? <div className="border-b px-4 py-2 text-sm text-muted-foreground">{caption}</div> : null}
      <ol className="divide-y">
        {entries.map((e, idx) => (
          <li key={`${e.id}-${idx}`} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                {idx + 1}
              </span>
              <span className="truncate font-medium">{e.name}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums">+{e.total_points}</span>
          </li>
        ))}
        {!entries.length && <li className="px-4 py-6 text-center text-sm text-muted-foreground">No data yet.</li>}
      </ol>
    </div>
  )
}
