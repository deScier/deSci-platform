import './Item.css'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

import useDimension from '@/hooks/useWindowDimension'
import Image from 'next/image'
import React from 'react'

export const InReviewItem: React.FC<InReviewItemProps> = ({
   date,
   link,
   ready_to_publish,
   status_editor,
   status_reviewer,
   image,
   title
}: InReviewItemProps) => {
   const { windowDimension } = useDimension()
   const isSmallDesktop = windowDimension && windowDimension < 1440 && windowDimension >= 1024
   return (
      <React.Fragment>
         <div className="grid md:grid-cols-max-auto md:justify-start items-center gap-4">
            <Image
               quality={50}
               src={image}
               width={420}
               height={80}
               alt={title}
               style={{ objectFit: 'cover' }}
               className="rounded-md w-full h-20 lg:w-20 xxl:w-16 xxl:h-16 2xl:w-20 2xl:h-20 object-cover"
            />
            <div className="grid gap-1 2xl:gap-2">
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
               <div className="flex flex-col gap-1 xxl:flex-row xxl:items-center md:justify-start">
                  <div className="flex flex-grow justify-center gap-1 items-center border p-1 rounded-md w-full md:border-none md:p-0 md:justify-start md:w-fit md:flex-grow-0">
                     {ready_to_publish ? (
                        <p className="text-xs sm:text-base font-semibold text-status-green truncate xl:text-sm flex-shrink-0">Ready to publish</p>
                     ) : (
                        <>
                           {status_editor == 'approved' && (
                              <p className="text-xs sm:text-base font-semibold text-status-green truncate xl:text-sm flex-shrink-0">Approved by editor</p>
                           )}
                           {status_editor == 'pending' && (
                              <p className="text-xs sm:text-base font-semibold text-status-pending truncate xl:text-sm flex-shrink-0">Editor pending</p>
                           )}
                           <span className="text-xs sm:text-sm font-semibold text-neutral-light_gray truncate xl:text-sm flex-shrink-0">/</span>
                           {status_reviewer == 'approved' && (
                              <p className="text-xs sm:text-base font-semibold text-status-green truncate xl:text-sm flex-shrink-0">Reviewer approval</p>
                           )}
                           {status_reviewer == 'pending' && (
                              <p className="text-xs sm:text-base font-semibold text-status-pending truncate xl:text-sm flex-shrink-0 lg:max-w-[10ch] 2xl:max-w-full">
                                 Reviewer pending
                              </p>
                           )}
                        </>
                     )}
                  </div>
                  <span className="hidden xxl:block text-neutral-light_gray">•</span>
                  <p className="text-xs sm:text-sm md:hidden text-center text-neutral-gray">Under review since {date}</p>
                  <p className="hidden md:block text-sm sm:text-base text-neutral-gray">{date}</p>
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}

export interface InReviewItemProps {
   id?: string
   status_editor?: 'pending' | 'approved'
   status_reviewer?: 'pending' | 'approved'
   ready_to_publish?: boolean
   image: string
   date: string
   title: string
   link: string
}
