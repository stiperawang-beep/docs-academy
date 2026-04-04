import { tutorials } from '#velite';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/components/mdx-components';
import { Sidebar } from '@/components/sidebar';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { ScrollProgress } from '@/components/scroll-progress';
import { TableOfContents, TocEntry } from '@/components/toc';
import { PageTransition } from '@/components/page-transition';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleFeedback } from '@/components/article-feedback';
import { Playground } from '@/components/playground';
import { MarkRead } from '@/components/mark-read';
import { ShareButtons } from '@/components/share-buttons';
import { Diff } from '@/components/diff';
import { estimateReadingTime } from '@/lib/reading-time';
import type { Metadata } from 'next';
import { Clock } from 'lucide-react';

interface TutorialPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  const tutorial = tutorials.find((t) => t.slug === slugPath);
  if (!tutorial) return {}
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://victory-docs.vercel.app'
  return {
    title: `${tutorial.title} — victory.docs`,
    description: tutorial.description || `Tutorial: ${tutorial.title}`,
    openGraph: {
      title: tutorial.title,
      description: tutorial.description || `Tutorial: ${tutorial.title}`,
      url: `${baseUrl}${tutorial.permalink}`,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: tutorial.title },
  }
}

export async function generateStaticParams() {
  return tutorials.map((tutorial) => ({
    slug: tutorial.slug.split('/'),
  }));
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  
  const tutorial = tutorials.find((t) => t.slug === slugPath);
  
  if (!tutorial) {
    notFound();
  }

  // Sort tutorials to determine next/prev
  const sortedTutorials = [...tutorials].sort((a, b) => a.slug.localeCompare(b.slug) || a.order - b.order);
  const currentIndex = sortedTutorials.findIndex((t) => t.slug === slugPath);
  const prevTutorial = currentIndex > 0 ? sortedTutorials[currentIndex - 1] : null;
  const nextTutorial = currentIndex < sortedTutorials.length - 1 ? sortedTutorials[currentIndex + 1] : null;

  return (
    <div className="flex min-h-screen">
      <ScrollProgress />
      
      {/* Mobile Sidebar */}
      <MobileSidebar currentSlug={slugPath} />

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border/50 fixed h-full hidden md:block bg-background/40 backdrop-blur-2xl z-10 supports-[backdrop-filter]:bg-background/40">
        <Sidebar currentSlug={slugPath} />
      </aside>
      
      <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-[1fr_250px] xl:gap-8 min-w-0">
        <PageTransition>
          <article className="max-w-3xl lg:max-w-4xl py-16 md:py-12 lg:py-16 mx-auto w-full prose prose-slate dark:prose-invert prose-img:rounded-xl prose-a:text-primary prose-p:leading-8 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-50 prose-li:my-1 prose-ul:my-4">
          <header className="mb-8 not-prose">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">{tutorial.title}</h1>
            {tutorial.description && (
              <p className="text-xl text-muted-foreground mt-2">{tutorial.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{estimateReadingTime(tutorial.content)} min read</span>
            </div>
            <ShareButtons title={tutorial.title} slug={tutorial.slug} />
          </header>
          
          <MDXContent code={tutorial.content} />
          
          <ArticleFeedback slug={tutorial.slug} />
          
          <MarkRead slug={tutorial.slug} />
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-8">
            {prevTutorial ? (
              <Link href={prevTutorial.permalink} className="flex-1 w-full flex items-center justify-start gap-2 rounded-lg border p-4 hover:bg-muted font-medium transition-colors">
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs text-muted-foreground font-normal">Previous</span>
                  <span>{prevTutorial.title}</span>
                </div>
              </Link>
            ) : <div className="flex-1 invisible" />}
            
            {nextTutorial ? (
              <Link href={nextTutorial.permalink} className="flex-1 w-full flex items-center justify-end gap-2 rounded-lg border p-4 hover:bg-muted font-medium transition-colors text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground font-normal">Next</span>
                  <span>{nextTutorial.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </Link>
            ) : <div className="flex-1 invisible" />}
          </div>
        </article>
        </PageTransition>

        <div className="hidden xl:block py-16">
          <div className="sticky top-16 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <TableOfContents toc={tutorial.toc as any} />
          </div>
        </div>
      </main>
    </div>
  );
}
