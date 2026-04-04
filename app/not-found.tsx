import Link from 'next/link'
import { ArrowLeft, FileSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] bg-background overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted border mb-8">
          <FileSearch className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/30 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Dokumen yang Anda cari tidak ada atau telah dipindahkan. Periksa kembali URL atau kembali ke halaman utama.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors flex-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/tutorial/01-chapter-1/01-sub-chapter"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-border bg-background font-medium text-sm hover:bg-accent transition-colors flex-1"
          >
            Lihat Tutorial
          </Link>
        </div>
      </div>
    </div>
  )
}
