"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  onChange(code: string): void
  required?: boolean
}

export function QREntry({ onChange, required }: Props) {
  const [code, setCode] = useState("")
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Event QR code {required ? <span className="text-destructive">*</span> : null}
      </label>
      <div className="flex items-center gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Scan or paste code"
          aria-required={required}
        />
        {/* Placeholder: camera-based scanning can be integrated later */}
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            // In a future iteration, open camera + decode QR.
            onChange(code.trim())
          }}
        >
          Set
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        If you attended an event, your coordinator will provide a QR code.
      </p>
    </div>
  )
}
