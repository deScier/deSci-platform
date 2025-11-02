import type { Metadata } from 'next';

export function generateHomeMetadata(): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: 'Home - deSci Publications',
    description:
      'Explore decentralized science publications, research papers, and academic journals on the deSci platform.',
    keywords: ['DeSci', 'decentralized science', 'research', 'publications', 'academic journals'],
    alternates: {
      canonical: `${baseUrl}/home`,
    },
    openGraph: {
      title: 'deSci Publications - Decentralized Science',
      description:
        'Explore decentralized science publications, research papers, and academic journals on the deSci platform.',
      url: `${baseUrl}/home`,
      siteName: 'deSci Publications',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@desciers',
      creator: '@desciers',
      title: 'deSci Publications - Decentralized Science',
      description:
        'Explore decentralized science publications, research papers, and academic journals on the deSci platform.',
    },
  };
}
