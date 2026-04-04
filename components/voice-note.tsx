"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VoiceNoteProps {
  src: string;
  title?: string;
}

export function VoiceNote({ src, title = "Catatan Suara (Voice Note)" }: VoiceNoteProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = () => {
    if (hasError) return;
    
    const prevValue = isPlaying;
    
    if (!prevValue) {
      // Play returns a promise, which throws if source is missing/corrupted
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.error("Audio playback failed:", err);
          setHasError(true);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setCurrentTime(audio.currentTime);
    }
  };

  return (
    <div className="my-6 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4 shadow-sm backdrop-blur-sm">
      <audio ref={audioRef} preload="metadata" src={src} />
      
      {/* Avatar/Icon */}
      <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/20">
        <Mic className="h-6 w-6 text-primary-foreground" />
        {isPlaying && (
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
          </span>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground/90">
            {title} {hasError && <span className="text-destructive text-xs italic ml-2">(Audio Missing)</span>}
          </span>
          <span className="text-xs font-medium text-muted-foreground/80">
            {hasError ? 'Error' : `${calculateTime(currentTime)} / ${duration && !isNaN(duration) ? calculateTime(duration) : '00:00'}`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            disabled={hasError}
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm transition-transform hover:scale-105 hover:bg-accent focus:outline-none",
              hasError && "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-background"
            )}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-foreground" fill="currentColor" />
            ) : (
              <Play className="ml-1 h-4 w-4 text-foreground" fill="currentColor" />
            )}
          </button>

          <div className="relative flex-1 group">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            {/* Custom styled progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            {/* Visual waveform effect when playing */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-around px-1 pointer-events-none opacity-30 mix-blend-overlay">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 w-1 rounded-full bg-primary"
                    animate={{ height: ["4px", "16px", "4px"] }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      delay: Math.random() * 0.5,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
