import * as React from 'react';
import type { Metadata } from 'next';

import { unstable_noStore } from 'next/cache';
import { GetDocumentPublicProps } from '@/services/document/getArticles';

import ArticleDetails from '@/components/pages/Article/Article';

const fetchArticle = async (documentId: string) => {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const response: GetDocumentPublicProps = await request.json();
  return response;
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
    const keywordsArray = doc.keywords ? doc.keywords.split(',').map(k => k.trim()) : ['DeSci', 'scientific publishing', 'research'];
    
    return {
      title: `${doc.title} | deSci Publications`,
      description: doc.abstract || 'A scientific publication on the deSci platform.',
      keywords: keywordsArray,
      authors: doc.authors?.map(author => ({ name: author.name })) || [{ name: doc.authorName }],
      openGraph: {
        title: doc.title,
        description: doc.abstract || 'A scientific publication on the deSci platform.',
        type: 'article',
        url: `${baseUrl}/paper/${params.id}`,
        siteName: 'deSci Publications',
        publishedTime: doc.publishedAt?.toISOString() || doc.createdAt.toISOString(),
        modifiedTime: doc.updatedAt.toISOString(),
        authors: doc.authors?.map(author => author.name) || [doc.authorName],
        section: doc.field || 'Research',
        tags: keywordsArray,
        images: [
          {
            url: doc.cover || `${baseUrl}/images/default-article.png`,
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
        description: doc.abstract || 'A scientific publication on the deSci platform.',
        images: [doc.cover || `${baseUrl}/images/default-article.png`],
      },
      alternates: {
        canonical: `${baseUrl}/paper/${params.id}`,
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
  unstable_noStore();

  const fetchArticle = async (documentId: string) => {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const response: GetDocumentPublicProps = await request.json();
    return response;
  };

  const article = await fetchArticle(params.id);

  return (
    <React.Suspense>
      <ArticleDetails data={article} />
    </React.Suspense>
  );
}
