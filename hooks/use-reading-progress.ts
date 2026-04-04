"use client"

import * as React from "react"

export function useReadingProgress() {
  const markRead = (slug: string) => {
    try {
      const read = JSON.parse(localStorage.getItem("vd_read") || "[]") as string[]
      if (!read.includes(slug)) {
        localStorage.setItem("vd_read", JSON.stringify([...read, slug]))
      }
    } catch {}
  }

  const isRead = (slug: string): boolean => {
    try {
      const read = JSON.parse(localStorage.getItem("vd_read") || "[]") as string[]
      return read.includes(slug)
    } catch { return false }
  }

  return { markRead, isRead }
}
