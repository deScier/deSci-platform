import type { MetadataRoute } from 'next'
import type { DocumentProps } from '@/services/document/getArticles'
import type { PublicJournalProps } from '@/services/journal/getJournals.service'
import { fetchPublicJournalsServer, fetchPublicDocumentsServer } from '@/lib/sitemap-utils'

/**
 * @title Dynamic Sitemap Generator for deSci Platform
 * @author deSci Platform Team
 * @notice Generates a comprehensive sitemap.xml file for search engine optimization
 * @dev This function fetches public content from the API and creates XML sitemap entries
 * following Google's sitemap protocol standards. Only APPROVED content is indexed.
 * @custom:seo Optimized for academic and scientific content discovery
 * @return Promise<MetadataRoute.Sitemap> Array of sitemap entries with URLs, priorities, and metadata
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://desci-platform.vercel.app'

  const [journals, documents] = await Promise.all([
    fetchPublicJournalsServer(),
    fetchPublicDocumentsServer()
  ])
  
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/journals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles-for-approval`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }
  ]
  
  const journalRoutes: MetadataRoute.Sitemap = journals
    .filter((journal: PublicJournalProps) => journal.status === 'APPROVED')
    .map((journal: PublicJournalProps) => ({
      url: `${baseUrl}/journals/${journal.id}`,
      lastModified: new Date(journal.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    }))

  const documentRoutes: MetadataRoute.Sitemap = documents
    .filter((document: DocumentProps) => document.status === 'APPROVED')
    .map((document: DocumentProps) => ({
      url: `${baseUrl}/paper/${document.id}`,
      lastModified: new Date(document.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    }))
  
  return [...staticRoutes, ...journalRoutes, ...documentRoutes]
}
