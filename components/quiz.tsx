"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this project uses standard shadcn cn utility

export interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function Quiz({ question, options, correctAnswer, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selected === correctAnswer;

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected !== null) {
      setIsSubmitted(true);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setIsSubmitted(false);
  };

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-border/50 bg-secondary/20 shadow-lg backdrop-blur-sm">
      <div className="border-b border-border/30 bg-primary/10 px-6 py-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground m-0">Checkpoints</h3>
      </div>
      
      <div className="p-6">
        <p className="mb-6 text-base font-medium text-foreground/90">{question}</p>

        <div className="flex flex-col gap-3">
          {options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrectOption = idx === correctAnswer;
            
            let statusClass = "hover:border-primary/50 hover:bg-primary/5 border-border/50 bg-background/50";
            if (isSelected) {
              statusClass = "border-primary bg-primary/10";
            }
            if (isSubmitted) {
              if (isCorrectOption) {
                statusClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
              } else if (isSelected && !isCorrectOption) {
                statusClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 opacity-70";
              } else {
                statusClass = "border-border/20 bg-background/20 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
                className={cn(
                  "relative flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  statusClass
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground",
                    isSubmitted && isCorrectOption ? "border-green-500 bg-green-500 text-white" : "",
                    isSubmitted && isSelected && !isCorrectOption ? "border-red-500 bg-red-500 text-white" : ""
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={cn("text-sm sm:text-base", isSubmitted && isCorrectOption && "font-medium")}>
                    {option}
                  </span>
                </div>
                
                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {isSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: selected !== null ? 1 : 0, height: selected !== null ? 'auto' : 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex justify-end"
            >
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Cek Jawaban
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-6 rounded-xl border p-5",
                isCorrect 
                  ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/20" 
                  : "border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {isCorrect ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                      <span className="text-xl">✅</span>
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                      <span className="text-xl">❌</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={cn(
                    "mb-1 font-semibold",
                    isCorrect ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"
                  )}>
                    {isCorrect ? "Jawabanmu Benar! 🎉" : "Ups, Kurang Tepat!"}
                  </h4>
                  <p className="text-sm leading-relaxed opacity-90">
                    {explanation}
                  </p>
                  
                  {!isCorrect && (
                    <button
                      onClick={handleRetry}
                      className="mt-4 text-sm font-semibold text-primary hover:underline"
                    >
                      Coba Lagi
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
