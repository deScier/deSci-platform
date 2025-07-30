import { home_routes } from "@/routes/home";
import { formatAuthors } from "@/utils/format_authors";
import { ArticleCardProps } from "@components/modules/Home/Index/ArticleCard/Typing";
import "@styles/home.css";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Eye, HandThumbsUpFill } from "react-bootstrap-icons";
import { twMerge } from "tailwind-merge";

/**
 * @title ArticleCheckout Component
 * @notice This component is used for displaying a card with article details like title, authors, likes, views, and tags.
 */
export const ArticleCheckout: React.FC<ArticleCardProps> = ({
  authors,
  id,
  likes,
  tags,
  title,
  views,
  image,
  className,
  responsive,
}: ArticleCardProps) => {
  return (
    <Link href={home_routes.home.search + `/${id}`} className="flex md:grid items-start">
      <div className={twMerge("flex md:grid gap-2 md:gap-3", className)}>
        <div className={twMerge("flex-shrink-0 w-20 md:w-full md:h-52 h-20 overflow-hidden rounded-md relative")}>
          <Image
            fill
            src={image}
            alt="placeholder"
            className={twMerge("w-28 h-28 md:w-full md:h-full object-cover absolute inset-0")}
          />
        </div>
        <div className="grid gap-1 md:gap-2 content-center">
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-sm text-[#5E6992]">{formatAuthors(authors)}</p>
          </div>
          <p className="text-base md:text-sm text-secundary_blue-main font-semibold">{title}</p>
          {!likes && !views ? null : (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <HandThumbsUpFill className="text-terciary-main w-4 sm:w-5 h-4 sm:h-5" />
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
    </Link>
  );
};
