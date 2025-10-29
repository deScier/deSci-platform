import type { MetadataRoute } from 'next';
import type { DocumentProps } from '@/services/document/getArticles';
import type { PublicJournalProps } from '@/services/journal/getJournals.service';

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

  const [documents, journals] = await Promise.all([fetchPublicDocumentsServer(), fetchPublicJournalsServer()]);

  const approvedDocuments = documents.filter((document: DocumentProps) => {
    if ((document as { status?: string }).status) {
      return (document as { status?: string }).status === 'APPROVED';
    }

    return Boolean(document.publishedAt);
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/home/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journals`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const documentRoutes: MetadataRoute.Sitemap = approvedDocuments.map((document: DocumentProps) => ({
    url: `${baseUrl}/home/search/${document.id}`,
    lastModified: document.updatedAt ? new Date(document.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const paperRoutes: MetadataRoute.Sitemap = approvedDocuments
    .filter((document: DocumentProps) => Boolean(document.nftHash || document.id))
    .map((document: DocumentProps) => ({
      url: `${baseUrl}/paper/${document.nftHash || document.id}`,
      lastModified: document.updatedAt ? new Date(document.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const journalRoutes: MetadataRoute.Sitemap = journals.map((journal: PublicJournalProps) => ({
    url: `${baseUrl}/journals/${journal.id}`,
    lastModified: journal.updatedAt ? new Date(journal.updatedAt) : new Date(journal.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...documentRoutes, ...paperRoutes, ...journalRoutes];
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

/**
 * @notice Fetches all public journals from the API for sitemap generation
 * @dev Makes server-side request to /journals/public endpoint with 1-hour cache
 * @return Promise<PublicJournalProps[]> Array of public journal objects, empty array on error
 * @custom:cache Revalidates every 3600 seconds (1 hour)
 * @custom:endpoint GET /journals/public
 */
async function fetchPublicJournalsServer(): Promise<PublicJournalProps[]> {
  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!request.ok) {
      console.error('Failed to fetch public journals for sitemap, status:', request.status);
      return [];
    }

    const response = await request.json();

    if (Array.isArray(response)) {
      return response as PublicJournalProps[];
    }

    return response?.journals || [];
  } catch (error) {
    console.error('Error fetching public journals for sitemap:', error);
    return [];
  }
}
