export function estimateReadingTime(content: string): number {
  // Average adult reads ~200 words per minute
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
