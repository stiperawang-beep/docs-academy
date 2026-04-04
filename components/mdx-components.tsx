import * as runtime from 'react/jsx-runtime';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import { Callout } from '@/components/callout';
import { Pre } from '@/components/pre';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tabs';
import { Playground } from '@/components/playground';
import { Diff } from '@/components/diff';
import { Quiz } from '@/components/quiz';
import { VoiceNote } from '@/components/voice-note';
import { Glossary } from '@/components/glossary';
import { CodeChallenge } from '@/components/code-challenge';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const components = {
  h1: ({ className, ...props }: ComponentProps<'h1'>) => (
    <h1 className={cn('mt-2 scroll-m-20 text-4xl font-bold tracking-tight', className)} {...props} />
  ),
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2
      className={cn('mt-12 mb-6 scroll-m-20 border-l-4 border-primary bg-muted/30 px-4 py-2 rounded-r-lg text-3xl font-bold tracking-tight', className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3
      className={cn('mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2 before:content-[\'\'] before:block before:w-2 before:h-2 before:rounded-full before:bg-primary/50', className)}
      {...props}
    />
  ),
  blockquote: ({ className, children, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote
      className={cn('relative my-8 overflow-hidden rounded-xl border-l-4 border-l-primary bg-primary/5 p-6 shadow-sm', className)}
      {...props}
    >
      <Quote className="absolute top-4 right-4 h-16 w-16 text-primary/10 -rotate-12" />
      <div className="relative font-serif text-lg leading-relaxed italic text-foreground/90">{children}</div>
    </blockquote>
  ),
  a: ({ className, ...props }: ComponentProps<'a'>) => (
    <a className={cn('font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors', className)} {...props} />
  ),
  p: ({ className, ...props }: ComponentProps<'p'>) => (
    <p className={cn('leading-8 [&:not(:first-child)]:mt-6', className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul className={cn('my-6 ml-6 space-y-2 list-outside list-disc marker:text-primary', className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol className={cn('my-6 ml-6 space-y-2 list-outside list-decimal marker:text-primary marker:font-semibold', className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li className={cn('pl-2 mt-2 leading-relaxed', className)} {...props} />
  ),
  pre: Pre,
  Callout,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Playground,
  Diff,
  Quiz,
  VoiceNote,
  Glossary,
  CodeChallenge,
};

interface MDXProps {
  code: string;
}

export function MDXContent({ code }: MDXProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
