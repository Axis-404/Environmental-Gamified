"use client"

import AppShell from "@/components/app-shell"
import { notFound } from "next/navigation"
import { challenges } from "@/lib/challenges"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { PhotoCapture } from "@/components/submission/photo-capture"
import { QREntry } from "@/components/submission/qr-entry"
import { GeoPrompt } from "@/components/submission/geo-prompt"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ChallengeDetail({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  const challenge = challenges.find((c) => c.slug === params.slug)
  if (!challenge) return notFound()

  const [photo, setPhoto] = useState<File | null>(null)
  const [qr, setQr] = useState<string>("")
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [consent, setConsent] = useState(false)

  const canSubmit =
    (!challenge.requirePhoto || !!photo) &&
    (!challenge.requireQR || qr.trim().length > 0) &&
    (!challenge.requireGeo || !!geo) &&
    consent

  async function onSubmit() {
    if (!canSubmit) {
      toast({
        title: "Missing required fields",
        description: "Please complete the required items before submitting.",
        variant: "destructive",
      })
      return
    }
    setSubmitting(true)
    try {
      // Placeholder: wire to API/storage later
      await new Promise((r) => setTimeout(r, 800))
      toast({
        title: "Submission received",
        description: "Your evidence has been recorded and awaits review.",
      })
      router.push("/challenges")
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell title={challenge.title}>
      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="text-balance text-base">
            {challenge.title} • <span className="text-muted-foreground">{challenge.points} pts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed">{challenge.description}</p>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {challenge.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          {challenge.requirePhoto ? <PhotoCapture required onChange={setPhoto} /> : null}

          {challenge.requireQR ? <QREntry required onChange={setQr} /> : null}

          {challenge.requireGeo ? <GeoPrompt required onChange={setGeo} /> : null}

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what you did, what you learned, or challenges faced."
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            I confirm no faces are visible and I have consent to submit this evidence.
          </label>
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => history.back()} type="button">
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!canSubmit || submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </AppShell>
  )
}
