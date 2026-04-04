"use client"

import * as React from "react"
import { CheckCircle2, Bookmark } from "lucide-react"
import confetti from "canvas-confetti"

export function MarkRead({ slug }: { slug: string }) {
  const [isRead, setIsRead] = React.useState(false)

  React.useEffect(() => {
    try {
      const read = JSON.parse(localStorage.getItem("vd_read") || "[]") as string[]
      setIsRead(read.includes(slug))
    } catch {}
  }, [slug])

  const handleMarkAsRead = () => {
    try {
      const read = JSON.parse(localStorage.getItem("vd_read") || "[]") as string[]
      if (!read.includes(slug)) {
        localStorage.setItem("vd_read", JSON.stringify([...read, slug]))
      }
      setIsRead(true)

      // Trigger standard confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#8b5cf6', '#eab308']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#8b5cf6', '#eab308']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();

    } catch {}
  }

  return (
    <div className="flex justify-center my-12 not-prose">
      <button
        onClick={handleMarkAsRead}
        disabled={isRead}
        className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3 font-semibold shadow-md transition-all duration-300 ${
          isRead 
            ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default"
            : "bg-primary text-primary-foreground shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        }`}
      >
        {isRead ? (
           <>
             <CheckCircle2 className="w-5 h-5" />
             Tandai Selesai & Dipelajari
           </>
        ) : (
           <>
             {/* Shimmer effect for button */}
             <div className="absolute inset-0 -translate-x-[150%] skew-x-[-15deg] w-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
             <Bookmark className="w-5 h-5 fill-transparent group-hover:fill-current transition-colors" />
             Tandai Selesai Membaca
           </>
        )}
      </button>
    </div>
  )
}
