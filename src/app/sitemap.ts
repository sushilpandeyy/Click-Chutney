import { MetadataRoute } from 'next'
import { getAllPages } from '@/lib/pages'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clickchutney.vercel.app'
  
  // Get all policy pages
  const pages = await getAllPages()
  
  const policyPages = pages.map(page => ({
    url: `${baseUrl}/pages/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...policyPages,
  ]
}