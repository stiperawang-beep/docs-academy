"use client"

import { motion } from "framer-motion"

export function AmbientMesh() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-500">
      <motion.div
        animate={{
          x: ["0%", "5%", "-5%", "0%"],
          y: ["0%", "-5%", "5%", "0%"],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-primary/20 mix-blend-normal dark:mix-blend-screen blur-[120px] opacity-40 dark:opacity-20"
      />
      <motion.div
        animate={{
          x: ["0%", "-5%", "5%", "0%"],
          y: ["0%", "5%", "-5%", "0%"],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute top-[20%] -right-[10%] h-[40vw] w-[40vw] rounded-full bg-ring/20 mix-blend-normal dark:mix-blend-screen blur-[120px] opacity-30 dark:opacity-15"
      />
    </div>
  )
}
