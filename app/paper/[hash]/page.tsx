import ArticleDetails from '@/app/(home)/home/search/[id]/page';
import type { Metadata } from 'next';
import { cache } from 'react';
import { AuthorsPublicInfo, DocumentPublicProps, GetDocumentPublicProps } from '@/services/document/getArticles';

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

export async function generateMetadata({ params }: { params: { hash: string } }): Promise<Metadata> {
  try {
    const article = await fetchArticle(params.hash);

    if (!article || !article.document) {
      return {
        title: 'Article Not Found | deSci Publications',
        description: 'The requested article could not be found.',
      };
    }

    const doc = article.document;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const canonicalUrl = `${baseUrl}/paper/${params.hash}`;
    const imageUrl = doc.cover || `${baseUrl}/images/default-article.png`;
    const validImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

    return {
      title: `${doc.title} | deSci Publications`,
      description: doc.abstract || 'A scientific publication on the deSci platform.',
      keywords: doc.keywords?.split(',').map((k) => k.trim()) || ['DeSci', 'scientific publishing', 'research'],
      authors: doc.authors?.map((author: AuthorsPublicInfo) => ({ name: author.name })) || [{ name: doc.authorName }],
      openGraph: {
        title: doc.title,
        description: doc.abstract || 'A scientific publication on the deSci platform.',
        type: 'article',
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
        images: [
          {
            url: validImageUrl,
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
        images: [validImageUrl],
      },
      alternates: { canonical: canonicalUrl },
    };
  } catch (error) {
    console.error('Error generating metadata for paper:', error);
    return {
      title: 'Article | deSci Publications',
      description: 'A scientific publication on the deSci platform.',
    };
  }
}

export default function Paper({ params }: { params: { hash: string } }) {
  return <ArticleDetails params={{ id: params.hash }} />;
}
