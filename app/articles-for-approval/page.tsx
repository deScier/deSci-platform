"use client";

import * as Input from "@components/common/Input/Input";
import * as Title from "@components/common/Title/Page";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PublicJournalProps, PublicJournalsProps } from "@/services/journal/getJournals.service";
import { ApprovalStatus, DocumentProps, JournalProps } from "@/types/document";
import { authenticated_url, fetcher_authenticated } from "@/utils/fetcher";
import "components/common/Publication/Item/Item.css";
import { format, isValid, parseISO } from "date-fns";
import { truncate } from "lodash";
import { useSession } from "next-auth/react";

import PaginationComponent from "@/components/common/Pagination/Pagination";
import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

export default function ArticlesForApprovalPage() {
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const per_page = 8;
  const [page, setPage] = React.useState(1);
  const [filteredResults, setFilteredResults] = React.useState<DocumentProps[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);

  const [originatesFrom, setOriginatesFrom] = React.useState("");
  const [status, setStatus] = React.useState("");

  const { data: articles, isLoading: articles_loading } = useSWR(
    authenticated_url(session, "/journals/documents"),
    fetcher_authenticated(session)
  ) as {
    data: DocumentProps[] | undefined;
    isLoading: boolean;
  };

  const { data: journalsData, isLoading: journals_loading } = useSWR(
    authenticated_url(session, "/journals"),
    fetcher_authenticated(session)
  ) as {
    data: PublicJournalsProps | undefined;
    isLoading: boolean;
  };

  const journals = journalsData?.journals || [];

  React.useEffect(() => {
    if (articles) {
      let filtered = articles;

      if (debouncedSearchTerm) {
        filtered = filtered.filter((article) =>
          article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      if (status && status !== "all") {
        if (status.toLowerCase() === "approved") {
          filtered = filtered.filter(
            (article) => article.status.toLowerCase() === "approved" || article.status.toLowerCase() === "submitted"
          );
        } else {
          filtered = filtered.filter((article) => article.status.toLowerCase() === status.toLowerCase());
        }
      }

      if (originatesFrom) {
        filtered = filtered.filter((article) => article.journalId === originatesFrom);
      }

      setFilteredResults(filtered);
      setTotalPages(Math.ceil(filtered.length / per_page));
    }
  }, [articles, debouncedSearchTerm, status, originatesFrom]);

  const withoutFilters = !status && !searchTerm && !originatesFrom;

  return (
    <React.Suspense>
      <Title.Root>
        <Title.Title>Articles for approval</Title.Title>
      </Title.Root>
      <div className="min-h-screen space-y-6">
        <div className="grid gap-6">
          <div className="flex items-center gap-2">
            <Input.Search
              value={searchTerm}
              placeholder="Find journal with these terms"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap md:flex-row md:items-center gap-2">
            <Select value={originatesFrom || "all"} onValueChange={(value) => setOriginatesFrom(value)}>
              <SelectTrigger className="w-full sm:w-fit flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold min-w-[229px]">
                <SelectValue asChild>
                  <p>Journal: {journals.find((item) => item.id === originatesFrom)?.name || "All journals"}</p>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <React.Fragment>
                  {journals.map((item: PublicJournalProps) => (
                    <React.Fragment key={item.id}>
                      <SelectItem
                        value={item.id || "all"}
                        className="px-8 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                        onMouseUp={() => setOriginatesFrom(item.id)}
                      >
                        {item.name}
                      </SelectItem>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              </SelectContent>
            </Select>
            <Select value={status || "all"} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full sm:w-fit flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold min-w-[229px]">
                <SelectValue asChild>
                  <p>Status: {status || "All"}</p>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {["Pending", "Approved", "Rejected"].map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption} className="text-primary-main font-semibold">
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!withoutFilters && (
              <p
                className="text-base font-semibold text-terciary-main cursor-pointer hover:underline select-none"
                onClick={() => {
                  setStatus("");
                  setSearchTerm("");
                  setOriginatesFrom("");
                }}
              >
                Clear Filters
              </p>
            )}
          </div>
        </div>
        <div
          className={cn("flex flex-col gap-6", {
            results: filteredResults.length > 1,
            "min-h-[calc(50vh)]": filteredResults.length > 1,
          })}
        >
          <div className="grid gap-8">
            <div className="grid md:grid-cols-2 3xl:grid-cols-3 gap-4">
              {articles_loading ? (
                <React.Fragment>
                  <ArticleForApprovalSkeleton />
                  <ArticleForApprovalSkeleton />
                  <ArticleForApprovalSkeleton />
                  <ArticleForApprovalSkeleton />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {filteredResults.length === 0 ? (
                    <p className="text-center md:col-span-2 3xl:col-span-3 text-gray-500 my-8">
                      There are no articles under review at the moment.
                    </p>
                  ) : (
                    filteredResults.slice((page - 1) * per_page, page * per_page).map((article) => (
                      <React.Fragment key={article.id}>
                        <ArticleForApproval
                          title={article.title}
                          image={article.cover || "https://random.imagecdn.app/150/150"}
                          link={`/articles-for-approval/${article.id}`}
                          status={article.status}
                          createdAt={new Date(article.createdAt).toISOString()}
                          journal={article.journal}
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
              total={filteredResults.length}
              handleFirstPage={() => setPage(1)}
              handleNextPage={() => setPage(page + 1)}
              handlePreviousPage={() => setPage(page - 1)}
              handleLastPage={() => setPage(totalPages)}
            />
          </div>
        </div>
      </div>
    </React.Suspense>
  );
}

const ArticleForApproval: React.FC<ArticleForApprovalProps> = ({
  link,
  status,
  image,
  title,
  createdAt,
}: ArticleForApprovalProps) => {
  const date = parseISO(createdAt);
  const formated_since = isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid date";

  return (
    <React.Fragment>
      <div className="grid md:grid-cols-max-min-auto md:justify-start items-center gap-4 bg-[#fff] py-3 px-4 rounded-lg">
        <div className="relative w-full md:w-20 h-20">
          <Image
            fill
            src={image || "https://random.imagecdn.app/150/150"}
            alt={title}
            quality={50}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            className="rounded-md object-cover"
          />
        </div>
        <hr className="hidden md:block divider-v" />
        <hr className="block md:hidden divider-h" />
        <div className="grid gap-2 mt-[-8px]">
          <div>
            {title.length > 32 ? (
              <Link href={link}>
                <HoverCard>
                  <HoverCardTrigger className="flex flex-col md:flex-row md:items-center gap-4 flex-1 min-w-0">
                    <h6 className="hidden lg:block text-sm font-semibold text-secundary_blue-main lg:text-base cursor-pointer hover:text-primary-main hover:underline transition-all duration-200">
                      {truncate(title, { length: 30 })}
                    </h6>
                    <h6 className="block lg:hidden text-sm font-semibold text-secundary_blue-main lg:text-base cursor-pointer hover:text-primary-main hover:underline transition-all duration-200">
                      {truncate(title, { length: 70 })}
                    </h6>
                  </HoverCardTrigger>
                  <HoverCardContent align="center" side="top" className="w-fit max-w-[500px] py-1">
                    <p className="text-sm text-start font-semibold text-primary-main w-full">{title}</p>
                  </HoverCardContent>
                </HoverCard>
              </Link>
            ) : (
              <Link href={link}>
                <h6 className="text-sm font-semibold text-secundary_blue-main lg:text-base cursor-pointer hover:text-primary-main hover:underline transition-all duration-200">
                  {title}
                </h6>
              </Link>
            )}
            <div className="flex items-center gap-2">
              {status === "APPROVED" || status === "SUBMITTED" ? (
                <React.Fragment>
                  <p className="text-sm text-neutral-gray lg:text-sm">Published in</p>
                  <p className="text-base font-semibold lg:text-sm 2xl:text-base">{formated_since}</p>
                </React.Fragment>
              ) : status === "REJECTED" ? (
                <React.Fragment>
                  <p className="text-sm text-neutral-gray lg:text-sm">Rejected on</p>
                  <p className="text-base font-semibold lg:text-sm 2xl:text-base">{formated_since}</p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="flex items-center flex-grow gap-2">
                    <p className="text-sm text-neutral-gray lg:text-sm truncate">Under review since</p>
                    <p className="text-base font-semibold lg:text-sm 2xl:text-base truncate">{formated_since}</p>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="border-[1px] rounded-md px-2 border-neutral-stroke_light md:w-fit">
            <div className="grid grid-flow-col items-center justify-center md:justify-start">
              <div className="grid grid-flow-col gap-2 md:gap-1 items-center">
                {status === "APPROVED" || status === "SUBMITTED" ? (
                  <p className="text-sm 2xl:text-base font-semibold text-status-green">Published</p>
                ) : status === "REJECTED" ? (
                  <p className="text-sm 2xl:text-base font-semibold text-status-error">Rejected</p>
                ) : (
                  <p className="text-xs lg:text-sm font-semibold text-status-pending truncate flex-shrink-0">Pending</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

interface ArticleForApprovalProps {
  id?: string;
  status?: ApprovalStatus;
  image: string;
  journal: JournalProps | null | undefined;
  title: string;
  link: string;
  createdAt: string;
}

const ArticleForApprovalSkeleton: React.FC = () => {
  return (
    <React.Fragment>
      <div className="grid md:grid-cols-max-min-auto items-center gap-4 bg-[#fff] py-3 px-4 rounded-lg">
        <Skeleton className="rounded-md h-20 w-full md:w-20 object-cover" />
        <div className="hidden md:block divider-v" />
        <div className="block md:hidden divider-h" />
        <div className="grid gap-2 mt-[-8px]">
          <div className="grid gap-2">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-[90%] h-2" />
            <Skeleton className="w-[80%] h-2" />
            <div className="border-[1px] rounded-md px-2 border-neutral-stroke_light">
              <div className="flex gap-2 items-center justify-items-center">
                <Skeleton className="w-full h-2" />
                <span className="text-xs font-semibold text-slate-200">/</span>
                <Skeleton className="w-full h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
