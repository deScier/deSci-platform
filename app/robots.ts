import type { MetadataRoute } from 'next';

/**
 * @notice Generates robots.txt configuration for search engine crawlers
 * @dev Defines allowed/disallowed paths and sitemap location for SEO optimization
 * @return MetadataRoute.Robots Configuration object with crawler rules and sitemap reference
 * @custom:routes Specifically allows journals/* and paper/* for research content indexing
 * @custom:sitemap Points to dynamically generated XML sitemap for content discovery
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/home', '/home/search', '/home/search/*', '/paper/*'],
      disallow: [
        '/api/',
        '/profile/',
        '/my-ip/',
        '/journals/',
        '/articles-under-review/',
        '/articles-for-approval',
        '/as-reviewer/',
        '/summary/',
        '/descier/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
