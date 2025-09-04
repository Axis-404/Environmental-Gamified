import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

async function setRole(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const role = String(formData.get("role") || "student")
  const displayName = String(formData.get("display_name") || "")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/sign-in")
  }

  await supabase.from("profiles").upsert({ id: user!.id, role, display_name: displayName }, { onConflict: "id" })

  redirect("/profile")
}

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  const { data: profile } = await supabase.from("profiles").select("display_name, role").eq("id", user.id).maybeSingle()

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-8">
      <h1 className="text-balance text-2xl font-semibold mb-4">Choose your role</h1>
      <form action={setRole} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="display_name" className="text-sm font-medium">
            Display name
          </label>
          <input
            id="display_name"
            name="display_name"
            defaultValue={profile?.display_name ?? ""}
            className="rounded-md border bg-background px-3 py-2"
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            defaultValue={profile?.role ?? "student"}
            className="rounded-md border bg-background px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="ngo">NGO</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Save and continue
        </button>
      </form>
    </main>
  )
}
