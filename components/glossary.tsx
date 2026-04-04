"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GlossaryProps {
  term?: string;
  definition: string;
  children: React.ReactNode;
}

export function Glossary({ term, definition, children }: GlossaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  
  const displayTerm = term || (typeof children === 'string' ? children : 'Istilah');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <span 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="cursor-help text-primary font-medium underline decoration-primary/50 decoration-dashed underline-offset-4 transition-colors hover:text-primary/80 hover:bg-primary/10 rounded-sm px-0.5">
        {children}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 p-3 text-sm flex"
          >
            <span className="block w-full relative rounded-xl border border-primary/20 bg-background/95 p-4 shadow-xl shadow-primary/10 backdrop-blur-md text-left">
              {/* Arrow/caret */}
              <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm border-b border-r border-primary/20 bg-background/95 backdrop-blur-md block" />
              
              <span className="relative z-10 flex flex-col gap-1.5">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <BookOpen className="h-3 w-3 text-primary" />
                  </span>
                  <span className="font-semibold text-foreground">{displayTerm}</span>
                </span>
                <span className="block text-muted-foreground leading-snug mt-1">
                  {definition}
                </span>
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
