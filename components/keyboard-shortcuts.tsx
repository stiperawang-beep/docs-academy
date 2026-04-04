"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, ChevronLeft, ChevronRight, Moon, Home } from "lucide-react"

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], desc: "Open global search" },
  { keys: ["←"], desc: "Previous article" },
  { keys: ["→"], desc: "Next article" },
  { keys: ["T"], desc: "Toggle dark/light theme" },
  { keys: ["G", "H"], desc: "Go to homepage" },
  { keys: ["?"], desc: "Show this keyboard shortcuts" },
  { keys: ["Esc"], desc: "Close any modal" },
]

export function KeyboardShortcutsModal() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "?") setOpen(o => !o)
      if (e.key === "Escape") setOpen(false)
      if (e.key === "t" || e.key === "T") {
        document.documentElement.classList.toggle("dark")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold">Keyboard Shortcuts</h2>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="space-y-3">
              {SHORTCUTS.map((s, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.desc}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] font-medium">{k}</kbd>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[11px] text-muted-foreground/60 text-center">
              Press <kbd className="inline-flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">?</kbd> anywhere to toggle this panel
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
