'use client'

import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import useDebounce from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { journal_originate_from, journal_status_option } from '@/mock/dropdow_filter_options'
import { JournalProps, JournalStatus, useJournals } from '@/services/journal/getJournals.service'
import 'components/common/Publication/Item/Item.css'
import { format, isValid, parseISO } from 'date-fns'
import { truncate } from 'lodash'

import PaginationComponent from '@/components/common/Pagination/Pagination'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function JournalsPage() {
   const { journals, journal_loading } = useJournals()

   const per_page = 8
   const [page, setPage] = React.useState(1)

   const [searchTerm, setSearchTerm] = React.useState('')
   const debouncedSearchTerm = useDebounce(searchTerm, 500)

   const [status, setStatus] = React.useState<string | null>('ALL')
   const [originatesFrom, setOriginatesFrom] = React.useState<string | null>('')
   const [results, setResults] = React.useState<JournalProps[]>([])
   const [totalPages, setTotalPages] = React.useState(Math.ceil(results.length / per_page))

   React.useEffect(() => {
      setResults(journals || [])
   }, [journals])

   React.useEffect(() => {
      if (!journals || !Array.isArray(journals)) return

      let filteredJournals = [...journals]

      if (status && status !== 'ALL') {
         filteredJournals = filteredJournals.filter((journal) => journal.status?.toLowerCase() === status.toLowerCase())
      }

      if (originatesFrom) {
         filteredJournals = filteredJournals.filter((journal) => journal.originatesFrom?.toLowerCase() === originatesFrom.toLowerCase())
      }

      if (debouncedSearchTerm) {
         filteredJournals = filteredJournals.filter((journal) => journal.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      }

      setResults(filteredJournals)
   }, [journals, status, originatesFrom, debouncedSearchTerm])

   React.useEffect(() => {
      setTotalPages(Math.ceil(results.length / per_page))
   }, [results, per_page])

   const withoutFilters = status === 'ALL' && debouncedSearchTerm === '' && originatesFrom === ''

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
               <div className="flex flex-wrap md:flex-row md:items-center gap-2">
                  <Select value={originatesFrom || 'all'} onValueChange={(value) => setOriginatesFrom(value)}>
                     <SelectTrigger className="w-full sm:w-fit flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold min-w-[229px]">
                        <SelectValue asChild>
                           <p>
                              The journal originates from: {journal_originate_from.find((item) => item.value === originatesFrom)?.label || 'All journals'}
                           </p>
                        </SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                        <React.Fragment>
                           {journal_originate_from.map((item, index) => (
                              <React.Fragment key={item.id}>
                                 <SelectItem
                                    value={item.value || 'all'}
                                    className="px-8 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                                    onMouseUp={() => setOriginatesFrom(item.value)}
                                 >
                                    {item.label}
                                 </SelectItem>
                              </React.Fragment>
                           ))}
                        </React.Fragment>
                     </SelectContent>
                  </Select>
                  <Select value={status || 'all'} onValueChange={(value) => setStatus(value)}>
                     <SelectTrigger className="w-full sm:w-fit flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold min-w-[229px]">
                        <SelectValue asChild>
                           <p>Status: {journal_status_option.find((item) => item.value === status)?.label || 'All'}</p>
                        </SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                        {journal_status_option.map((item) => (
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
                           setStatus('ALL')
                           setSearchTerm('')
                           setOriginatesFrom('')
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
   const date = parseISO(since)
   const formated_since = isValid(date) ? format(date, 'dd/MM/yyyy') : 'Invalid date'

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
                     {status === 'APPROVED' ? (
                        <React.Fragment>
                           <p className="text-sm text-neutral-gray lg:text-sm">Published in</p>
                           <p className="text-base font-semibold lg:text-sm 2xl:text-base">{formated_since}</p>
                        </React.Fragment>
                     ) : status === 'REJECTED' ? (
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
                        {status === 'APPROVED' ? (
                           <p className="text-sm 2xl:text-base font-semibold text-status-green">Approved</p>
                        ) : status === 'REJECTED' ? (
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
