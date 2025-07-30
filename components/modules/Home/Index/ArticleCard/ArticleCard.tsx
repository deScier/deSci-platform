import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { document_types } from "@/mock/document_types";
import { formatAuthors } from "@/utils/format_authors";
import { ArticleCardProps } from "@components/modules/Home/Index/ArticleCard/Typing";
import "@styles/home.css";
import { truncate } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Eye, HandThumbsUp } from "react-bootstrap-icons";
import slug from "slug";
import { twMerge } from "tailwind-merge";

/** @title ArticleCard Component
 *  @notice This component creates a card to display article details such as authors, likes, tags, title, views, image, etc.
 *  @dev The component receives several props to customize its behavior and appearance.
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
  authors,
  id,
  likes,
  tags,
  title,
  views,
  image,
  className,
  responsive,
  documentType,
  with_dot = true,
  link,
}: ArticleCardProps) => {
  return (
    <div className="grid items-start">
      <div
        className={twMerge(
          "max-w-full sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] grid gap-3 sm:gap-4 items-start",
          className,
          `${responsive && "max-w-full"}`
        )}
      >
        <div
          className={twMerge(
            "w-full h-20 sm:h-48 sm:w-48 md:w-52 md:h-52 lg:w-60 lg:h-60 overflow-hidden rounded-md relative",
            `${responsive && "w-full"}`
          )}
        >
          <Image
            priority
            quality={100}
            width={240}
            height={240}
            src={image}
            alt="placeholder"
            className={twMerge("w-full h-full object-cover absolute inset-0", `${responsive && "w-full"}`)}
          />
        </div>
        <div className="grid gap-1 sm:gap-2">
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-xs sm:text-sm text-[#5E6992] first-letter:uppercase">{formatAuthors(authors)}</p>
          </div>
          {documentType && (
            <React.Fragment>
              {document_types.find((document) => document.value === documentType)?.label && (
                <React.Fragment>
                  <span className="text-sm font-semibold text-primary-main transition-all duration-200">
                    {document_types.find((document) => document.value === documentType)?.label}
                  </span>
                  {with_dot && (
                    <span className="text-sm font-semibold hover:underline transition-all duration-200">•</span>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          <HoverCard openDelay={50} closeDelay={10}>
            <HoverCardTrigger>
              <Link href="/home/search/[slug]" as={`/home/search/${slug(id)}`}>
                <p className="text-sm sm:text-base text-secundary_blue-main font-semibold hover:underline cursor-pointer">
                  {truncate(title, { length: 54 })}
                </p>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-xs sm:text-sm text-secundary_blue-main font-regular">{title}</p>
            </HoverCardContent>
          </HoverCard>
          {!likes && !views ? null : (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <HandThumbsUp className="text-terciary-main w-4 sm:w-5 h-4 sm:h-5" />
                <p className="text-xs sm:text-sm text-neutral-gray">{likes}</p>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="text-terciary-main w-4 sm:w-5 h-4 sm:h-5" />
                <p className="text-xs sm:text-sm text-neutral-gray">{views}</p>
              </div>
            </div>
          )}
          {!tags ? null : (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {tags.map((tag) => (
                <div
                  className="border rounded-md border-neutral-stroke_light flex items-center px-1 sm:px-2 py-[2px] bg-white"
                  key={tag.id}
                >
                  <span className="text-xxs sm:text-xs text-primary-main">{tag.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
