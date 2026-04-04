"use client"

import Link from 'next/link';
import { tutorials } from '#velite';
import * as LucideIcons from 'lucide-react';
import { Search } from '@/components/search';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogoutButton } from '@/components/logout-button';
import { CheckCircle2, ChevronRight, ChevronDown, FoldVertical, UnfoldVertical } from 'lucide-react';
import { ProgressStats } from '@/components/progress-stats';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar({ currentSlug }: { currentSlug: string }) {
  const chapters = Array.from(new Set(tutorials.map((t) => t.slug.split('/')[0])));
  const [readSlugs, setReadSlugs] = React.useState<string[]>([]);
  // Store collapsed state. If a chapterSlug is in the array, it's collapsed (closed).
  const [collapsedChapters, setCollapsedChapters] = React.useState<string[]>([]);

  // Expand the active chapter on initial mount or path change
  React.useEffect(() => {
    const activeChapter = currentSlug.split('/')[0];
    if (activeChapter) {
      setCollapsedChapters((prev) => prev.filter(c => c !== activeChapter));
    }
  }, [currentSlug]);

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('vd_read') || '[]') as string[]
      setReadSlugs(stored)
    } catch {}
  }, [currentSlug])

  return (
    <div className="h-full overflow-y-auto py-6 px-4 flex flex-col gap-6">
      <div className="px-3 flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold">victory.docs</h2>
        <ThemeToggle />
      </div>
      <div className="px-3">
        <Search />
      </div>
      <ProgressStats />
      <div className="flex items-center justify-between px-3 mt-2 mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Curriculum</span>
        <button 
          onClick={() => {
            if (collapsedChapters.length === chapters.length) {
              setCollapsedChapters([]);
            } else {
              setCollapsedChapters(chapters);
            }
          }}
          className="p-1.5 -mr-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
          title={collapsedChapters.length === chapters.length ? "Expand All" : "Collapse All"}
        >
          {collapsedChapters.length === chapters.length ? <UnfoldVertical className="w-3.5 h-3.5" /> : <FoldVertical className="w-3.5 h-3.5" />}
        </button>
      </div>
      <nav className="space-y-6">
        {chapters.sort().map((chapterSlug) => {
          const chapterTutorials = tutorials
            .filter((t) => t.slug.startsWith(chapterSlug))
            .sort((a, b) => a.order - b.order);
            
          const formattedChapterName = chapterSlug.replace(/^\d+-/, '').replace(/-/g, ' ');
          const isCollapsed = collapsedChapters.includes(chapterSlug);

          const toggleCollapse = () => {
             setCollapsedChapters((prev) => 
               prev.includes(chapterSlug) 
                 ? prev.filter(c => c !== chapterSlug) 
                 : [...prev, chapterSlug]
             );
          };

          return (
            <div key={chapterSlug} className="select-none">
              <button 
                onClick={toggleCollapse}
                className="w-full flex items-center justify-between mb-2 px-3 py-1 font-semibold text-[13px] uppercase text-muted-foreground tracking-wider hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                aria-expanded={!isCollapsed}
              >
                <span className="line-clamp-1 text-left">{formattedChapterName}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.ul 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="space-y-1 overflow-hidden"
                  >
                    {chapterTutorials.map((tutorial) => {
                      const IconCmp = (LucideIcons as any)[tutorial.icon] || LucideIcons.FileText;
                      const isActive = currentSlug === tutorial.slug;
                      const isRead = readSlugs.includes(tutorial.slug);
                      return (
                        <li key={tutorial.slug}>
                          <Link 
                            href={tutorial.permalink}
                            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'}`}
                          >
                            <IconCmp className="w-4 h-4 shrink-0" />
                            <span className="flex-1 line-clamp-1">{tutorial.title}</span>
                            {isRead && !isActive && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border/50 space-y-1">
        <p className="px-3 text-[10px] text-muted-foreground/50 tracking-widest uppercase">Press ? for shortcuts</p>
        <LogoutButton />
      </div>
    </div>
  );
}
