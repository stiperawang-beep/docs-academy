import { MetadataRoute } from 'next'
import { tutorials } from '#velite'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://victory-docs.vercel.app'

  const tutorialRoutes = tutorials.map((t) => ({
    url: `${baseUrl}${t.permalink}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...tutorialRoutes,
  ]
}
