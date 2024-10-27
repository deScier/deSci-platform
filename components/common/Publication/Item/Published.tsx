import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Eye, HandThumbsUpFill } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

import useDimension from '@/hooks/useWindowDimension'
import Image from 'next/image'
import React from 'react'

/**
 * @title PublicationItem Component
 * @notice This component displays a publication item with details like title, likes, views, and date.
 * @dev Component for displaying individual publication items in a list or grid format.
 */
export const PublicationItem: React.FC<PublicationItemProps> = ({
   date,
   link,
   likes,
   views,
   id,
   title,
   image,
   className,
   published
}: PublicationItemProps) => {
   const { windowDimension } = useDimension()
   const isSmallDesktop = windowDimension && windowDimension < 1440 && windowDimension >= 1024
   return (
      <React.Fragment>
         <div className={twMerge('flex flex-col lg:flex-row lg:items-center lg:gap-4 gap-2', className)}>
            <Image
               quality={50}
               src={image}
               width={420}
               height={420}
               alt={title}
               style={{ objectFit: 'cover' }}
               className="rounded-md w-full h-20 lg:w-20 xxl:w-16 xxl:h-16 2xl:w-20 2xl:h-20 object-cover"
            />
            <div className="grid gap-2">
               {isSmallDesktop ? (
                  <HoverCard>
                     <HoverCardTrigger className="truncate cursor-pointer">
                        <h6 className="text-sm md:text-base font-semibold text-secundary_blue-main truncate cursor-pointer">{title}</h6>
                     </HoverCardTrigger>
                     <HoverCardContent>{title}</HoverCardContent>
                  </HoverCard>
               ) : (
                  <h6 className="text-sm md:text-base font-semibold text-secundary_blue-main truncate cursor-pointer">{title}</h6>
               )}
               <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-1">
                     <HandThumbsUpFill className="text-terciary-main lg:w-4 2xl:w-5" />
                     <p className="text-sm md:text-base text-neutral-gray">{likes}</p>
                  </div>
                  <span className="text-neutral-gray">•</span>
                  <div className="flex items-center gap-1">
                     <Eye className="text-terciary-main lg:w-4 2xl:w-5" />
                     <p className="text-sm md:text-base text-neutral-gray">{views}</p>
                  </div>
                  <span className="text-neutral-gray md:hidden lg:hidden xxl:hidden 2xl:block">•</span>
                  <p className="text-sm md:text-base text-neutral-gray truncate">{date}</p>
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}

export interface PublicationItemProps {
   id?: string
   date: string
   likes: string
   views: string
   title: string
   link: string
   image: string
   access_type?: string
   className?: string
   published?: boolean
}
