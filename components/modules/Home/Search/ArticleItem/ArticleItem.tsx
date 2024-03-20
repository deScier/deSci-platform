import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { document_types } from '@/mock/document_types'
import { formatDate } from '@/utils/date_format'
import { truncate } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Eye, HandThumbsUpFill } from 'react-bootstrap-icons'
import slug from 'slug'
import { twMerge } from 'tailwind-merge'
import './ArticleItem.css'
import { ArticleItemProps } from './Typing'

/**
 * @title ArticleItem Component
 * @notice This component displays an individual article item with details like image, title, access type, likes, and views.
 * @dev Component for rendering article information in a structured and styled layout.
 */
export const ArticleItem: React.FC<ArticleItemProps> = ({
   image,
   title,
   access_type,
   likes,
   published_date,
   views,
   tags,
   authors,
   document_type,
   id
}: ArticleItemProps) => {
   return (
      <div className="grid gap-2 bg-[#fff] py-3 px-4 rounded-lg">
         <div className="grid lg:grid-cols-max-1px-auto lg:justify-start items-center gap-2 md:gap-4">
            <Image
               src={image}
               width={80}
               height={80}
               alt={title}
               style={{ objectFit: 'cover' }}
               className="rounded-md h-28 w-full lg:w-20 lg:h-20 2xl:w-20 2xl:h-20"
            />
            <hr className="hidden lg:block h-full w-[1px] bg-neutral-stroke_light" />
            <div className="grid gap-2">
               <div className="grid gap-2">
                  <div className="grid gap-2">
                     <Link
                        href="/home/search/[slug]"
                        as={`/home/search/${slug(id)}`}
                        className={twMerge(`${document_type && 'flex items-center gap-1'}`)}
                     >
                        {document_type && (
                           <React.Fragment>
                              {document_types.find((document) => document.value === document_type)?.label && (
                                 <React.Fragment>
                                    <span className="text-base font-semibold text-[#AE66E6] hover:underline transition-all duration-200">
                                       {document_types.find((document) => document.value === document_type)?.label}
                                    </span>
                                    <span className="text-base font-semibold hover:underline transition-all duration-200">•</span>
                                 </React.Fragment>
                              )}
                           </React.Fragment>
                        )}
                        <HoverCard openDelay={50} closeDelay={10}>
                           <HoverCardTrigger>
                              <h6 className="text-base font-semibold text-secundary_blue-main select-none cursor-pointer transition-all duration-200 hover:text-secundary_purple-hover hover:underline">
                                 {truncate(title, { length: 40 })}
                              </h6>
                           </HoverCardTrigger>
                           <HoverCardContent>
                              <p className="text-sm text-neutral-gray">{title}</p>
                           </HoverCardContent>
                        </HoverCard>
                     </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {tags.slice(0, 4).map((tag) => (
                        <div className="border rounded-md border-neutral-stroke_light flex items-center px-2 py-[2px]" key={tag.id}>
                           <span className="text-xs text-primary-main">{tag.name.length >= 25 ? truncate(title, { length: 20 }) : tag.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="grid gap-1">
                  <div className="flex items-center gap-1 flex-wrap">
                     {authors.map((author, index) => (
                        <React.Fragment key={author.id}>
                           <p className="text-sm text-[#5E6992]">
                              {author.name}
                              {index < authors.length - 1 && <span className="text-[#5E6992]">,</span>}
                           </p>
                        </React.Fragment>
                     ))}
                  </div>
                  <div>
                     <PublishedStatus published_date={published_date} access_type={access_type} likes={likes} views={views} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

/**
 * @title PublishedStatus Component
 * @notice This component displays the status of an article, including access type, likes, views, and published date.
 * @dev Component for rendering the status details of a published article.
 */
export const PublishedStatus: React.FC<PublishedStatusProps> = ({ published_date, access_type, likes, views }: PublishedStatusProps) => {
   return (
      <React.Fragment>
         <div className="grid gap-1">
            <div className="grid gap-2">
               {access_type == 'open' ? (
                  <React.Fragment>
                     <div className="flex flex-wrap gap-2 items-center">
                        <div className="w-3 h-3 bg-status-green rounded-full" />
                        <p className="text-sm">Open access</p>
                        <span className="text-neutral-gray">•</span>
                        <div className="flex items-center gap-1">
                           <HandThumbsUpFill className="text-terciary-main lg:w-4 2xl:w-5" />
                           <p className="text-sm text-neutral-gray">{likes}</p>
                        </div>
                        <div className="flex items-center gap-1">
                           <Eye className="text-terciary-main lg:w-4 2xl:w-5" />
                           <p className="text-sm text-neutral-gray">{views}</p>
                        </div>
                        <span className="text-neutral-gray">•</span>
                        <p className="text-sm text-neutral-gray">{formatDate(published_date)}</p>
                     </div>
                  </React.Fragment>
               ) : (
                  <React.Fragment>
                     <div className="flex gap-2 items-center">
                        <div className="w-3 h-3 bg-secundary_purple-main rounded-full" />
                        <p className="text-sm">Paid access</p>
                        <div className="flex items-center gap-1">
                           <HandThumbsUpFill className="text-terciary-main lg:w-4 2xl:w-5" />
                           <p className="text-sm text-neutral-gray">{likes}</p>
                        </div>
                        <span className="text-neutral-gray">•</span>
                        <div className="flex items-center gap-1">
                           <Eye className="text-terciary-main lg:w-4 2xl:w-5" />
                           <p className="text-sm text-neutral-gray">{views}</p>
                        </div>
                     </div>
                  </React.Fragment>
               )}
            </div>
         </div>
      </React.Fragment>
   )
}

interface PublishedStatusProps {
   published_date: string
   access_type?: 'open' | 'paid' | null
   likes?: number | null
   views?: number | null
}
