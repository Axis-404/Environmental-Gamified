"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function SignOutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setLoading(false)
    router.replace("/auth/sign-in")
  }

  return (
    <Button onClick={handleSignOut} variant="outline" className={className} disabled={loading}>
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  )
}
