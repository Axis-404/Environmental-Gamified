import AppShell from "@/components/app-shell"
import { createClient } from "@/lib/supabase/server"
import { LeaderboardTable, type LeaderboardEntry } from "@/components/leaderboard-table"
import { LeaderboardGroupTable, type GroupEntry } from "@/components/leaderboard-group-table"

async function getLeaderboards() {
  const supabase = await createClient()

  // Students: all-time and weekly via RPC
  const { data: allTimeRaw } = await supabase.rpc("get_user_leaderboard", { period: "all-time", limit_rows: 50 })
  const { data: weeklyRaw } = await supabase.rpc("get_user_leaderboard", { period: "weekly", limit_rows: 50 })

  const allRows = [...(allTimeRaw ?? []), ...(weeklyRaw ?? [])]
  const userIds = Array.from(new Set((allRows as any[]).map((r) => r.user_id).filter(Boolean)))

  // Hydrate names/avatars for students
  const profilesById = new Map<string, { display_name?: string | null; avatar_url?: string | null }>()
  if (userIds.length) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds as string[])
    for (const p of profs ?? []) {
      profilesById.set(p.id, { display_name: p.display_name, avatar_url: p.avatar_url })
    }
  }

  const mapStudent = (rows: any[] | null | undefined): LeaderboardEntry[] =>
    (rows ?? []).map((r) => {
      const p = profilesById.get(r.user_id) ?? {}
      return {
        user_id: r.user_id,
        total_points: Number(r.total_points ?? 0),
        name: (p.display_name as string) || "User",
        avatar_url: (p.avatar_url as string) || null,
      }
    })

  // Classes: all-time only (weekly can be added similarly if needed)
  const { data: classesRaw } = await supabase.rpc("get_class_leaderboard", { limit_rows: 50 })
  const classEntries: GroupEntry[] = (classesRaw ?? []).map((r: any, i: number) => ({
    id: `class-${r.class_name || i}`,
    name: r.class_name || "Class",
    total_points: Number(r.total_points ?? 0),
  }))

  // Schools: all-time only
  const { data: schoolsRaw } = await supabase.rpc("get_school_leaderboard", { limit_rows: 50 })
  const schoolEntries: GroupEntry[] = (schoolsRaw ?? []).map((r: any) => ({
    id: r.school_id,
    name: r.school_name || "School",
    total_points: Number(r.total_points ?? 0),
  }))

  return {
    studentsAllTime: mapStudent(allTimeRaw as any[]),
    studentsWeekly: mapStudent(weeklyRaw as any[]),
    classes: classEntries,
    schools: schoolEntries,
  }
}

export default async function Page() {
  const { studentsAllTime, studentsWeekly, classes, schools } = await getLeaderboards()

  return (
    <AppShell title="Leaderboard">
      <section className="space-y-6">
        <LeaderboardTable caption="Students — All‑time top 50" entries={studentsAllTime} />
        <LeaderboardTable caption="Students — This week" entries={studentsWeekly} />
        <LeaderboardGroupTable caption="Top Classes" entries={classes} />
        <LeaderboardGroupTable caption="Top Schools" entries={schools} />
      </section>
    </AppShell>
  )
}
