"use client"

import * as React from "react"

export interface TocEntry {
  title: string
  url: string
  items?: TocEntry[]
}

interface TocProps {
  toc: TocEntry[]
}

function flattenToc(entries: TocEntry[]): string[] {
  return entries.reduce((acc, current) => {
    acc.push(current.url.slice(1))
    if (current.items) {
      acc.push(...flattenToc(current.items))
    }
    return acc
  }, [] as string[])
}

function renderItems(items: TocEntry[], activeId: string, level = 0) {
  return (
    <ul className={level === 0 ? "space-y-2 text-sm" : "space-y-2 text-sm pl-4 pt-2"}>
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            className={`block transition-colors hover:text-foreground line-clamp-2 ${
              activeId === item.url.slice(1)
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
          >
            {item.title}
          </a>
          {item.items && item.items.length > 0 && renderItems(item.items, activeId, level + 1)}
        </li>
      ))}
    </ul>
  )
}

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    const ids = flattenToc(toc || [])
    
    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
    }
  }, [toc])

  if (!toc || toc.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Di Halaman Ini</h3>
      {renderItems(toc, activeId)}
    </div>
  )
}
