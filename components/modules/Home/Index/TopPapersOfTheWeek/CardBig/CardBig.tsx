import { formatAuthors } from '@/utils/format_authors'
import { getArticleTypeLabel } from '@/utils/generate_labels'
import { Eye, HandThumbsUpFill } from 'react-bootstrap-icons'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import slug from 'slug'

const CardBig: React.FC<TopPapersProps> = (data: TopPapersProps) => {
   return (
      <div className="p-4 sm:p-6 rounded-md min-h-[300px] h-full row-span-2 relative">
         <div className="relative flex justify-between z-10">
            <div className="bg-white px-3 py-1 rounded-md w-fit h-fit text-sm font-semibold">{data.publishedAt.toLocaleDateString('pt-BR')} </div>
            <div className="bg-white px-3 py-1 text-primary-main rounded-md w-fit h-fit text-sm font-semibold flex gap-4 items-center">
               <div className="flex items-center gap-1">
                  <HandThumbsUpFill className="text-terciary-main w-4 h-4" />
                  <p className="text-neutral-gray font-regular">{data.likes}</p>
               </div>
               <div className="flex items-center gap-1">
                  <Eye className="text-terciary-main w-4 h-4" />
                  <p className="text-neutral-gray font-regular">{data.views}</p>
               </div>
            </div>
         </div>
         <Image fill className="absolute inset-0 object-cover w-full rounded-md" src={data.image} alt="placeholder" />
         <div className="absolute flex flex-col z-10 bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 gap-2 sm:gap-4">
            <div>
               <div className="bg-white px-2 sm:px-3 py-1 text-secundary_blue-main rounded-t-md w-fit text-xs sm:text-sm font-semibold">
                  • {getArticleTypeLabel(data.documentType.toLowerCase())}
               </div>
               <Link href="/home/search/[slug]" as={`/home/search/${slug(data.id)}`}>
                  <div className="bg-white px-2 sm:px-3 py-1 text-secundary_blue-main rounded-b-md rounded-tr-md font-semibold max-w-[24ch] text-lg sm:text-3xl hover:underline">
                     {data.title}
                  </div>
               </Link>
            </div>
            <p className="bg-white px-3 py-1 rounded-md w-fit h-fit text-sm font-semibold">{data.journal?.name}</p>
            <div className="bg-white w-fit px-2 sm:px-3 py-1 rounded-sm text-secundary_blue-main text-xs sm:text-base font-semibold">
               by {formatAuthors(data.authors)}
            </div>
         </div>
      </div>
   )
}

interface TopPapersProps {
   id: string
   likes: number
   views: number
   title: string
   image: string
   documentType: string
   authors: { id: string; name: string }[]
   journal: { id: string; name: string }
   publishedAt: Date
}

export { CardBig }
