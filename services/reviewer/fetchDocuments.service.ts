import { ReviewerItemProps } from "@/components/modules/AsReviewer/ReviewerItem/Typing";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DocumentGetProps, DocumentPaginationProps, DocumentProps } from "../document/getArticles";

/**
 * @title useArticlesToReview
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
export const useArticleToReview = () => {
  const { data } = useSession();

  const [raw, setRawArticles] = useState<DocumentProps | null>(null);
  const [article, setArticle] = useState<DocumentProps | null>(null);
  const [articles, setArticles] = useState<ReviewerItemProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticlesToReview = async () => {
      if (data?.user?.token) {
        const session = await getSession();

        if (session?.user?.token) {
          const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviewer/documents`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${session.user.token}`,
            },
          });

          const response: DocumentPaginationProps = await request.json();

          const formatted_response: ReviewerItemProps[] = response?.documents?.map((article) => {
            return {
              id: article.id,
              status: article.reviewersOnDocuments?.find((item) => item.reviewerEmail === data.user?.email)
                ?.approvedStatus as ReviewerItemProps["status"],
              added_as: article.reviewersOnDocuments?.find((item) => item.reviewerEmail === data.user?.email)
                ?.role as ReviewerItemProps["added_as"],
              image: article.cover || "",
              since: new Date(article.createdAt).toLocaleDateString("pt-BR"),
              link: article.documentLink || "",
              title: article.title,
              document_type: article.documentType,
              published: article.status === "SUBMITTED",
            };
          });

          setArticles(formatted_response);
          setLoading(false);
        }
      }
    };
    fetchArticlesToReview();
  }, [data?.user?.token, data?.user?.email, article]);

  /**
   * @param {string} documentId - The unique identifier of the article to fetch.
   * @return {DocumentProps} The fetched article data.
   */
  const fetchArticle = async (documentId: string) => {
    if (data?.user?.token) {
      const session = await getSession();

      if (session?.user?.token) {
        const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/private/${documentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session.user.token}`,
          },
        });

        const response: DocumentGetProps = await request.json().then((res) => {
          return res;
        });

        return response;
      }
    }
  };

  return { articles, loading, raw, fetch_article: fetchArticle };
};
