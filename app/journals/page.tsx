'use client'

import React from 'react'

import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'

import { Dropdown } from '@/components/common/Dropdown/Dropdown'
import { journal_originate_from, journal_status_option } from '@/mock/dropdow_filter_options'
import { useSession } from 'next-auth/react'

import PaginationComponent from '@/components/common/Pagination/Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import useDebounce from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { JournalProps, JournalStatus, useJournals } from '@/services/journal/getJournals.service'
import 'components/common/Publication/Item/Item.css'
import { format } from 'date-fns'
import { truncate } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'

export default function JournalsPage() {
   const { data: session } = useSession()
   const { journals, journal_loading } = useJournals()
   console.log('journals', journals)

   const per_page = 8
   const [page, setPage] = React.useState(1)

   const [searchTerm, setSearchTerm] = React.useState('')
   const debouncedSearchTerm = useDebounce(searchTerm, 500)

   const [status, setStatus] = React.useState<string | null>('')
   const [originatesFrom, setOriginatesFrom] = React.useState<string | null>('')
   const [results, setResults] = React.useState<JournalProps[]>([])
   const [totalPages, setTotalPages] = React.useState(Math.ceil(results.length / per_page))

   React.useEffect(() => {
      setResults(journals || [])
   }, [journals])

   React.useEffect(() => {
      if (!journals || !Array.isArray(journals)) return

      let filteredJournals = [...journals]

      if (status) {
         filteredJournals = filteredJournals.filter((journal) => journal.status?.toLowerCase() == status?.toLowerCase())
      }

      if (originatesFrom) {
         filteredJournals = filteredJournals.filter((journal) => journal.originatesFrom?.toLowerCase() == originatesFrom?.toLowerCase())
      }

      if (debouncedSearchTerm) {
         filteredJournals = filteredJournals.filter((journal) => journal.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      }

      setResults(filteredJournals)
   }, [journals, status, originatesFrom, debouncedSearchTerm])

   React.useEffect(() => {
      setTotalPages(Math.ceil(results.length / per_page))
   }, [results, per_page])

   const withoutFilters = status === '' && debouncedSearchTerm === ''

   return (
      <React.Suspense>
         <Title.Root>
            <Title.Title>My Journals under review</Title.Title>
         </Title.Root>
         <div className="min-h-screen space-y-6">
            <div className="grid gap-6">
               <div className="flex items-center gap-2">
                  <Input.Search value={searchTerm} placeholder="Find journal with these terms" onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
               <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <Dropdown
                     label="The journal originates from: "
                     selected={journal_originate_from.find((item) => item.value === originatesFrom)?.label || undefined}
                     className="min-w-[180px] w-full"
                     items={journal_originate_from}
                     onSelect={(value) => setOriginatesFrom(value)}
                  />
                  <Dropdown
                     label="Status:"
                     selected={journal_status_option.find((item) => item.value === status)?.label || undefined}
                     className="min-w-[180px] w-full"
                     items={journal_status_option}
                     onSelect={(value) => setStatus(value)}
                  />
                  {withoutFilters ? null : (
                     <p
                        className="text-base font-semibold text-terciary-main cursor-pointer hover:underline select-none"
                        onClick={() => {
                           setStatus('')
                           setSearchTerm('')
                        }}
                     >
                        Clear Filters
                     </p>
                  )}
               </div>
            </div>
            <div
               className={cn('flex flex-col gap-6', {
                  results: results.length > 1,
                  'min-h-[calc(50vh)]': results.length > 1
               })}
            >
               <div className="grid gap-8">
                  <div className="grid md:grid-cols-2 3xl:grid-cols-3 gap-4">
                     {journal_loading ? (
                        <React.Fragment>
                           <JournalUnderReviewSkeleton />
                           <JournalUnderReviewSkeleton />
                           <JournalUnderReviewSkeleton />
                           <JournalUnderReviewSkeleton />
                        </React.Fragment>
                     ) : (
                        <React.Fragment>
                           {results.length === 0 ? (
                              <p className="text-center md:col-span-2 3xl:col-span-3 text-gray-500 my-8">
                                 There are no journals under review at the moment.
                              </p>
                           ) : (
                              results.slice((page - 1) * per_page, page * per_page).map((journal) => (
                                 <React.Fragment key={journal.id}>
                                    <JournalUnderReview
                                       title={journal.name}
                                       since={journal.createdAt as unknown as string}
                                       image={journal.cover}
                                       link={`/journals/${journal.id}`}
                                       status={journal.status}
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
      </React.Suspense>
   )
}

const JournalUnderReview: React.FC<JournalUnderReviewProps> = ({ since, link, status, image, title }: JournalUnderReviewProps) => {
   return (
      <React.Fragment>
         <div className="grid md:grid-cols-max-min-auto md:justify-start items-center gap-4 bg-[#fff] py-3 px-4 rounded-lg">
            <div className="relative w-full md:w-20 h-20">
               <Image
                  fill
                  src={image || 'https://random.imagecdn.app/150/150'}
                  alt={title}
                  quality={50}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  className="rounded-md object-cover"
               />
            </div>
            <hr className="hidden md:block divider-v" />
            <hr className="block md:hidden divider-h" />
            <div className="grid gap-2 mt-[-8px]">
               <div>
                  <Link href={link}>
                     <h6 className="text-sm font-semibold text-secundary_blue-main lg:text-base cursor-pointer hover:text-primary-main hover:underline transition-all duration-200">
                        {truncate(title, { length: 40 })}
                     </h6>
                  </Link>
                  <div className="flex items-center gap-2">
                     {status === 'APPROVED' ? (
                        <React.Fragment>
                           <p className="text-sm text-neutral-gray lg:text-sm">Published in</p>
                           <p className="text-base font-semibold lg:text-sm 2xl:text-base">{format(new Date(since), 'dd/MM/yyyy')}</p>
                        </React.Fragment>
                     ) : (
                        <React.Fragment>
                           <div className="flex items-center flex-grow gap-2">
                              <p className="text-sm text-neutral-gray lg:text-sm truncate">Under review since</p>
                              <p className="text-base font-semibold lg:text-sm 2xl:text-base truncate">{since}</p>
                           </div>
                        </React.Fragment>
                     )}
                  </div>
               </div>
               <div className="border-[1px] rounded-md px-2 border-neutral-stroke_light md:w-fit">
                  <div className="grid grid-flow-col items-center justify-center md:justify-start">
                     <div className="grid grid-flow-col gap-2 md:gap-1 items-center">
                        {status === 'APPROVED' ? (
                           <p className="text-sm 2xl:text-base font-semibold text-status-green">Published</p>
                        ) : (
                           <p className="text-xs sm:text-base font-semibold text-status-pending truncate xl:text-sm flex-shrink-0">Pending</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}

interface JournalUnderReviewProps {
   id?: string
   status?: JournalStatus
   image: string
   since: string
   title: string
   link: string
}

const JournalUnderReviewSkeleton: React.FC = () => {
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
   )
}
