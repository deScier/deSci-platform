import type { DocumentProps } from '@/services/document/getArticles'
import type { PublicJournalProps } from '@/services/journal/getJournals.service'

/**
 * @notice Fetches all public journals from the API for sitemap generation
 * @dev Makes server-side request to /journals/public endpoint with 1-hour cache
 * @return Promise<PublicJournalProps[]> Array of public journal objects, empty array on error
 * @custom:cache Revalidates every 3600 seconds (1 hour)
 * @custom:endpoint GET /journals/public
 */
export async function fetchPublicJournalsServer(): Promise<PublicJournalProps[]> {
  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }
    })
    
    if (!request.ok) {
      return []
    }
    
    const response = await request.json()
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Error fetching public journals for sitemap:', error)
    return []
  }
}

/**
 * @notice Fetches all public documents from the API for sitemap generation
 * @dev Makes server-side request to /documents endpoint with 1-hour cache
 * @return Promise<DocumentProps[]> Array of public document objects, empty array on error
 * @custom:cache Revalidates every 3600 seconds (1 hour)
 * @custom:endpoint GET /documents
 * @custom:filter Only APPROVED documents are included in sitemap
 */
export async function fetchPublicDocumentsServer(): Promise<DocumentProps[]> {
  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }
    })
    
    if (!request.ok) {
      return []
    }
    
    const response = await request.json()
    return response?.documents || []
  } catch (error) {
    console.error('Error fetching public documents for sitemap:', error)
    return []
  }
}
