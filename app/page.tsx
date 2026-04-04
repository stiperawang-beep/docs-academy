import Link from 'next/link';
import { ArrowRight, Terminal, Lock } from 'lucide-react';
import { tutorials } from '#velite';

export default function HomePage() {
  const firstTutorial = tutorials.sort((a, b) => a.order - b.order)[0]

  return (
    <div className="relative min-h-[100dvh] bg-background overflow-hidden flex flex-col justify-center items-center">
      {/* Top nav login link */}
      <div className="absolute top-6 right-6 z-20">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border/50 rounded-full px-4 py-2 bg-background/30 backdrop-blur-sm hover:bg-accent/40 transition-all"
        >
          <Lock className="w-3.5 h-3.5" />
          Sign In
        </Link>
      </div>

      {/* Dynamic Background Textures & Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-border/50 bg-secondary/50 backdrop-blur-md text-secondary-foreground hover:bg-secondary/80 mb-8 cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
          victory.docs v2.0 Platform is Live
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 mb-8 z-10 leading-[1.1] pb-2">
          Modern Framework for <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-primary">Premium Docs.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mb-12 font-medium leading-relaxed">
          The ultimate composable, high-performance web architecture tailored for developers. Built on the edge with <strong className="text-foreground">Next.js 15</strong>, <strong className="text-foreground">Velite</strong>, and <strong className="text-foreground">Shadcn UI</strong>.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href={firstTutorial?.permalink || '/tutorial/01-chapter-1/01-sub-chapter'}
            className="inline-flex h-14 items-center justify-center gap-2 px-8 text-base font-semibold w-full sm:w-auto group rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            Start Reading
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2 px-8 text-base font-semibold w-full sm:w-auto rounded-full bg-background/50 backdrop-blur-sm border border-border text-foreground hover:bg-accent/50 transition-colors"
          >
            <Terminal className="h-4 w-4" />
            View Repository
          </a>
        </div>

      </main>

      {/* Decorative Floating Elements (cards) hidden on mobile */}
      <div className="absolute left-[10%] top-[40%] hidden xl:flex -rotate-12 flex-col gap-2 p-4 rounded-xl border bg-background/50 backdrop-blur-md shadow-2xl opacity-60 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
        <div className="h-3 w-20 rounded-full bg-primary/40"></div>
        <div className="h-3 w-32 rounded-full bg-muted"></div>
        <div className="h-3 w-24 rounded-full bg-muted"></div>
      </div>
      
      <div className="absolute right-[10%] bottom-[30%] hidden xl:flex rotate-12 flex-col gap-2 p-4 rounded-xl border bg-background/50 backdrop-blur-md shadow-2xl opacity-60 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
        <div className="h-3 w-24 rounded-full bg-blue-500/40"></div>
        <div className="h-3 w-16 rounded-full bg-muted"></div>
        <div className="h-3 w-28 rounded-full bg-muted"></div>
      </div>

    </div>
  )
}
