import * as React from 'react';

import type { Metadata } from 'next';
import { cache } from 'react';
import { AuthorsPublicInfo, DocumentPublicProps, GetDocumentPublicProps } from '@/services/document/getArticles';

import ArticleDetails from '@/components/pages/Article/Article';

const MIN_TERM_LENGTH_FOR_KEYWORD = 1;

/**
 * @notice Fetches article data from the API with caching enabled
 * @dev Uses React's cache function to prevent duplicate requests for the same document.
 * Throws an error if the request fails or returns a non-ok status
 * @param documentId The unique identifier for the document to fetch
 * @return Promise<GetDocumentPublicProps> The article data including document and metadata
 */
const fetchArticle = cache(async (documentId: string): Promise<GetDocumentPublicProps> => {
  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!request.ok) {
      throw new Error(`HTTP error! status: ${request.status}`);
    }

    const response: GetDocumentPublicProps = await request.json();
    return response;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
});

/**
 * @notice Validates and formats image URLs for metadata generation
 * @dev Returns a default image if no URL is provided, preserves absolute URLs,
 * and converts relative URLs to absolute ones using the base URL
 * @param imageUrl The image URL to validate (can be empty, relative, or absolute)
 * @param baseUrl The base URL to prepend to relative image URLs
 * @return string A valid absolute image URL
 */
const getValidImageUrl = (imageUrl: string, baseUrl: string): string => {
  if (!imageUrl) return `${baseUrl}/images/default-article.png`;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${baseUrl}${imageUrl}`;
};

/**
 * @notice Extracts search-related metadata from a document for URL generation and SEO
 * @dev Normalizes document properties into a consistent format, using fallbacks
 * and the '-' character as a placeholder for missing values
 * @param doc The document object containing title, authors, and field information
 * @return object An object with term, authors, and type properties for search context
 */
const extractSearchContext = (doc: DocumentPublicProps) => ({
  term: doc.title || '-',
  authors: doc.authors?.map((author: AuthorsPublicInfo) => author.name || author).join(', ') || doc.authorName || '-',
  type: doc.field || '-',
});

/**
 * @notice Creates canonical URLs for search result pages with optional query parameters
 * @dev Builds a base canonical URL and conditionally adds query parameters for term, author, and type.
 * Skips parameters that are undefined, empty, or equal to the placeholder '-'
 * @param baseUrl The base URL of the application
 * @param id The document ID for the search result
 * @param term Optional search term to include in query parameters
 * @param authors Optional author names to include in query parameters
 * @param type Optional document type/field to include in query parameters
 * @return string The complete canonical URL with appropriate query parameters
 */
const createCanonicalUrl = (baseUrl: string, id: string, term?: string, authors?: string, type?: string): string => {
  const baseCanonicalUrl = `${baseUrl}/home/search/${id}`;

  if ((!term || term === '-') && (!authors || authors === '-') && (!type || type === '-')) {
    return baseCanonicalUrl;
  }

  const queryParams = new URLSearchParams();
  if (term && term !== '-') queryParams.append('term', term);
  if (authors && authors !== '-') queryParams.append('author', authors);
  if (type && type !== '-') queryParams.append('type', type);

  return `${baseCanonicalUrl}?${queryParams.toString()}`;
};

/**
 * @notice Processes and filters keywords for SEO metadata generation
 * @dev Combines document keywords with contextual search terms, removes duplicates,
 * and filters out invalid entries. Only adds search terms that meet minimum length requirements
 * and differ from the document title
 * @param docKeywords Optional comma-separated string of document keywords
 * @param docTitle Optional document title for comparison with search terms
 * @param term Optional search term to potentially include as a keyword
 * @return string[] Array of unique, valid keywords for metadata
 */
const processKeywords = (docKeywords?: string, docTitle?: string, term?: string): string[] => {
  const baseKeywords = docKeywords
    ? docKeywords.split(',').map((k) => k.trim())
    : ['DeSci', 'scientific publishing', 'research'];

  const contextualKeywords = [...baseKeywords];

  if (term && term !== '-' && docTitle && term !== docTitle && term.length > MIN_TERM_LENGTH_FOR_KEYWORD) {
    contextualKeywords.push(term);
  }

  return Array.from(new Set(contextualKeywords.filter((keyword) => keyword && keyword !== '-')));
};

/**
 * @notice Creates contextual descriptions for search result pages
 * @dev Enhances base descriptions with search context when available.
 * Avoids redundancy by not adding context when search term matches document title
 * @param baseDescription The original document description or abstract
 * @param docTitle The document title for comparison with search terms
 * @param term Optional search term to include in contextual description
 * @param authors Optional author names to include in contextual description
 * @return string Enhanced description with search context or original description
 */
const createContextualDescription = (
  baseDescription: string,
  docTitle: string,
  term?: string,
  authors?: string
): string => {
  if (!term || term === '-' || !authors || authors === '-') {
    return baseDescription;
  }

  if (term === docTitle) {
    return baseDescription;
  }

  const contextParts: string[] = [];
  if (term && term !== '-') {
    contextParts.push(`related to "${term}"`);
  }
  if (authors && authors !== '-') {
    contextParts.push(`by ${authors}`);
  }

  const contextSuffix = contextParts.length > 0 ? ` Found ${contextParts.join(' ')}.` : '';

  return `${baseDescription}${contextSuffix}`;
};

/**
 * @notice Creates contextual page titles for SEO optimization
 * @dev Enhances document titles with search context when available.
 * Prioritizes search terms over author names and avoids redundancy
 * @param docTitle The original document title
 * @param term Optional search term to include in the title
 * @param authors Optional author names to include in the title
 * @return string Enhanced title with search context and site branding
 */
const createContextualTitle = (docTitle: string, term?: string, authors?: string): string => {
  const baseTitle = `${docTitle} | deSci Publications`;

  if (term && term !== docTitle && term !== '-') {
    return `${docTitle} - ${term} | deSci Publications`;
  }

  if (authors && authors !== '-') {
    return `${docTitle} by ${authors} | deSci Publications`;
  }

  return baseTitle;
};

/**
 * @notice Creates Open Graph metadata object for social media sharing
 * @dev Builds comprehensive Open Graph tags including article-specific metadata
 * like publish dates, authors, and section information for rich social previews
 * @param doc The document object containing article information
 * @param description The processed description for the article
 * @param canonicalUrl The canonical URL for the article page
 * @param keywords Array of keywords to include as tags
 * @param ogImageUrl The image URL for Open Graph sharing
 * @return object Open Graph metadata object with article-specific properties
 */
const createOpenGraphMetadata = (
  doc: DocumentPublicProps,
  description: string,
  canonicalUrl: string,
  keywords: string[],
  ogImageUrl: string
) => ({
  title: doc.title,
  description,
  type: 'article' as const,
  url: canonicalUrl,
  siteName: 'deSci Publications',
  publishedTime: doc.publishedAt
    ? new Date(doc.publishedAt).toISOString()
    : doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : undefined,
  modifiedTime: doc.updatedAt
    ? new Date(doc.updatedAt).toISOString()
    : doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : undefined,
  authors: doc.authors?.map((author: AuthorsPublicInfo) => author.name) || [doc.authorName],
  section: doc.field || 'Research',
  tags: keywords,
  images: [
    {
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: `${doc.title} - deSci Publication`,
    },
  ],
});

/**
 * @notice Creates Twitter Card metadata for enhanced Twitter sharing
 * @dev Builds Twitter-specific metadata using large image card format
 * for optimal presentation in Twitter feeds
 * @param doc The document object containing article information
 * @param description The processed description for the Twitter card
 * @param twitterImageUrl The image URL for Twitter card display
 * @return object Twitter Card metadata object with summary_large_image format
 */
const createTwitterMetadata = (doc: DocumentPublicProps, description: string, twitterImageUrl: string) => ({
  card: 'summary_large_image' as const,
  site: '@desciers',
  creator: '@desciers',
  title: doc.title,
  description,
  images: [twitterImageUrl],
});

/**
 * @notice Assembles the complete Next.js Metadata object for the page
 * @dev Combines all metadata components (basic SEO, Open Graph, Twitter, canonical)
 * into a single object that Next.js can use for page head generation
 * @param doc The document object containing article information
 * @param title The processed page title
 * @param description The processed page description
 * @param keywords Array of processed keywords
 * @param canonicalUrl The canonical URL for the page
 * @param ogImageUrl The Open Graph image URL
 * @param twitterImageUrl The Twitter card image URL
 * @return Metadata Complete Next.js metadata object for the page
 */
const createMetadataObject = (
  doc: DocumentPublicProps,
  title: string,
  description: string,
  keywords: string[],
  canonicalUrl: string,
  ogImageUrl: string,
  twitterImageUrl: string
): Metadata => ({
  title,
  description,
  keywords,
  authors: doc.authors?.map((author: AuthorsPublicInfo) => ({ name: author.name })) || [{ name: doc.authorName }],
  openGraph: createOpenGraphMetadata(doc, description, canonicalUrl, keywords, ogImageUrl),
  twitter: createTwitterMetadata(doc, description, twitterImageUrl),
  alternates: { canonical: canonicalUrl },
});

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const article = await fetchArticle(params.id);

    if (!article || !article.document) {
      return {
        title: 'Article Not Found | deSci Publications',
        description: 'The requested article could not be found.',
      };
    }

    const doc = article.document;

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error("NEXT_PUBLIC_BASE_URL environment variable is required for generating metadata. Please set NEXT_PUBLIC_BASE_URL in your environment configuration.");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const { term, authors, type } = extractSearchContext(doc);

    const canonicalUrl = createCanonicalUrl(baseUrl, params.id, term, authors, type);
    const keywords = processKeywords(doc.keywords, doc.title, term);
    const baseDescription = doc.abstract || 'A scientific publication on the deSci platform.';
    const description = createContextualDescription(baseDescription, doc.title, term, authors);
    const title = createContextualTitle(doc.title, term, authors);
    const ogImageUrl = getValidImageUrl(doc.cover, baseUrl);
    const twitterImageUrl = getValidImageUrl(doc.cover, baseUrl);

    return createMetadataObject(doc, title, description, keywords, canonicalUrl, ogImageUrl, twitterImageUrl);
  } catch (error) {
    console.error('Error generating metadata for article:', error);
    return {
      title: 'Article | deSci Publications',
      description: 'A scientific publication on the deSci platform.',
    };
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await fetchArticle(params.id);

  return (
    <React.Suspense>
      <ArticleDetails data={article} />
    </React.Suspense>
  );
}
