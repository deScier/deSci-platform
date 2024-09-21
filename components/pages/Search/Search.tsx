'use client'

import '@styles/home.css'

import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'

import { Dropdown } from '@/components/common/Dropdown/Dropdown'
import { BannerStartPublishing } from '@/components/modules/Home/Index/BannerStartPublishing/BannerStartPublishing'
import { ArticleItem } from '@/components/modules/Home/Search/ArticleItem/ArticleItem'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { filter_access, filter_by_year, filter_field } from '@/mock/dropdow_filter_options'
import { useArticles } from '@/services/document/fetchPublic.service'
import { slugfy } from '@/utils/slugfy'
import { useSearchParams } from 'next/navigation'
import { Person, Search } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

import PaginationComponent from '@/components/common/Pagination/Pagination'
import ForgotPasswordModal from '@/components/modules/ForgotPassword/ForgotPassword'
import LoginModal from '@/components/modules/Login/Login'
import RegisterModal from '@/components/modules/Register/Register'
import { Separator } from '@/components/ui/separator'
import useDebounce from '@/hooks/useDebounce'
import { articles_types_filter } from '@/mock/articles_types'
import React from 'react'

export function SearchArticlesComponent() {
   const { articles } = useArticles()

   const searchQueries = useSearchParams()

   const per_page = 10
   const [page, setPage] = React.useState(1)
   const [results, setResults] = React.useState(articles)
   const [totalPages, setTotalPages] = React.useState(1)
   const [searchTerm, setSearchTerm] = React.useState('')
   const [searchAuthor, setSearchAuthor] = React.useState('')
   const [searchType, setSearchType] = React.useState('')
   const [accessType, setAccessType] = React.useState('')
   const [documentType, setDocumentType] = React.useState<string | null>('all')
   const [publicationYear, setPublicationYear] = React.useState<number | null>(null)
   const [field, setField] = React.useState<string | null>(null)
   const debouncedSearchTerm = useDebounce(searchTerm, 500)
   const debouncedSearchAuthor = useDebounce(searchAuthor, 500)

   React.useEffect(() => {
      if (articles) {
         setResults(articles)
         setTotalPages(Math.ceil(articles.length / per_page))
      }
   }, [articles])

   React.useEffect(() => {
      if (searchQueries) {
         const term = searchQueries.get('term') || ''
         const author = searchQueries.get('author') || ''
         const type = searchQueries.get('type') || ''

         if (type === 'author') {
            setSearchTerm('')
            setSearchAuthor(term)
         } else {
            setSearchTerm(term)
            setSearchAuthor(author)
         }

         setSearchType(type)
      }
   }, [searchQueries])

   const clearFilters = () => {
      setPage(1)
      setResults(articles)
      setTotalPages(1)
      setSearchTerm('')
      setSearchAuthor('')
      setAccessType('')
      setDocumentType(null)
      setPublicationYear(null)
      setField(null)
   }

   const withoutFilters = documentType === 'all' && !searchTerm && !searchAuthor && !accessType && !publicationYear && !field

   /** @dev Component states for various authentication and navigation modals */
   const login_component = 'login'
   const register_component = 'register'
   const forgot_password_component = 'forgot_password'

   /** @dev State to manage the open/closed state of modals */
   const [open, setOpen] = React.useState(false)

   /** @dev State to manage which component is currently active in the modal */
   const [component, setComponent] = React.useState(login_component)

   return (
      <React.Fragment>
         <Dialog.Root open={open}>
            <Dialog.Content className={twMerge('w-[80%] max-w-[1200px] p-0', component === forgot_password_component && 'max-w-[554px]')}>
               {component === login_component && (
                  <LoginModal
                     onClose={() => setOpen(false)}
                     onForgotPassword={() => setComponent(forgot_password_component)}
                     //  onLogin={() => setComponent(login_component)}
                     onRegister={() => setComponent(register_component)}
                  />
               )}
               {component === register_component && (
                  <RegisterModal
                     onBack={() => setComponent(login_component)}
                     onClose={() => {
                        setOpen(false)
                        setComponent(login_component)
                     }}
                     onLogin={() => setComponent(login_component)}
                     onRegister={() => setComponent(register_component)}
                     onReturnToLogin={() => setComponent(login_component)}
                  />
               )}
               {component === forgot_password_component && (
                  <ForgotPasswordModal onBack={() => setComponent(login_component)} onClose={() => setComponent(login_component)} />
               )}
            </Dialog.Content>
         </Dialog.Root>
         <div className="flex flex-col gap-6 lg:px-20 2xl:px-52 px-4 sm:px-6">
            <Title.Root className="mt-8 mb-0 lg:mt-14 md:mb-0">
               <Title.Title className="text-3xl mb-0">Search</Title.Title>
            </Title.Root>
            <div className="flex flex-col md:flex-row w-full gap-6">
               <div className="w-full flex-grow">
                  <Input.Input
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="rounded-full py-3 px-4 border-neutral-stroke_light bg-transparent shadow-none border focus:outline-none focus:border-neutral-stroke_light text-sm bg-white"
                     placeholder="Find articles with terms"
                     icon={
                        <React.Fragment>
                           <Search className="w-5 h-5 ml-1 text-neutral-light_gray" />
                        </React.Fragment>
                     }
                  />
               </div>
               <div className="w-full flex-grow">
                  <Input.Input
                     value={searchAuthor}
                     onChange={(e) => setSearchAuthor(e.target.value)}
                     className="rounded-full py-3 px-4 border-neutral-stroke_light bg-transparent shadow-none border focus:outline-none focus:border-neutral-stroke_light text-sm bg-white w-full flex-grow"
                     placeholder="Search for an author"
                     icon={
                        <React.Fragment>
                           <Person className="w-5 h-5 ml-1 text-neutral-light_gray" />
                        </React.Fragment>
                     }
                  />
               </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
               <Dropdown
                  no_selected
                  items={filter_by_year}
                  label="Year of publication:"
                  className="w-full md:w-fit "
                  selected={publicationYear ? String(publicationYear) : undefined}
                  onSelect={(value) => setPublicationYear(Number(value))}
               />
               <Dropdown
                  no_selected
                  label="Field:"
                  selected={field || undefined}
                  className="w-full md:w-fit px-8"
                  items={filter_field}
                  onSelect={(value) => setField(value)}
               />
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
               <Dropdown
                  no_selected
                  selected={accessType}
                  label="Access:"
                  className="w-fit px-8"
                  items={filter_access}
                  onSelect={(value) => setAccessType(value)}
               />
               {withoutFilters ? null : (
                  <p className="text-base font-semibold text-terciary-main cursor-pointer hover:underline select-none" onClick={clearFilters}>
                     Clear Filters
                  </p>
               )}
            </div>
            <div className="flex flex-col gap-6 mt-6">
               <div className="grid md:grid-cols-2 gap-6 md:gap-4">
                  {results
                     ?.filter((article) => {
                        if (!searchType) return true
                        switch (searchType) {
                           case 'author':
                              return article.authors.some((author) => slugfy(author.name).includes(slugfy(searchTerm)))
                           case 'journal':
                              return slugfy(article.journal?.name || '').includes(slugfy(searchTerm))
                           case 'paper':
                              return slugfy(article.title).includes(slugfy(searchTerm))
                           default:
                              return true
                        }
                     })
                     .filter((article) => slugfy(article.title).includes(slugfy(searchTerm)) || slugfy(article.journal.name).includes(slugfy(searchTerm)))
                     .filter((article) => !documentType || article.documentType === documentType)
                     .filter((article) => !accessType || article.accessType === accessType)
                     .filter((article) => !field || article.field === field)
                     .filter((article) => !publicationYear || article.publishedAt?.getFullYear() === publicationYear)
                     .slice((page - 1) * per_page, page * per_page)
                     .map((article) => (
                        <React.Fragment key={article.id}>
                           <ArticleItem
                              title={article.title}
                              access_type={article.accessType!}
                              authors={article.authors}
                              id={article.id}
                              image={article.image}
                              likes={article.likes || 0}
                              published_date={article.publishedAt!.toLocaleDateString('pt-BR')}
                              journal={article.journal}
                              tags={article.tags || []}
                              views={article.views || 0}
                              document_type={article.documentType}
                           />
                        </React.Fragment>
                     ))}
               </div>
               {results
                  ?.filter((article) => {
                     if (!searchType) return true
                     switch (searchType) {
                        case 'author':
                           return article.authors.some((author) => slugfy(author.name).includes(slugfy(searchTerm)))
                        case 'journal':
                           return slugfy(article.journal?.name || '').includes(slugfy(searchTerm))
                        case 'paper':
                           return slugfy(article.title).includes(slugfy(searchTerm))
                        default:
                           return true
                     }
                  })
                  .filter((article) => slugfy(article.title).includes(slugfy(searchTerm)) || slugfy(article.journal.name).includes(slugfy(searchTerm)))
                  .filter((article) => !documentType || article.documentType === documentType)
                  .filter((article) => !accessType || article.accessType === accessType)
                  .filter((article) => !field || article.field === field)
                  .filter((article) => !publicationYear || article.publishedAt?.getFullYear() === publicationYear).length === 0 && (
                  <div className="text-center min-h-[40vh] flex items-center justify-center">
                     <p>No articles found.</p>
                  </div>
               )}

               <div className="flex justify-center">
                  <PaginationComponent
                     key={totalPages}
                     current={page}
                     perPage={per_page}
                     total={results?.length || 1}
                     handleFirstPage={() => setPage(1)}
                     handleNextPage={() => setPage(page + 1)}
                     handlePreviousPage={() => setPage(page - 1)}
                     handleLastPage={() => setPage(totalPages)}
                  />
               </div>
            </div>
            <div className="mt-24 mb-32">
               <BannerStartPublishing
                  onPublishNow={() => {
                     setOpen(true)
                     setComponent(login_component)
                  }}
               />
            </div>
         </div>
      </React.Fragment>
   )
}
