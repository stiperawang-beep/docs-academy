"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { tutorials } from '#velite';
import { LogoutButton } from '@/components/logout-button';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [readSlugs, setReadSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const read = JSON.parse(localStorage.getItem("vd_read") || "[]") as string[];
      setReadSlugs(read);
    } catch {}
  }, []);

  const totalTutorials = tutorials.length;
  const completedCount = readSlugs.length;
  const pct = totalTutorials > 0 ? Math.round((completedCount / totalTutorials) * 100) : 0;

  // Find the next tutorial to read
  const sortedTutorials = [...tutorials].sort((a, b) => a.order - b.order);
  const nextTutorial = sortedTutorials.find(t => !readSlugs.includes(t.slug)) || sortedTutorials[0];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 py-12 max-w-5xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-2xl">👧</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Halo, Prasakati!</h1>
              <p className="text-muted-foreground">Selamat datang kembali di belajarmu.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <LogoutButton />
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Progress Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 rounded-3xl border border-border/50 bg-secondary/30 p-8 backdrop-blur-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col h-full justify-between gap-6 relative z-10">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Progres Belajarmu
                </h2>
                <p className="text-muted-foreground">
                  Kamu sudah membaca <strong className="text-foreground">{completedCount}</strong> dari <strong className="text-foreground">{totalTutorials}</strong> materi.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>{pct}% Selesai</span>
                  <span className="text-primary">{completedCount}/{totalTutorials}</span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-background border border-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Continue Target */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-primary/20 bg-primary/5 p-8 backdrop-blur-xl flex flex-col justify-between hover:bg-primary/10 transition-colors shadow-lg shadow-primary/5"
          >
            <div>
              <div className="inline-flex h-8 items-center rounded-full bg-primary/20 px-3 text-xs font-semibold text-primary mb-4">
                <Clock className="mr-1.5 h-3 w-3" />
                Lanjutkan
              </div>
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight mb-2">
                {nextTutorial?.title || 'Semua Selesai! 🎉'}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {nextTutorial?.description}
              </p>
            </div>

            <Link
              href={nextTutorial?.permalink || '/'}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Baca Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Content List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Daftar Materi</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTutorials.map((tutorial, idx) => {
              const isRead = readSlugs.includes(tutorial.slug);
              return (
                <Link
                  key={tutorial.slug}
                  href={tutorial.permalink}
                  className={cn(
                    "group relative flex flex-col gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md",
                    isRead 
                      ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40" 
                      : "border-border bg-card hover:border-primary/50 hover:shadow-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border",
                      isRead ? "bg-green-500/20 border-green-500/30 text-green-600" : "bg-secondary border-border"
                    )}>
                      {isRead ? <CheckCircle2 className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Bab {idx + 1}</span>
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-semibold leading-tight mb-1 group-hover:text-primary transition-colors",
                      isRead && "text-foreground"
                    )}>
                      {tutorial.title}
                    </h3>
                    {tutorial.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tutorial.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes slide {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
      `}</style>
    </div>
  );
}
