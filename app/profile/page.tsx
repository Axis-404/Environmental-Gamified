import AppShell from "@/components/app-shell"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Fetch profile details
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, school, role")
    .eq("id", user.id)
    .maybeSingle()

  // Total eco-points from ledger
  const { data: ledgerRows, error: ledgerError } = await supabase
    .from("points_ledger")
    .select("delta")
    .eq("user_id", user.id)

  const totalPoints =
    !ledgerError && Array.isArray(ledgerRows) ? ledgerRows.reduce((sum, row) => sum + (row.delta ?? 0), 0) : 0

  // Badges count (use count with head to avoid payload)
  const { count: badgesCount = 0 } = await supabase
    .from("badges_awarded")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)

  const displayName = profile?.display_name || user.email || "Student"
  const school = profile?.school || "—"
  const role = profile?.role || "student"

  return (
    <AppShell title="Profile">
      <section className="space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{displayName}</h3>
              <p className="text-sm text-muted-foreground">
                {school} • {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Eco-Points</p>
            <p className="text-2xl font-semibold">{totalPoints}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Badges</p>
            <p className="text-2xl font-semibold">{badgesCount}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-medium">Streak</h4>
          <p className="text-sm text-muted-foreground">0 days</p>
        </div>

        {!profile?.display_name && (
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm">
              Complete your onboarding to set your display name and role.{" "}
              <a href="/onboarding/role" className="text-primary underline">
                Go to onboarding
              </a>
            </p>
          </div>
        )}
      </section>
    </AppShell>
  )
}
