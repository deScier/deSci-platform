import type { MetadataRoute } from 'next';
import type { DocumentProps } from '@/services/document/getArticles';

/**
 * @title Dynamic Sitemap Generator for deSci Platform
 * @author deSci Platform Team
 * @notice Generates a comprehensive sitemap.xml file for search engine optimization
 * @dev This function fetches public content from the API and creates XML sitemap entries
 * following Google's sitemap protocol standards. Only publicly accessible documents
 * are included. Private content requiring authentication is excluded from SEO indexing.
 * @custom:seo Optimized for academic and scientific content discovery
 * @return Promise<MetadataRoute.Sitemap> Array of sitemap entries with URLs, priorities, and metadata
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is required for sitemap generation');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [documents] = await Promise.all([fetchPublicDocumentsServer()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/articles-for-approval`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  const documentRoutes: MetadataRoute.Sitemap = documents.map((document: DocumentProps) => ({
    url: `${baseUrl}/paper/${document.id}`,
    lastModified: new Date(document.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...documentRoutes];
}

/**
 * @notice Fetches all public documents from the API for sitemap generation
 * @dev Makes server-side request to /documents endpoint with 1-hour cache
 * @return Promise<DocumentProps[]> Array of public document objects, empty array on error
 * @custom:cache Revalidates every 3600 seconds (1 hour)
 * @custom:endpoint GET /documents
 * @custom:filter Only APPROVED documents are included in sitemap
 */
async function fetchPublicDocumentsServer(): Promise<DocumentProps[]> {
  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!request.ok) {
      console.error('Failed to fetch public documents for sitemap, status:', request.status);
      return [];
    }

    const response = await request.json();
    return response?.documents || [];
  } catch (error) {
    console.error('Error fetching public documents for sitemap:', error);
    return [];
  }
}
