import type { MetadataRoute } from 'next';

/**
 * @notice Generates robots.txt configuration for search engine crawlers
 * @dev Defines allowed/disallowed paths and sitemap location for SEO optimization
 * @return MetadataRoute.Robots Configuration object with crawler rules and sitemap reference
 * @custom:routes Specifically allows journals/* and paper/* for research content indexing
 * @custom:sitemap Points to dynamically generated XML sitemap for content discovery
 */
export default function robots(): MetadataRoute.Robots {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is required for robots.txt generation');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/home/search/*', '/articles-for-approval'],
      disallow: [
        '/api/',
        '/profile/',
        '/my-ip/',
        '/articles-under-review/',
        '/as-reviewer/',
        '/summary/',
        '/descier/',
        '/journals/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
