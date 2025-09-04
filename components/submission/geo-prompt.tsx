"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  onChange(coords: { lat: number; lng: number } | null): void
  required?: boolean
}

export function GeoPrompt({ onChange, required }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [status, setStatus] = useState<"idle" | "requesting" | "error">("idle")
  const [accuracy, setAccuracy] = useState<number | null>(null)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error")
      return
    }
    setStatus("requesting")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        const data = { lat: latitude, lng: longitude }
        setCoords(data)
        setAccuracy(Math.round(accuracy))
        onChange(data)
        setStatus("idle")
      },
      () => {
        setStatus("error")
        onChange(null)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Capture location {required ? <span className="text-destructive">*</span> : null}
      </label>
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" onClick={requestLocation} disabled={status === "requesting"}>
          {status === "requesting" ? "Capturing..." : coords ? "Re-capture" : "Capture"}
        </Button>
        <div className="text-sm text-muted-foreground">
          {coords ? (
            <span>
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} {accuracy ? `• ~${accuracy}m` : ""}
            </span>
          ) : status === "error" ? (
            <span>Location unavailable. Check permissions.</span>
          ) : (
            <span>Optional approximate GPS</span>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">We store only coordinates; no background tracking.</p>
    </div>
  )
}
