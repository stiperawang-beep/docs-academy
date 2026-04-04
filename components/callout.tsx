import { cn } from "@/lib/utils"
import { BookOpen, BrainCircuit, Beaker, AlertTriangle, AlertCircle, Info } from "lucide-react"

interface CalloutProps {
  icon?: React.ReactNode
  title?: string
  children?: React.ReactNode
  type?: "default" | "warning" | "danger" | "theorem" | "definition" | "hypothesis"
}

export function Callout({
  children,
  icon,
  title,
  type = "default",
  ...props
}: CalloutProps) {
  let DefaultIcon = <Info className="h-5 w-5" />
  if (type === "warning") DefaultIcon = <AlertTriangle className="h-5 w-5" />
  if (type === "danger") DefaultIcon = <AlertCircle className="h-5 w-5" />
  if (type === "theorem") DefaultIcon = <BrainCircuit className="h-5 w-5" />
  if (type === "definition") DefaultIcon = <BookOpen className="h-5 w-5" />
  if (type === "hypothesis") DefaultIcon = <Beaker className="h-5 w-5" />

  return (
    <div
      className={cn(
        "my-8 flex flex-col rounded-xl border p-6 shadow-sm overflow-hidden relative",
        {
          "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/40": type === "default",
          "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/40": type === "warning",
          "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/40": type === "danger",
          "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/40": type === "theorem",
          "border-l-4 border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/40": type === "definition",
          "border-l-4 border-l-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40": type === "hypothesis",
        }
      )}
      {...props}
    >
      <div className={cn("flex items-center gap-3 font-bold text-lg mb-2", {
         "text-blue-700 dark:text-blue-300": type === "default",
         "text-yellow-700 dark:text-yellow-300": type === "warning",
         "text-red-700 dark:text-red-300": type === "danger",
         "text-emerald-700 dark:text-emerald-300": type === "theorem",
         "text-indigo-700 dark:text-indigo-300": type === "definition",
         "text-fuchsia-700 dark:text-fuchsia-300": type === "hypothesis",
      })}>
        <span className="shrink-0">{icon || DefaultIcon}</span>
        {title && <span>{title}</span>}
        {!title && type === "theorem" && <span>Teorema / Hukum Dasar</span>}
        {!title && type === "definition" && <span>Glosarium / Definisi</span>}
        {!title && type === "hypothesis" && <span>Hipotesis Eksperimen</span>}
      </div>
      <div className="w-full prose-p:my-1 prose-p:leading-relaxed text-foreground/90">{children}</div>
    </div>
  )
}
