import { cn } from "@/lib/utils"

interface DiffLine {
  type: "add" | "remove" | "unchanged"
  content: string
}

function parseDiff(diff: string): DiffLine[] {
  return diff.split("\n").map((line) => {
    if (line.startsWith("+")) return { type: "add", content: line.slice(1) }
    if (line.startsWith("-")) return { type: "remove", content: line.slice(1) }
    return { type: "unchanged", content: line.startsWith(" ") ? line.slice(1) : line }
  })
}

export function Diff({ code }: { code: string }) {
  const lines = parseDiff(code)

  return (
    <div className="not-prose my-6 rounded-lg border overflow-hidden text-sm font-mono">
      <div className="px-4 py-2 bg-muted border-b text-xs text-muted-foreground tracking-widest font-sans uppercase">
        Code Diff
      </div>
      <div className="overflow-x-auto bg-background">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 px-4 py-0.5 leading-5",
              line.type === "add" && "bg-green-500/10 text-green-700 dark:text-green-400",
              line.type === "remove" && "bg-red-500/10 text-red-700 dark:text-red-400",
              line.type === "unchanged" && "text-muted-foreground",
            )}
          >
            <span className="select-none w-4 shrink-0 opacity-60">
              {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
            </span>
            <span className="whitespace-pre">{line.content || "\u00a0"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
