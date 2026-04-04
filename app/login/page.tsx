"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

const BOOT_LINES = [
  "> Initializing victory.docs kernel v2.0.4...",
  "> Loading system modules... [████████████] 100%",
  "> Mounting encrypted filesystem... OK",
  "> Secure session handshake... ESTABLISHED",
  "> AUTH_REQUIRED :: Access node /docs/protected",
  "",
  "┌─────────────────────────────────────────────┐",
  "│         VICTORY.DOCS SECURE TERMINAL        │",
  "│           Authentication Required           │",
  "└─────────────────────────────────────────────┘",
  "",
]

function useTypewriter(lines: string[], speed = 14) {
  const [displayed, setDisplayed] = React.useState<string[]>([])
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    let lineIdx = 0
    let charIdx = 0
    let current: string[] = []

    const tick = setInterval(() => {
      if (lineIdx >= lines.length) {
        setDone(true)
        clearInterval(tick)
        return
      }
      const line = lines[lineIdx]
      charIdx++
      current = [...current.slice(0, lineIdx), line.slice(0, charIdx)]
      setDisplayed([...current])
      if (charIdx >= line.length) {
        lineIdx++
        charIdx = 0
        current = [...current, ""]
      }
    }, speed)

    return () => clearInterval(tick)
  }, [lines, speed])

  return { displayed, done }
}

function Inner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") || "/dashboard"

  const { displayed, done } = useTypewriter(BOOT_LINES)
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [step, setStep] = React.useState<"user" | "pass" | "auth" | "done">("user")
  const [authLines, setAuthLines] = React.useState<string[]>([])
  const [error, setError] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (done) setTimeout(() => inputRef.current?.focus(), 100)
  }, [done])

  const addLine = (line: string) => setAuthLines(prev => [...prev, line])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return

    if (step === "user") {
      if (!username.trim()) return
      addLine(`visitor@victory.docs:~$ login ${username}`)
      addLine(`Password for ${username}:`)
      setStep("pass")
      setTimeout(() => inputRef.current?.focus(), 50)
    } else if (step === "pass") {
      addLine(`Password: ${"*".repeat(password.length || 8)}`)
      setStep("auth")
      addLine("> Verifying credentials...")

      setTimeout(() => addLine("> Checking identity matrix... [OK]"), 400)
      setTimeout(() => addLine("> Decrypting access token... [OK]"), 800)

      setTimeout(async () => {
        try {
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          })
          const data = await res.json()

          if (data.success) {
            setError("")
            addLine("> ✓ Authentication SUCCESSFUL")
            addLine(`> Welcome back, ${username}. Redirecting to session...`)
            setStep("done")
            setTimeout(() => router.push(nextPath), 1500)
          } else {
            addLine("> ✗ Authentication FAILED :: Bad credentials")
            addLine("> Session terminated. Reload to retry.")
            setError("ERR::ACCESS_DENIED — try admin / admin")
          }
        } catch {
          addLine("> ✗ Network error. Could not reach auth server.")
          setError("ERR::NETWORK_FAILURE")
        }
      }, 1300)
    }
  }

  const [randomMatrix, setRandomMatrix] = React.useState<string[]>([])

  React.useEffect(() => {
    setRandomMatrix(
      Array.from({ length: 24 }, () =>
        Array.from({ length: 48 }, () =>
          Math.random() > 0.92 ? "1" : Math.random() > 0.92 ? "0" : " "
        ).join("")
      )
    )
  }, [])

  return (
    <div className="relative min-h-[100dvh] bg-[#020c02] text-[#00ff41] flex items-center justify-center overflow-hidden font-mono">
      {/* Matrix Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07] select-none">
        {randomMatrix.map((row, i) => (
          <div key={i} className="text-xs leading-4 tracking-widest whitespace-pre text-[#00ff41]">{row}</div>
        ))}
      </div>
      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.01) 2px, rgba(0,255,65,0.01) 4px)" }} />

      {/* Terminal Window */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a160a] border border-[#00ff41]/30 rounded-t-lg">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs text-[#00ff41]/50 tracking-widest">victory.docs — secure-auth — bash</span>
        </div>

        <div className="bg-[#010a01]/90 backdrop-blur border border-[#00ff41]/30 border-t-0 rounded-b-lg p-6 min-h-[420px] shadow-[0_0_60px_rgba(0,255,65,0.08)]">
          {/* Boot lines */}
          <div className="space-y-0.5 mb-4">
            {displayed.map((line, i) => (
              <p key={i} className={`text-sm leading-5 ${line.startsWith("┌") || line.startsWith("│") || line.startsWith("└")
                ? "text-[#00ff41] tracking-wider"
                : line.startsWith(">") ? "text-[#00ff41]/80" : "text-[#00ff41]/60"}`}>
                {line || "\u00a0"}
              </p>
            ))}
          </div>

          {/* Auth interaction lines */}
          {authLines.map((line, i) => (
            <p key={i} className={`text-sm leading-5 mb-0.5 ${line.includes("✓") ? "text-green-400"
              : line.includes("✗") || line.includes("FAILED") ? "text-red-400"
              : "text-[#00ff41]/80"}`}>{line}</p>
          ))}

          {/* Input prompt */}
          {done && step !== "auth" && step !== "done" && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-[#00ff41]/60">
                {step === "user" ? "visitor@victory.docs:~$" : "Password:"}
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type={step === "pass" ? "password" : "text"}
                  value={step === "user" ? username : password}
                  onChange={e => step === "user" ? setUsername(e.target.value) : setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-[#00ff41] text-sm w-full caret-transparent"
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="w-[9px] h-[15px] bg-[#00ff41] flex-shrink-0" style={{ animation: "blink 1s step-end infinite" }} />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 text-xs text-red-400/80 border border-red-500/20 bg-red-950/20 px-3 py-2 rounded">
              {error}
            </p>
          )}

          {done && step === "user" && (
            <p className="mt-6 text-[10px] text-[#00ff41]/25 tracking-widest">
              [SYSTEM] Type your identifier then press ENTER ▸
            </p>
          )}
        </div>
      </div>

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <Inner />
    </React.Suspense>
  )
}
