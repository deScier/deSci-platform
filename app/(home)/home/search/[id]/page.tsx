import * as React from 'react';

import type { Metadata } from 'next';
import { cache } from 'react';
import { GetDocumentPublicProps } from '@/services/document/getArticles';

import ArticleDetails from '@/components/pages/Article/Article';

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

const getValidImageUrl = (imageUrl: string, baseUrl: string) => {
  if (!imageUrl) return `${baseUrl}/images/default-article.png`;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${baseUrl}${imageUrl}`;
};

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://desci.reviews';
    
    const term = doc.title || '-';
    const authors = doc.authors?.join(', ') || '-';
    const type = doc.field || '-';
    
    const createContextualCanonicalUrl = (): string => {
      const baseCanonicalUrl = `${baseUrl}/home/search/${params.id}`;
      
      if (!term && !authors && !type) {
        return baseCanonicalUrl;
      }
      
      const queryParams = new URLSearchParams();
      if (term) queryParams.append('term', term);
      if (authors) queryParams.append('author', authors);
      if (type) queryParams.append('type', type);
      
      return `${baseCanonicalUrl}?${queryParams.toString()}`;
    };
    
    const baseKeywords = doc.keywords
      ? doc.keywords.split(',').map((k) => k.trim())
      : ['DeSci', 'scientific publishing', 'research'];
    
    const contextualKeywords = [...baseKeywords];
    
    if (term) {
      contextualKeywords.push(...term.split(' ').filter(term => term.length > 2));
    }
    if (authors) {
      contextualKeywords.push(authors);
    }
    
    const createContextualDescription = (): string => {
      const baseDescription = doc.abstract || 'A scientific publication on the deSci platform.';
      
      if (!term && !authors) {
        return baseDescription;
      }
      
      const contextParts: string[] = [];
      if (term) contextParts.push(`related to "${term}"`);
      if (authors) contextParts.push(`by ${authors}`);
      
      const contextSuffix = contextParts.length > 0 
        ? ` Found ${contextParts.join(' ')}.`
        : '';
      
      return `${baseDescription}${contextSuffix}`;
    };
    
    const createContextualTitle = (): string => {
      const baseTitle = `${doc.title} | deSci Publications`;
      
      if (term) {
        return `${doc.title} - ${term} | deSci Publications`;
      }
      
      if (authors) {
        return `${doc.title} by ${authors} | deSci Publications`;
      }
      
      return baseTitle;
    };

    const ogImageUrl = getValidImageUrl(doc.cover, baseUrl);
    const twitterImageUrl = getValidImageUrl(doc.cover, baseUrl);
    const contextualDescription = createContextualDescription();
    const contextualTitle = createContextualTitle();

    return {
        title: contextualTitle,
        description: contextualDescription,
        keywords: Array.from(new Set(contextualKeywords)), // Remove duplicates
        authors: doc.authors?.map((author) => ({ name: author.name })) || [{ name: doc.authorName }],
        openGraph: {
          title: doc.title,
          description: contextualDescription,
          type: 'article',
          url: createContextualCanonicalUrl(),
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
          authors: doc.authors?.map((author) => author.name) || [doc.authorName],
          section: doc.field || 'Research',
          tags: Array.from(new Set(contextualKeywords)),
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${doc.title} - deSci Publication`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@desciers',
        creator: '@desciers',
        title: doc.title,
        description: contextualDescription,
        images: [twitterImageUrl],
      },
      alternates: {
        canonical: createContextualCanonicalUrl(),
      },
    };
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
