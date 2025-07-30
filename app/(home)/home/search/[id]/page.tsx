import * as React from "react";

import { unstable_noStore } from "next/cache";
import { GetDocumentPublicProps } from "@/services/document/getArticles";

import ArticleDetails from "@/components/pages/Article/Article";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  unstable_noStore();

  const fetchArticle = async (documentId: string) => {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
