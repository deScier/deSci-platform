import Spinner from '@/components/common/Loading/Spinner'
import PaginationComponent from '@/components/common/Pagination/Pagination'
import useDebounce from '@/hooks/useDebounce'
import useDimension from '@/hooks/useWindowDimension'
import { useFetchPurchasedArticles } from '@/services/document/fetchPurchased.service'
import * as Input from '@components/common/Input/Input'
import '@styles/home.css'
import React from 'react'
import { Person, Search, X } from 'react-bootstrap-icons'
import { ArticleCardProps } from '../../Index/ArticleCard/Typing'
import { ArticleCheckout } from './ArticleCheckout'

/**
 * @title PurchasedArticles Component
 * @notice This component displays a list of purchased articles with search and pagination functionalities.
 */
export const PurchasedArticles: React.FC<PurchasedArticlesProps> = ({ onClose }: PurchasedArticlesProps) => {
   /** @dev Hook to handle responsive design based on screen size */
   const { lg } = useDimension()

   /** @dev Hook to fetch purchased articles and their loading state */
   const { articles, loading } = useFetchPurchasedArticles()

   /** @dev Determines number of articles per page based on screen size */
   const per_page = lg == true ? 8 : 6

   /** @dev State to manage current page in pagination */
   const [page, setPage] = React.useState(1)

   /** @dev State to store filtered results for display */
   const [results, setResults] = React.useState<ArticleCardProps[]>([])

   /** @dev State to manage total number of pages for pagination */
   const [totalPages, setTotalPages] = React.useState(1)

   /** @dev State for handling search term for articles */
   const [searchTerm, setSearchTerm] = React.useState('')

   /** @dev State for handling search by author name */
   const [searchAuthor, setSearchAuthor] = React.useState('')

   /** @dev Use debounce hook for delayed search to improve performance */
   const debouncedSearchTerm = useDebounce(searchTerm, 500)
   const debouncedSearchAuthor = useDebounce(searchAuthor, 500)

   /**
    * @dev Effect to update results and pagination details when articles data or per_page changes
    */
   React.useEffect(() => {
      if (articles) {
         setResults(articles || [])
         setTotalPages(Math.ceil(articles.length / per_page))
      }
   }, [articles, per_page])

   return (
      <React.Fragment>
         <X
            className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
            onClick={onClose}
         />
         <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
               <h3 className="text-xl font-semibold">Purchased articles</h3>
               <div className="max-w-full bg-white grid sm:grid-flow-col sm:items-center gap-3 lg:gap-4 rounded-xl lg:rounded-full h-fit ">
                  <Input.Input
                     className="rounded-full py-2 md:py-3 px-3 md:px-4 border-neutral-stroke_light bg-transparent shadow-none border focus:outline-none focus:border-neutral-stroke_light text-xs md:text-sm w-full"
                     placeholder="Find articles with terms"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     icon={
                        <React.Fragment>
                           <Search className="w-4 md:w-5 h-4 md:h-5 ml-1 text-neutral-light_gray" />
                        </React.Fragment>
                     }
                  />
                  <Input.Input
                     className="rounded-full py-2 md:py-3 px-3 md:px-4 border-neutral-stroke_light bg-transparent shadow-none border focus:outline-none focus:border-neutral-stroke_light text-xs md:text-sm w-full"
                     placeholder="Search for an author"
                     value={searchAuthor}
                     onChange={(e) => setSearchAuthor(e.target.value)}
                     icon={
                        <React.Fragment>
                           <Person className="w-4 md:w-5 h-4 md:h-5 ml-1 text-neutral-light_gray" />
                        </React.Fragment>
                     }
                  />
               </div>
            </div>
            {loading ? (
               <div className="flex flex-col justify-center items-center min-h-[200px]">
                  <Spinner />
                  <p className="text-neutral-gray">Loading your library...</p>
               </div>
            ) : (
               <div className="grid gap-4 sm:gap-6 lg:gap-10 min-h-[200px]">
                  {results.length === 0 ? (
                     <div className="flex flex-col justify-center items-center min-h-[200px]">
                        <p className="text-neutral-gray">No articles found.</p>
                     </div>
                  ) : (
                     <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-x-6 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {results
                           .filter((article) => article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
                           .filter((article) => article.authors.some((author) => author.name.toLowerCase().includes(debouncedSearchAuthor.toLowerCase())))
                           .slice((page - 1) * per_page, page * per_page)
                           .map((article, index) => (
                              <React.Fragment key={article.id}>
                                 <div className="grid gap-4 sm:gap-6 lg:grid-flow-col">
                                    <ArticleCheckout
                                       responsive
                                       id={article.id}
                                       authors={article.authors}
                                       image={article.image}
                                       title={article.title}
                                       journal={article.journal}
                                    />
                                    {index !== 3 && index !== 7 && <div className="h-full w-[1px] bg-neutral-stroke_light md:hidden" />}
                                 </div>
                              </React.Fragment>
                           ))}
                     </div>
                  )}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-4 col-span-full">
                     <PaginationComponent
                        key={totalPages}
                        current={page}
                        perPage={per_page}
                        total={totalPages}
                        handleFirstPage={() => setPage(1)}
                        handleNextPage={() => setPage(page + 1)}
                        handlePreviousPage={() => setPage(page - 1)}
                        handleLastPage={() => setPage(totalPages)}
                     />
                  </div>
               </div>
            )}
         </div>
      </React.Fragment>
   )
}

interface PurchasedArticlesProps {
   onClose: () => void
}

const CardArticlePurchased: React.FC = () => {
   return <React.Fragment></React.Fragment>
}
