import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (!profile || !["teacher", "ngo"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const seeds = [
    {
      slug: "waste-segregation-101",
      title: "Waste Segregation 101",
      description: "Segregate your household waste and submit a photo.",
      points: 15,
      verification: "photo",
      created_by: user.id,
      active: true,
    },
    {
      slug: "tree-care-week",
      title: "Tree Care Week",
      description: "Water a tree daily this week; scan the QR at the school gate.",
      points: 25,
      verification: "qr",
      qr_secret: "SCHOOL-GATE-QR-2025",
      created_by: user.id,
      active: true,
    },
    {
      slug: "clean-street-geo",
      title: "Clean Your Street",
      description: "Do a quick cleanup and submit with geolocation.",
      points: 20,
      verification: "geo",
      geo_lat: 28.6139, // Delhi center example
      geo_lng: 77.209,
      geo_radius_m: 3000,
      created_by: user.id,
      active: true,
    },
  ]

  const { error } = await supabase.from("challenges").upsert(seeds, { onConflict: "slug", ignoreDuplicates: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
