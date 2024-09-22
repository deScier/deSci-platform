'use client'

import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'

import { ArticleUnderReview, ArticleUnderReviewProps, ArticleUnderReviewSkeleton } from '@/components/common/Publication/Item/ArticlesUnderReview'
import { home_routes } from '@/routes/home'
import { useFetchAdminArticles } from '@/services/admin/fetchDocuments.service'

import PaginationComponent from '@/components/common/Pagination/Pagination'
import useDebounce from '@/hooks/useDebounce'
import React from 'react'
import slug from 'slug'

export default function ArticlesForApprovalPage() {
   const { articles, loading } = useFetchAdminArticles()

   /** @notice State for the search term. */
   const [searchTerm, setSearchTerm] = React.useState('')

   /** @notice Debounces the search term. */
   const debouncedSearchTerm = useDebounce(searchTerm, 500)

   const per_page = 8
   const [page, setPage] = React.useState(1)
   const [results, setResults] = React.useState<ArticleUnderReviewProps[]>([])
   const [totalPages, setTotalPages] = React.useState(Math.ceil(results.length / per_page))

   React.useEffect(() => {
      if (articles) {
         const filteredArticles = articles.filter((article) => article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
         setResults(filteredArticles)
         setTotalPages(Math.ceil(filteredArticles.length / per_page))
      }
   }, [articles, debouncedSearchTerm, per_page])

   return (
      <React.Fragment>
         <Title.Root>
            <Title.Title>Articles for approval</Title.Title>
         </Title.Root>
         <div className="grid gap-6">
            <div className="grid gap-6">
               <div className="flex items-center gap-2">
                  <Input.Search placeholder="Find articles with these terms" onInput={(e) => setSearchTerm(e.currentTarget.value)} />
               </div>
            </div>
            <div className="grid gap-8">
               <div className="grid md:grid-cols-2 3xl:grid-cols-3 gap-4">
                  {loading ? (
                     <React.Fragment>
                        <ArticleUnderReviewSkeleton />
                        <ArticleUnderReviewSkeleton />
                        <ArticleUnderReviewSkeleton />
                        <ArticleUnderReviewSkeleton />
                     </React.Fragment>
                  ) : results.length > 0 ? (
                     <React.Fragment>
                        {results.slice((page - 1) * per_page, page * per_page).map((article) => (
                           <React.Fragment key={article.id}>
                              <ArticleUnderReview
                                 title={article.title}
                                 since={article.since}
                                 image={article.image}
                                 link={home_routes.descier.articles_for_approval + '/' + slug(article.id!)}
                                 status_editor={article.status_editor as 'pending' | 'approved'}
                                 status_reviewer={article.status_reviewer as 'pending' | 'approved'}
                                 status_admin={article.status_admin as 'pending' | 'approved'}
                              />
                           </React.Fragment>
                        ))}
                     </React.Fragment>
                  ) : (
                     <div className="flex justify-center items-center col-span-full">
                        <p className="text-center md:col-span-2 3xl:col-span-3 text-gray-500 my-8">No articles found matching your search criteria.</p>
                     </div>
                  )}
               </div>
            </div>
            <div className="flex justify-center">
               <PaginationComponent
                  key={totalPages}
                  current={page}
                  perPage={per_page}
                  total={results.length || 1}
                  handleFirstPage={() => setPage(1)}
                  handleNextPage={() => setPage(page + 1)}
                  handlePreviousPage={() => setPage(page - 1)}
                  handleLastPage={() => setPage(totalPages)}
               />
            </div>
         </div>
      </React.Fragment>
   )
}
