"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"

export function ArticleFeedback({ slug }: { slug: string }) {
  const key = `feedback:${slug}`
  const [voted, setVoted] = React.useState<"up" | "down" | null>(null)

  React.useEffect(() => {
    const stored = localStorage.getItem(key) as "up" | "down" | null
    setVoted(stored)
  }, [key])

  const vote = (type: "up" | "down") => {
    if (voted) return
    localStorage.setItem(key, type)
    setVoted(type)
  }

  return (
    <div className="mt-16 flex flex-col items-center gap-4 border-t pt-10 pb-4">
      {voted ? (
        <div className="text-center">
          <p className="text-base font-medium">Terima kasih atas masukan Anda! 🙏</p>
          <p className="text-sm text-muted-foreground mt-1">Feedback Anda membantu kami meningkatkan kualitas dokumentasi.</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-muted-foreground">Apakah artikel ini membantu?</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => vote("up")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:bg-green-50 hover:border-green-400 hover:text-green-600 dark:hover:bg-green-950/30 transition-all text-sm font-medium"
            >
              <ThumbsUp className="h-4 w-4" />
              Ya, membantu!
            </button>
            <button
              onClick={() => vote("down")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:bg-red-50 hover:border-red-400 hover:text-red-600 dark:hover:bg-red-950/30 transition-all text-sm font-medium"
            >
              <ThumbsDown className="h-4 w-4" />
              Perlu perbaikan
            </button>
          </div>
        </>
      )}
    </div>
  )
}
