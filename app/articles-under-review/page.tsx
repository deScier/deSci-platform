'use client'

import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'

import { ArticleUnderReview, ArticleUnderReviewProps, ArticleUnderReviewSkeleton } from '@/components/common/Publication/Item/ArticlesUnderReview'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { articles_types_filter } from '@/mock/articles_types'
import { filter_status } from '@/mock/dropdow_filter_options'
import { home_routes } from '@/routes/home'
import { AuthorsOnDocuments } from '@/services/document/getArticles'
import { useArticles } from '@/services/document/getArticles.service'
import { useSession } from 'next-auth/react'

import PaginationComponent from '@/components/common/Pagination/Pagination'
import useDebounce from '@/hooks/useDebounce'
import React from 'react'

export default function ArticlesUnderReviewPage() {
   /**
    * @notice Fetch the articles and their loading state.
    * @dev Using a custom hook "useArticles" to fetch articles.
    */
   const { data: session } = useSession()
   const { articles, loading } = useArticles()

   /** @dev Number of articles displayed per page. */
   const per_page = 8

   /** @notice Current page number state.*/
   const [page, setPage] = React.useState(1)

   /** @notice State for the selected document type filter. */
   const [documentType, setDocumentType] = React.useState<string | null>('all')

   /** @notice State for the search term. */
   const [searchTerm, setSearchTerm] = React.useState('')

   /** @notice Debounces the search term. */
   const debouncedSearchTerm = useDebounce(searchTerm, 500)

   /** @notice State for the selected status filter. */
   const [status, setStatus] = React.useState<string | null>('pending')

   /** @notice Holds the list of filtered articles to be displayed. */
   const [results, setResults] = React.useState<ArticleUnderReviewProps[]>([])

   /** @notice Holds the total number of pages based on the number of results and articles per page. */
   const [totalPages, setTotalPages] = React.useState(Math.ceil(results.length / per_page))

   const redirectToArticle = (authors: AuthorsOnDocuments[], mainAuthorId: string, articleId: string) => {
      const isCoAuthor = authors.some((item) => item.author?.userId === session?.user?.userInfo.id && item.author?.userId !== mainAuthorId)

      if (isCoAuthor) {
         return home_routes.articles.in_review + '/' + 'only-view' + '/' + articleId
      }

      return home_routes.articles.in_review + '/' + articleId
   }

   /**
    * @notice Updates the results state whenever articles data changes.
    * @dev This effect listens for changes in the articles data and updates the results accordingly.
    */
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
   }, [articles, documentType, status, debouncedSearchTerm])

   /**
    * @notice Recalculates the total number of pages whenever the list of results changes.
    * @dev This effect listens for changes in the results and per_page states and recalculates the total pages accordingly.
    */
   React.useEffect(() => {
      setTotalPages(Math.ceil(results.length / per_page))
   }, [results, per_page])

   const withoutFilters = documentType === 'all' && status === 'pending' && debouncedSearchTerm === ''

   return (
      <React.Fragment>
         <Title.Root>
            <Title.Title>My articles under review</Title.Title>
         </Title.Root>
         <div className="grid gap-6">
            <div className="grid gap-6">
               <div className="flex items-center gap-2">
                  <Input.Search value={searchTerm} placeholder="Find articles with these terms" onChange={(e) => setSearchTerm(e.target.value)} />
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
                  <Select value={status || undefined} onValueChange={(value) => setStatus(value)}>
                     <SelectTrigger className="flex items-center justify-center py-2 px-4 text-sm rounded-full border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200 bg-transparent font-semibold w-fit min-w-[229px]">
                        <SelectValue asChild>
                           <p>Status: {filter_status.find((item) => item.value === status)?.label || undefined}</p>
                        </SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                        {filter_status.map((item) => (
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
                           setDocumentType(null)
                           setStatus('pending')
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
                                    <ArticleUnderReview
                                       title={article.title}
                                       since={article.since}
                                       image={article.image}
                                       link={redirectToArticle(article.authors!, article.userId!, article.id!)}
                                       status_editor={article.status_editor as 'pending' | 'approved'}
                                       status_reviewer={article.status_reviewer as 'pending' | 'approved'}
                                       status_admin={article.status_admin as 'pending' | 'approved'}
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
      </React.Fragment>
   )
}
