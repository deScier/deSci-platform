import * as React from 'react';

import type { Metadata } from 'next';
import { cache } from 'react';
import { AuthorsPublicInfo, DocumentPublicProps, GetDocumentPublicProps } from '@/services/document/getArticles';

import ArticleDetails from '@/components/pages/Article/Article';

const MIN_TERM_LENGTH_FOR_KEYWORD = 1;

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

const getValidImageUrl = (imageUrl: string, baseUrl: string): string => {
  if (!imageUrl) return `${baseUrl}/images/default-article.png`;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${baseUrl}${imageUrl}`;
};

const extractSearchContext = (doc: DocumentPublicProps) => ({
  term: doc.title || '-',
  authors: doc.authors?.map((author: AuthorsPublicInfo) => author.name || author).join(', ') || doc.authorName || '-',
  type: doc.field || '-',
});

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

const createTwitterMetadata = (doc: DocumentPublicProps, description: string, twitterImageUrl: string) => ({
  card: 'summary_large_image' as const,
  site: '@desciers',
  creator: '@desciers',
  title: doc.title,
  description,
  images: [twitterImageUrl],
});

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
