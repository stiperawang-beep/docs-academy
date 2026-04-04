"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { motion, AnimatePresence } from "framer-motion"

export function MobileSidebar({ currentSlug }: { currentSlug: string }) {
  const [open, setOpen] = React.useState(false)

  // Close on route change
  React.useEffect(() => {
    setOpen(false)
  }, [currentSlug])

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 backdrop-blur-md shadow-sm hover:bg-accent transition-colors supports-[backdrop-filter]:bg-background/60"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 left-0 z-50 h-full w-72 bg-background/50 backdrop-blur-2xl border-r border-border/50 shadow-2xl md:hidden overflow-hidden supports-[backdrop-filter]:bg-background/50"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Sidebar currentSlug={currentSlug} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
