"use client"

import { useEffect, useState } from "react"

type Props = {
  onChange(file: File | null): void
  required?: boolean
  label?: string
}

export function PhotoCapture({ onChange, required, label = "Upload photo evidence" }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      onChange(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange(file)
    return () => URL.revokeObjectURL(url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </label>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const f = e.target.files?.[0]
          setFile(f ?? null)
        }}
        className="block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-2 file:text-foreground file:hover:bg-accent/10"
        aria-required={required}
      />
      {preview ? (
        <div className="overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview || "/placeholder.svg"}
            alt="Selected evidence preview"
            className="h-48 w-full object-cover"
          />
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">Tip: avoid faces; focus on the activity or result.</p>
    </div>
  )
}
