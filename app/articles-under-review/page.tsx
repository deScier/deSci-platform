"use client";

import * as Input from "@components/common/Input/Input";
import * as Title from "@components/common/Title/Page";

import {
  ArticleUnderReview,
  ArticleUnderReviewProps,
  ArticleUnderReviewSkeleton,
} from "@/components/common/Publication/Item/ArticlesUnderReview";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { articles_types_filter } from "@/mock/articles_types";
import { filter_status } from "@/mock/dropdow_filter_options";
import { home_routes } from "@/routes/home";
import { AuthorsOnDocuments } from "@/services/document/getArticles";
import { useArticles } from "@/services/document/getArticles.service";
import { useSession } from "next-auth/react";

import PaginationComponent from "@/components/common/Pagination/Pagination";
import useDebounce from "@/hooks/useDebounce";
import React from "react";

export default function ArticlesUnderReviewPage() {
  const { data: session } = useSession();
  const { articles, loading } = useArticles();

  const per_page = 8;
  const [page, setPage] = React.useState(1);
  const [documentType, setDocumentType] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [status, setStatus] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<ArticleUnderReviewProps[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);

  const redirectToArticle = (authors: AuthorsOnDocuments[], mainAuthorId: string, articleId: string) => {
    const isCoAuthor = authors.some(
      (item) => item.author?.userId === session?.user?.userInfo.id && item.author?.userId !== mainAuthorId
    );
    return isCoAuthor
      ? `${home_routes.articles.in_review}/only-view/${articleId}`
      : `${home_routes.articles.in_review}/${articleId}`;
  };

  React.useEffect(() => {
    if (articles) {
      setResults(articles);
      setTotalPages(Math.ceil(articles.length / per_page));
    }
  }, [articles]);

  React.useEffect(() => {
    if (!articles) return;

    let filteredArticles = [...articles];

    if (documentType && documentType !== "all") {
      filteredArticles = filteredArticles.filter(
        (article) => article.document_type?.toLowerCase() === documentType.toLowerCase()
      );
    }

    if (status) {
      filteredArticles = filteredArticles.filter((article) => article.status?.toLowerCase() === status.toLowerCase());
    }

    if (debouncedSearchTerm) {
      filteredArticles = filteredArticles.filter((article) =>
        article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    setResults(filteredArticles);
    setTotalPages(Math.ceil(filteredArticles.length / per_page));
  }, [articles, documentType, status, debouncedSearchTerm]);

  const withoutFilters = !documentType && !status && debouncedSearchTerm === "";

  return (
    <React.Fragment>
      <Title.Root>
        <Title.Title>My articles under review</Title.Title>
      </Title.Root>
      <div className="grid gap-6">
        <div className="grid gap-6">
          <div className="flex items-center gap-2">
            <Input.Search
              value={searchTerm}
              placeholder="Find articles with these terms"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap md:flex-row md:items-center gap-2">
            <Select
              value={documentType || "all"}
              onValueChange={(value) => setDocumentType(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-fit flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold min-w-[229px]">
                <SelectValue asChild>
                  <p>
                    Article type:{" "}
                    {articles_types_filter.find((item) => item.value === documentType)?.label || "All articles"}
                  </p>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <React.Fragment>
                  {articles_types_filter.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {item.type === "label" && (
                        <React.Fragment>
                          <p className="px-8 py-1.5 pl-8 pr-2 text-sm font-semibold pt-2">{item.label}</p>
                          <Separator />
                        </React.Fragment>
                      )}
                      {item.type === "item" && (
                        <SelectItem
                          value={item.value as string}
                          className="px-8 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                        >
                          {item.label}
                        </SelectItem>
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              </SelectContent>
            </Select>
            <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? null : value)}>
              <SelectTrigger className="w-full sm:w-fit flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold min-w-[229px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-primary-main font-semibold">
                  All status
                </SelectItem>
                {filter_status.map((item) => (
                  <SelectItem key={item.value} value={item.value} className="text-primary-main font-semibold">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {withoutFilters ? null : (
              <p
                className="text-base font-semibold text-terciary-main cursor-pointer hover:underline select-none"
                onClick={() => {
                  setDocumentType(null);
                  setStatus(null);
                  setSearchTerm("");
                }}
              >
                Clear Filters
              </p>
            )}
          </div>
        </div>
        <div
          className={cn("flex flex-col gap-6", {
            results: results.length > 1,
            "min-h-[calc(50vh)]": results.length > 1,
          })}
        >
          <div className="grid gap-8">
            <div className="grid md:grid-cols-2 3xl:grid-cols-3 gap-4">
              {loading ? (
                <React.Fragment>
                  <ArticleUnderReviewSkeleton />
                  <ArticleUnderReviewSkeleton />
                  <ArticleUnderReviewSkeleton />
                  <ArticleUnderReviewSkeleton />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {results.length === 0 ? (
                    <p className="text-center md:col-span-2 3xl:col-span-3 text-gray-500 my-8">
                      There are no articles under review at the moment.
                    </p>
                  ) : (
                    results.slice((page - 1) * per_page, page * per_page).map((article) => (
                      <React.Fragment key={article.id}>
                        <ArticleUnderReview
                          title={article.title}
                          since={article.since}
                          image={article.image}
                          link={redirectToArticle(article.authors!, article.userId!, article.id!)}
                          status_editor={article.status_editor as "pending" | "approved"}
                          status_reviewer={article.status_reviewer as "pending" | "approved"}
                          status_admin={article.status_admin as "pending" | "approved"}
                        />
                      </React.Fragment>
                    ))
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="flex justify-center h-full w-full">
            <PaginationComponent
              key={totalPages}
              current={page}
              perPage={per_page}
              total={results.length}
              handleFirstPage={() => setPage(1)}
              handleNextPage={() => setPage(page + 1)}
              handlePreviousPage={() => setPage(page - 1)}
              handleLastPage={() => setPage(totalPages)}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
