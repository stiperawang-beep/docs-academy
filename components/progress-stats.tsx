"use client"

import * as React from "react"
import { tutorials } from "#velite"

export function ProgressStats() {
  const [readCount, setReadCount] = React.useState(0)
  const total = tutorials.length

  React.useEffect(() => {
    try {
      const read = JSON.parse(localStorage.getItem("vd_read") || "[]") as string[]
      setReadCount(read.length)
    } catch {}
  }, [])

  const pct = total > 0 ? Math.round((readCount / total) * 100) : 0

  return (
    <div className="px-3 space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Progress Belajar</span>
        <span className="font-medium text-foreground">{readCount}/{total} artikel</span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="text-[10px] text-green-500 font-medium text-center">🎉 Semua artikel selesai dibaca!</p>
      )}
    </div>
  )
}
