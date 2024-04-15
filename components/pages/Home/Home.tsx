'use client'
import * as Dialog from '@components/common/Dialog/Digalog'

import { ArticleUnderReviewSkeleton } from '@/components/common/Publication/Item/ArticlesUnderReview'
import ForgotPasswordModal from '@/components/modules/ForgotPassword/ForgotPassword'
import { ArticleCard } from '@/components/modules/Home/Index/ArticleCard/ArticleCard'
import { ArticleCardProps } from '@/components/modules/Home/Index/ArticleCard/Typing'
import { BannerStartPublishing } from '@/components/modules/Home/Index/BannerStartPublishing/BannerStartPublishing'
import { SearchInputs } from '@/components/modules/Home/Index/SearchInputs/SearchInputs'
import { CardBig } from '@/components/modules/Home/Index/TopPapersOfTheWeek/CardBig/CardBig'
import { CardSmall } from '@/components/modules/Home/Index/TopPapersOfTheWeek/CardSmall/CardSmall'
import { home_routes } from '@/routes/home'
import { useArticles } from '@/services/document/fetchPublic.service'
import { PublicJournalsProps } from '@/services/journal/getJournals.service'
import { capitalizeWord } from '@/utils/format_texts'
import '@styles/home.css'
import { useRouter } from 'next/navigation'
import { CaretRightFill } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

import LoginModal from '@/components/modules/Login/Login'
import RegisterModal from '@/components/modules/Register/Register'
import useWindowDimension from '@/hooks/useWindowDimension'
import dynamic from 'next/dynamic'
import IllustrationHero from 'public/svgs/modules/home/illustration-home.svg'
import ShapeMobile from 'public/svgs/modules/home/shape-mobile.svg'
import ShapeHero from 'public/svgs/modules/home/shapes/shape1.svg'
import ShapeTertiary from 'public/svgs/modules/home/shapes/shape3.svg'
import React from 'react'

const OurJournalsDynamic = dynamic(() => import('@/components/modules/Home/Index/OurJournals/OurJournals').then((mod) => mod.OurJournals), {
   loading: () => (
      <div className="embla__container space-x-4 px-4 lg:px-0">
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 block md:hidden" />

         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden md:block lg:hidden" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden md:block lg:hidden" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden md:block lg:hidden" />

         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden lg:block" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden lg:block" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden lg:block" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden lg:block" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden lg:block" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden lg:block" />
         <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6 hidden lg:block" />
      </div>
   ),
   ssr: false
})

type HomeProps = { journals: PublicJournalsProps['journals'] | undefined }

export function HomeComponent({ journals }: HomeProps) {
   const router = useRouter()

   const { lg } = useWindowDimension()
   const { articles, loading } = useArticles()

   const [topPapers, setTopPapers] = React.useState<ArticleCardProps[]>([])
   const [isProfileConfirmed, setIsProfileConfirmed] = React.useState(false)

   const [searchTerm, setSearchTerm] = React.useState('')
   const [searchAuthor, setSearchAuthor] = React.useState('')
   const [searchType, setSearchType] = React.useState('paper')

   const [inviteAuthorName, setInviteAuthorName] = React.useState('')

   React.useEffect(() => {
      if (articles) {
         const papers = articles.slice(0, 3).sort((a, b) => b.likes! - a.likes!)
         setTopPapers(papers)
      }
   }, [articles])

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
            <Dialog.Overlay />
            <Dialog.Content className={twMerge('w-[80%] max-w-[1200px] p-0', component === forgot_password_component && 'max-w-[554px]')}>
               {component === login_component && (
                  <LoginModal
                     onClose={() => setOpen(false)}
                     onForgotPassword={() => setComponent(forgot_password_component)}
                     onLogin={() => setComponent(login_component)}
                     onRegister={() => setComponent(register_component)}
                     withLink={inviteAuthorName ? true : false}
                     authorName={inviteAuthorName}
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
         <IllustrationHero className="hidden lg:block lg:w-[45%] xl:w-1/2 absolute right-0 md:top-48 lg:top-50 xl:top-40 2xl:top-60 h-full lg:max-w-[600px] xl:max-w-[708px] max-h-[554px]" />
         <ShapeHero className="hidden lg:block lg:w-3/4 xl:w-full absolute right-0 top-0 lg:-right-20 xl:-right-0 z-[-1] md:max-w-[600px] md:max-h-[700px] lg:max-w-[700px] lg:max-h-[800px] 2xl:max-w-[700px] 2xl:max-h-[872px]" />
         <div className="lg:px-20 2xl:px-52 px-4 sm:px-6">
            <div className="h-auto lg:pt-24 lg:min-h-[calc(100vh-14rem)] hero-height">
               <div className="grid gap-4 md:gap-6 content-start">
                  <div className="grid gap-2 mt-6 lg:mt-24 xl:mt-16 2xl:mt-24">
                     <div className="grid gap-2">
                        <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-6xl font-bold lg:max-w-[20ch] bg-linear-gradient bg-clip-text text-transparent h-8 sm:h-14 flex items-center">
                           The DeSci Journals
                        </h1>
                        <h3 className="text-1xl md:text-3xl lg:text-3xl xl:text-4xl font-bold bg-linear-gradient bg-clip-text text-transparent flex md:h-14 lg:h-auto">
                           Redefine how you publish
                        </h3>
                     </div>
                     <p className="text-sm md:text-base lg:text-lg lg:max-w-[50ch] 2xl:max-w-[60ch]">
                        Your scientific and technical documents are welcome here. Publish easily, economically, peer-reviewed papers while retaining 100%
                        of your copyright. deScier is dedicated to fostering a true community where belonging is not just an idea: it{"'"}s your
                        experience with us.
                     </p>
                  </div>
                  <React.Suspense>
                     <SearchInputs
                        setIsProfileConfirmed={setIsProfileConfirmed}
                        isProfileConfirmed={isProfileConfirmed}
                        setOpen={setOpen}
                        setInviteAuthorName={setInviteAuthorName}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchAuthor={searchAuthor}
                        setSearchAuthor={setSearchAuthor}
                        searchType={searchType}
                        setSearchType={setSearchType}
                     />
                  </React.Suspense>
               </div>
            </div>
         </div>
         <div className="hidden md:block">
            <div className="blockchain-text-height"></div>
         </div>
         <div className="grid gap-24">
            <div className="relative w-full flex items-center justify-center lg:hidden">
               <IllustrationHero className="w-[90%] sm:w-3/4 h-auto mt-8 sm:mt-12 max-w-[372px] md:max-w-[454px] lg:hidden" />
               <ShapeMobile className="absolute z-[-1] w-[250vw] sm:w-[200vw] md:w-[164vw] lg:hidden" />
            </div>
            <div className="space-y-6 lg:px-20 2xl:px-52">
               <h3 className="text-1xl px-4 lg:px-0 lg:text-3xl font-semibold bg-purple bg-clip-text text-transparent">Our Journals</h3>
               <OurJournalsDynamic journals={journals} />
            </div>
            <div className="lg:px-20 2xl:px-52 px-4 sm:px-6">
               <div className="relative h-fit">
                  <div className="border-neutral-stroke_light rounded-3xl shadow-search backdrop-blur-md bg-white-home px-8 py-6 grid gap-4 relative z-10">
                     <h3 className="text-1xl lg:text-3xl font-semibold bg-purple bg-clip-text text-transparent">Top papers of the week</h3>
                     <div className="w-full min-h-[600px] grid md:grid-cols-2 md:grid-rows-2 gap-6 z-0">
                        {topPapers[0] && (
                           <CardBig
                              id={topPapers[0].id}
                              key={topPapers[0].id}
                              journal={topPapers[0].journal}
                              title={topPapers[0].title}
                              documentType={capitalizeWord(topPapers[0].documentType!)}
                              authors={topPapers[0].authors}
                              likes={topPapers[0].likes || 0}
                              views={topPapers[0].views || 0}
                              publishedAt={topPapers[0].publishedAt!}
                              image={topPapers[0].image}
                           />
                        )}
                        {topPapers[1] && (
                           <CardSmall
                              id={topPapers[1].id}
                              key={topPapers[1].id}
                              journal={topPapers[1].journal}
                              title={topPapers[1].title}
                              documentType={capitalizeWord(topPapers[1].documentType!)}
                              authors={topPapers[1].authors}
                              likes={topPapers[1].likes || 0}
                              views={topPapers[1].views || 0}
                              publishedAt={topPapers[1].publishedAt!}
                              image={topPapers[1].image}
                           />
                        )}
                        {topPapers[2] && (
                           <CardSmall
                              id={topPapers[2].id}
                              key={topPapers[2].id}
                              journal={topPapers[2].journal}
                              title={topPapers[2].title}
                              documentType={capitalizeWord(topPapers[2].documentType!)}
                              authors={topPapers[2].authors}
                              likes={topPapers[2].likes || 0}
                              views={topPapers[2].views || 0}
                              publishedAt={topPapers[2].publishedAt!}
                              image={topPapers[2].image}
                           />
                        )}
                     </div>
                  </div>
                  <ShapeTertiary className="absolute right-[-13rem] z-0 bottom-[-18rem] max-w-[400px] max-h-[700px]" />
               </div>
            </div>
            <div className="relative pt-8 sm:pt-12 md:pt-16 lg:pl-0 lg:pr-0 lg:-ml-52 lg:-mr-52 lg:px-20 2xl:px-52 px-4 sm:px-6">
               <div className="relative z-20">
                  <div className="px-1 lg:px-72 grid gap-4 sm:gap-6 lg:gap-8">
                     <div className="grid gap-4 sm:gap-6 lg:gap-10">
                        <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-x-6 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                           <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold col-span-full">Latest papers</h3>
                           {loading ? (
                              <React.Fragment>
                                 <ArticleUnderReviewSkeleton />
                                 <ArticleUnderReviewSkeleton />
                                 <ArticleUnderReviewSkeleton />
                                 <ArticleUnderReviewSkeleton />
                              </React.Fragment>
                           ) : (
                              <React.Fragment>
                                 {!articles || articles.length === 0 ? (
                                    <p className="text-center col-span-full text-gray-500 mt-8">There are no articles under review at the moment.</p>
                                 ) : (
                                    articles.slice(0, lg ? 8 : 3).map((article, index) => (
                                       <React.Fragment key={article.id}>
                                          <div className="grid gap-4 sm:gap-6 lg:grid-flow-col">
                                             <ArticleCard
                                                with_dot={false}
                                                id={article.id!}
                                                authors={article.authors}
                                                image={article.image}
                                                likes={article.likes || 0}
                                                tags={article.tags}
                                                title={article.title!}
                                                journal={article.journal}
                                                views={article.views || 0}
                                                documentType={article.documentType}
                                             />
                                             {lg && index !== 3 && index !== 7 && <hr className="divider-article-v" />}
                                          </div>
                                          {lg && index === 3 && <hr className="divider-article-h" />}
                                       </React.Fragment>
                                    ))
                                 )}
                              </React.Fragment>
                           )}
                           <div className="flex items-center justify-start lg:justify-end gap-3 sm:gap-4 lg:gap-4 col-span-full">
                              <h3
                                 className="text-sm sm:text-base lg:text-lg font-semibold text-primary-main select-none cursor-pointer hover:underline transition-all duration-200"
                                 onMouseEnter={() => router.prefetch(home_routes.home.search)}
                                 onClick={() => router.push(home_routes.home.search)}
                              >
                                 View all papers
                              </h3>
                              <CaretRightFill className="w-4 sm:w-5 h-4 sm:h-5 text-primary-main" />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="mt-12 sm:mt-16 lg:mt-24 px-2 sm:px-12 md:px-24 lg:px-56 mb-12 sm:mb-16 lg:mb-24">
                     <BannerStartPublishing
                        onPublishNow={() => {
                           setOpen(true)
                           setComponent(login_component)
                        }}
                     />
                  </div>
               </div>
               <div className="articles-background" />
            </div>
         </div>
      </React.Fragment>
   )
}
