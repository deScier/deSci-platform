'use client'

import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'

import { Dropdown } from '@/components/common/Dropdown/Dropdown'
import PaginationComponent from '@/components/common/Pagination/Pagination'
import { ArticleUnderReviewSkeleton } from '@/components/common/Publication/Item/ArticlesUnderReview'
import { ReviewerItemProps } from '@/components/modules/AsReviewer/ReviewerItem/Typing'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useDebounce from '@/hooks/useDebounce'
import { reviewer_filter_status } from '@/mock/dropdow_filter_options'
import { useArticleToReview } from '@/services/reviewer/fetchDocuments.service'

import ReviewerItem from '@/components/modules/AsReviewer/ReviewerItem/ReviewerItem'
import { Separator } from '@/components/ui/separator'
import { articles_types_filter } from '@/mock/articles_types'
import React from 'react'

export default function AsReviewerPage() {
   const { articles, loading } = useArticleToReview()

   /** @dev Number of articles displayed per page. */
   const per_page = 8

   const [current, setCurrent] = React.useState<string>('under-review')

   /** @notice Current page number state.*/
   const [page, setPage] = React.useState(1)

   /** @notice State for the selected document type filter. */
   const [documentType, setDocumentType] = React.useState<string | null>('all')

   /** @notice State for the search term. */
   const [searchTerm, setSearchTerm] = React.useState('')

   /** @notice Debounces the search term. */
   const debouncedSearchTerm = useDebounce(searchTerm, 500)

   /** @notice State for the selected status filter. */
   const [status, setStatus] = React.useState<string | null>('')

   /** @notice Holds the list of filtered articles to be displayed. */
   const [results, setResults] = React.useState<ReviewerItemProps[]>([])

   /** @notice Holds the total number of pages based on the number of results and articles per page. */
   const [totalPages, setTotalPages] = React.useState(Math.ceil(results.length / per_page))
   React.useEffect(() => {
      setResults(articles || [])
   }, [articles])

   /**
    * @notice Filters articles based on selected document type, status, and title search.
    * @dev This effect listens for changes in the articles, documentType, status, and debouncedSearchTerm states
    * and updates the results with the filtered list of articles. It filters articles based on the following criteria:
    * - Document Type: If a document type is selected, only articles with a matching document type will be displayed.
    * - Status: If a status is selected, only articles with a matching status will be displayed.
    * - Title Search: If a search term is provided, only articles with titles containing the search term (case-insensitive) will be displayed.
    */
   React.useEffect(() => {
      if (!articles) return

      let filteredArticles = [...articles]

      if (documentType) {
         filteredArticles = filteredArticles.filter((article) => article.document_type?.toLowerCase() == documentType?.toLowerCase())
      }

      if (status) {
         filteredArticles = filteredArticles.filter((article) => article.status?.toLocaleLowerCase() == status?.toLowerCase())
      }

      if (debouncedSearchTerm) {
         filteredArticles = filteredArticles.filter((article) => article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      }

      setResults(filteredArticles)
   }, [articles, documentType, status, debouncedSearchTerm, current])

   const withoutFilters = documentType === 'all' && status === '' && debouncedSearchTerm === ''

   return (
      <React.Fragment>
         <Title.Root className="mb-0 md:mb-2 ">
            <Title.Title>As Reviewer/Editor</Title.Title>
         </Title.Root>
         <Tabs defaultValue="under-review">
            <div className="grid gap-6">
               <div className="grid gap-6">
                  <TabsList className="bg-transparent grid h-fit w-full items-start justify-normal">
                     <div className="grid sm:grid-flow-col gap-4 sm:gap-5 md:gap-6">
                        <TabsTrigger
                           className="bg-primary-main text-neutral-white py-2 px-8 text-sm md:text-lg font-semibold rounded-md border data-[state=inactive]:bg-transparent data-[state=inactive]:text-neutral-gray data-[state=inactive]:font-regular data-[state=active]:bg-primary-main data-[state=active]:text-white data-[state=inactive]:border-neutral-gray"
                           value="under-review"
                           onClick={() => {
                              setCurrent('under-review')
                           }}
                        >
                           Ongoing reviews
                        </TabsTrigger>
                        <TabsTrigger
                           className="bg-primary-main text-neutral-white py-2 px-8 text-sm md:text-lg font-semibold rounded-md border data-[state=inactive]:bg-transparent data-[state=inactive]:text-neutral-gray data-[state=inactive]:font-regular data-[state=active]:bg-primary-main data-[state=active]:text-white data-[state=inactive]:border-neutral-gray"
                           value="published"
                           onClick={() => {
                              setCurrent('published')
                           }}
                        >
                           Completed reviews
                        </TabsTrigger>
                     </div>
                  </TabsList>
                  <div className="flex items-center gap-2">
                     <Input.Search value={searchTerm} placeholder="Find articles with this terms" onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                     <Select value={documentType || undefined} onValueChange={(value) => setDocumentType(value)}>
                        <SelectTrigger className="flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold w-fit min-w-[229px]">
                           <SelectValue asChild>
                              <p>Article type: {articles_types_filter.find((item) => item.value === documentType)?.label || undefined}</p>
                           </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                           <React.Fragment>
                              {articles_types_filter.map((item, index) => (
                                 <React.Fragment key={item.id}>
                                    {item.type === 'label' && (
                                       <React.Fragment>
                                          {index !== 0 && <Separator />}
                                          <p className="px-8 py-1.5 pl-8 pr-2 text-sm font-semibold pt-2">{item.label}</p>
                                       </React.Fragment>
                                    )}
                                    {item.type === 'item' && (
                                       <SelectItem
                                          value={item.value as string}
                                          className="px-8 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                                          onMouseUp={() => setDocumentType(item.value)}
                                       >
                                          {item.label}
                                       </SelectItem>
                                    )}
                                 </React.Fragment>
                              ))}
                           </React.Fragment>
                        </SelectContent>
                     </Select>
                     {current !== 'published' && (
                        <React.Fragment>
                           <Dropdown
                              label="Status:"
                              selected={status || undefined}
                              className="min-w-[180px]"
                              items={reviewer_filter_status}
                              onSelect={(value) => setStatus(value)}
                           />
                           {withoutFilters ? null : (
                              <p
                                 className="text-base font-semibold text-terciary-main cursor-pointer hover:underline select-none"
                                 onClick={() => {
                                    setDocumentType(null)
                                    setStatus('pending')
                                    setSearchTerm('')
                                 }}
                              >
                                 Clear Filters
                              </p>
                           )}
                        </React.Fragment>
                     )}
                  </div>
               </div>
               {current === 'under-review' && (
                  <React.Fragment>
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
                                          <ReviewerItem {...article} link={`/as-reviewer/${article.id}`} />
                                       </React.Fragment>
                                    ))
                                 )}
                              </React.Fragment>
                           )}
                        </div>
                     </div>
                     <div className="flex justify-center">
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
                  </React.Fragment>
               )}
               {current === 'published' && (
                  <React.Fragment>
                     <div className="grid gap-8">
                        <div className="grid md:grid-cols-2 gap-4">
                           {loading ? (
                              <React.Fragment>
                                 <ArticleUnderReviewSkeleton />
                                 <ArticleUnderReviewSkeleton />
                                 <ArticleUnderReviewSkeleton />
                                 <ArticleUnderReviewSkeleton />
                              </React.Fragment>
                           ) : (
                              <React.Fragment>
                                 {articles?.length === 0 ? (
                                    <p className="text-center md:col-span-2 3xl:col-span-3 text-gray-500 my-8">
                                       There are no articles under review at the moment.
                                    </p>
                                 ) : (
                                    articles
                                       ?.slice((page - 1) * per_page, page * per_page)
                                       ?.filter((item) => item.published)
                                       .map((article) => (
                                          <React.Fragment key={article.id}>
                                             <ReviewerItem published {...article} link={`/as-reviewer/${article.id}`} />
                                          </React.Fragment>
                                       ))
                                 )}
                              </React.Fragment>
                           )}
                        </div>
                     </div>
                     <div className="flex justify-center">
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
                  </React.Fragment>
               )}
            </div>
         </Tabs>
      </React.Fragment>
   )
}
