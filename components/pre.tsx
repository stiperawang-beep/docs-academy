"use client"

import { cn } from '@/lib/utils';
import { ComponentProps, useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

export function Pre({ children, className, ...props }: ComponentProps<"pre">) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copy = async () => {
    if (preRef.current) {
      const text = preRef.current.innerText;
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <pre ref={preRef} className={cn("overflow-x-auto", className)} {...props}>
        {children}
      </pre>
      <button
        onClick={copy}
        className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded bg-zinc-800 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-700 hover:text-zinc-50 group-hover:opacity-100 hidden sm:flex"
      >
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </button>
    </div>
  );
}
