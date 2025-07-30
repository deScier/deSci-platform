import { ArticleCardProps } from '@/components/modules/Home/Index/ArticleCard/Typing';
import { uniqueId } from 'lodash';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DocumentPaginationProps, DocumentProps, GetDocumentPublicProps } from './getArticles';

/**
 * @title useArticles
 * A React hook for fetching and managing articles.
 *
 * @author Your Name
 *
 * @notice This hook provides functions to fetch articles and manage article data.
 *
 * @dev This hook relies on the Next.js `useSession` hook to authenticate the user
 * and fetch article data. It fetches articles from the API and provides functions
 * to fetch individual articles.
 *
 * @return An object with properties:
 *   - articles: An array of ArticleUnderReviewProps representing articles.
 *   - loading: A boolean indicating whether data is being loaded.
 *   - raw: A DocumentProps representing the raw article data.
 *   - fetch_article: A function to fetch a specific article by its document ID.
 */
export const useArticles = () => {
  const { data } = useSession();

  const [raw, setRawArticles] = useState<DocumentProps | null>(null);
  const [article, setArticle] = useState<GetDocumentPublicProps | null>(null);
  const [articles, setArticles] = useState<ArticleCardProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response: DocumentPaginationProps = await request.json();

      const formatted_response: ArticleCardProps[] = response?.documents?.map((article) => {
        return {
          id: article.id,
          image: article.cover || '',
          title: article.title,
          authors:
            article.authorsOnDocuments?.map((item) => ({
              id: item.id || uniqueId('author'),
              name: item.author?.name || '',
            })) || [],
          likes: article.likes,
          views: article.views,
          tags: article.keywords.split(';')?.map((item) => ({ id: uniqueId('keyword'), name: item })) || [],
          publishedAt: new Date(article.publishedAt!),
          documentType: article.documentType,
          accessType: article.accessType === 'FREE' ? 'open' : 'paid',
          field: article.field,
          journal: article.journal,
        };
      });

      setArticles(formatted_response);
      setLoading(false);
    };
    fetchArticles();
  }, [data?.user?.token, article]);

  /**
   * @param {string} documentId - The unique identifier of the article to fetch.
   * @return {DocumentProps} The fetched article data.
   */
  const fetchArticle = async (documentId: string) => {
    const session = await getSession();
    if (!article) {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session?.user?.token}`,
        },
      });
      const response: GetDocumentPublicProps = await request.json().then((res) => {
        return res;
      });
      setArticle(response);
      return response;
    }
  };

  return { articles, loading, raw, fetch_article: fetchArticle };
};
