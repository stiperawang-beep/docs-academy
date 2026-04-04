"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, Moon, Sun, Laptop, LogOut, LayoutDashboard, Book } from "lucide-react"
import { useTheme } from "next-themes"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { tutorials } from "#velite"

export function Search() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden lg:inline-flex">Search docs...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Cari chapter/sub-chapter..." />
          <CommandList>
            <CommandEmpty>Tujuan tidak ditemukan.</CommandEmpty>
            
            <CommandGroup heading="Materi & Artikel">
              {tutorials.map((tutorial) => (
                <CommandItem
                  key={tutorial.slug}
                  value={tutorial.title}
                  onSelect={() => {
                    runCommand(() => router.push(tutorial.permalink))
                  }}
                  className="flex items-center gap-2"
                >
                  <Book className="w-4 h-4 text-muted-foreground" />
                  <span>{tutorial.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Navigasi Sistem">
              <CommandItem 
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                <span>Buka Dashboard</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Tampilan & Aksi">
              <CommandItem onSelect={() => runCommand(() => setTheme('light'))} className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <span>Ganti Tema Terang (Light)</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('dark'))} className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-muted-foreground" />
                <span>Ganti Tema Gelap (Dark)</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('system'))} className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-muted-foreground" />
                <span>Ikuti Tema Sistem Asli</span>
              </CommandItem>
              <CommandItem 
                onSelect={() => runCommand(() => {
                  document.cookie = "vd_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                  router.push('/login');
                })}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar / Logout</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
