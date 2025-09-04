import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppShell from "@/components/app-shell"

function haversineMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const lat1 = toRad(aLat)
  const lat2 = toRad(bLat)
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

async function approveSubmission(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const id = String(formData.get("id") || "")
  if (!id) return

  // Ensure reviewer has permission (RLS also enforces)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/sign-in")
  }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (!profile || !["teacher", "ngo"].includes(profile.role)) {
    redirect("/")
  }

  await supabase
    .from("submissions")
    .update({ status: "approved", reviewer_id: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", id)

  // Points awarded via DB trigger
}

async function rejectSubmission(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const id = String(formData.get("id") || "")
  const comment = String(formData.get("comment") || "")
  if (!id) return

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/sign-in")
  }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (!profile || !["teacher", "ngo"].includes(profile.role)) {
    redirect("/")
  }

  await supabase
    .from("submissions")
    .update({
      status: "rejected",
      reviewer_id: user.id,
      reviewed_at: new Date().toISOString(),
      review_comment: comment,
    })
    .eq("id", id)
}

export default async function ReviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  if (!profile || !["teacher", "ngo"].includes(profile.role)) {
    redirect("/")
  }

  // Fetch pending submissions with challenge info
  const { data: items } = await supabase
    .from("submissions")
    .select(
      `
      id, created_at, status, evidence_url, exif, latitude, longitude, qr_code,
      challenge:challenge_id ( title, verification, points, geo_lat, geo_lng, geo_radius_m )
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  return (
    <AppShell title="Review Submissions">
      <section className="space-y-4">
        {!items?.length && (
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">No pending submissions.</p>
          </div>
        )}

        {items?.map((s) => {
          const hasGeo = typeof s.latitude === "number" && typeof s.longitude === "number"
          const c = s.challenge as any
          const canGeoCheck =
            hasGeo &&
            typeof c?.geo_lat === "number" &&
            typeof c?.geo_lng === "number" &&
            typeof c?.geo_radius_m === "number"
          const dist = canGeoCheck ? haversineMeters(s.latitude, s.longitude, c.geo_lat, c.geo_lng) : null

          return (
            <div key={s.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{s.challenge?.title ?? "Challenge"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(s.created_at).toLocaleString()} • Verify: {s.challenge?.verification}
                  </p>
                </div>
                <span className="text-xs rounded bg-muted px-2 py-1">+{s.challenge?.points ?? 0} pts</span>
              </div>

              {s.evidence_url ? (
                <a href={s.evidence_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">
                  View photo evidence
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No photo evidence</p>
              )}

              {/* EXIF quick view */}
              {s.exif ? (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs">
                    EXIF: {(() => {
                      const e = s.exif as any
                      const make = e?.Make || e?.make
                      const model = e?.Model || e?.model
                      const dt = e?.DateTimeOriginal || e?.DateTime || e?.dateTimeOriginal
                      return [make && `Make: ${make}`, model && `Model: ${model}`, dt && `Taken: ${dt}`]
                        .filter(Boolean)
                        .join(" • ")
                    })()}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-destructive">Missing EXIF; review carefully</p>
              )}

              {/* Geo info with quick radius check */}
              {hasGeo ? (
                <p className="text-xs text-muted-foreground">
                  Location: {s.latitude.toFixed(5)}, {s.longitude.toFixed(5)}
                  {canGeoCheck && dist !== null ? (
                    <span>
                      {" "}
                      •{" "}
                      {dist <= c.geo_radius_m ? (
                        <span className="text-[10px] rounded bg-green-100 px-1.5 py-0.5 text-green-800">
                          within radius
                        </span>
                      ) : (
                        <span className="text-[10px] rounded bg-red-100 px-1.5 py-0.5 text-red-800">
                          outside radius
                        </span>
                      )}
                    </span>
                  ) : null}
                </p>
              ) : s.challenge?.verification === "geo" ? (
                <p className="text-xs text-destructive">Missing location for geo-verified task</p>
              ) : null}

              {/* QR info */}
              {s.challenge?.verification === "qr" && (
                <p className="text-xs text-muted-foreground">QR: {s.qr_code ? "Provided" : "Missing"}</p>
              )}

              <div className="flex items-center gap-2">
                <form action={approveSubmission}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm"
                  >
                    Approve
                  </button>
                </form>
                <form action={rejectSubmission} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <input
                    name="comment"
                    placeholder="Reason (optional)"
                    className="rounded-md border bg-background px-2 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-destructive px-3 py-2 text-destructive-foreground text-sm"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </section>
    </AppShell>
  )
}
