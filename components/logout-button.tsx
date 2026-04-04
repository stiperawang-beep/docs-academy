"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" })
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign Out
    </button>
  )
}
