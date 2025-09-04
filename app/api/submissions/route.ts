import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex")
}

function timingSafeEqualHex(a: string, b: string) {
  try {
    const aBuf = Buffer.from(a, "hex")
    const bBuf = Buffer.from(b, "hex")
    if (aBuf.length !== bBuf.length) return false
    return crypto.timingSafeEqual(aBuf, bBuf)
  } catch {
    return false
  }
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000 // meters
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { challenge_id, evidence_url, exif, latitude, longitude, qr_code } = body ?? {}

    if (!challenge_id) {
      return NextResponse.json({ error: "challenge_id is required" }, { status: 400 })
    }

    // Optional duplicate-evidence guard (soft anti-cheat)
    if (evidence_url) {
      const { data: prior } = await supabase
        .from("submissions")
        .select("id,user_id")
        .eq("evidence_url", evidence_url)
        .limit(1)
        .maybeSingle()
      if (prior && prior.user_id !== user.id) {
        return NextResponse.json({ error: "This evidence has already been used by another user" }, { status: 400 })
      }
    }

    // Fetch challenge to enforce verification specifics
    const { data: challenge, error: chErr } = await supabase
      .from("challenges")
      .select("id, verification, qr_secret, geo_lat, geo_lng, geo_radius_m, active, start_at, end_at")
      .eq("id", challenge_id)
      .maybeSingle()

    if (chErr || !challenge) {
      return NextResponse.json({ error: chErr?.message || "Challenge not found" }, { status: 404 })
    }
    if (!challenge.active) {
      return NextResponse.json({ error: "Challenge is not active" }, { status: 400 })
    }

    // Optional simple time window enforcement
    const now = new Date()
    if (challenge.start_at && now < new Date(challenge.start_at)) {
      return NextResponse.json({ error: "Challenge not started yet" }, { status: 400 })
    }
    if (challenge.end_at && now > new Date(challenge.end_at)) {
      return NextResponse.json({ error: "Challenge has ended" }, { status: 400 })
    }

    // Anti-cheat/verification checks
    if (challenge.verification === "qr") {
      if (!qr_code) {
        return NextResponse.json({ error: "QR code required for this challenge" }, { status: 400 })
      }
      if (challenge.qr_secret) {
        const provided = sha256Hex(String(qr_code))
        const stored = sha256Hex(String(challenge.qr_secret))
        const ok = timingSafeEqualHex(provided, stored)
        if (!ok) {
          return NextResponse.json({ error: "Invalid QR code" }, { status: 400 })
        }
      }
    }

    if (challenge.verification === "geo") {
      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return NextResponse.json({ error: "Location required for this challenge" }, { status: 400 })
      }
      if (
        typeof challenge.geo_lat === "number" &&
        typeof challenge.geo_lng === "number" &&
        typeof challenge.geo_radius_m === "number"
      ) {
        const dist = haversineMeters(latitude, longitude, challenge.geo_lat, challenge.geo_lng)
        if (dist > challenge.geo_radius_m) {
          return NextResponse.json({ error: "Outside allowed geofence" }, { status: 400 })
        }
      }
    }

    if (challenge.verification === "photo") {
      if (!evidence_url) {
        return NextResponse.json({ error: "Photo evidence required for this challenge" }, { status: 400 })
      }
      // Optionally require minimal EXIF keys if provided
      if (exif && typeof exif === "object") {
        // strip large blobs / maker notes if client sent any
        delete (exif as any).MakerNote
        delete (exif as any).thumbnail
      }
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        challenge_id: challenge.id,
        user_id: user.id, // RLS requires auth.uid() = user_id
        evidence_url: evidence_url ?? null,
        exif: exif ?? null,
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        qr_code: qr_code ?? null,
      })
      .select("id")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}
