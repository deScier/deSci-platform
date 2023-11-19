'use client'

import { ArticleUnderReviewSkeleton } from '@/components/common/Publication/Item/ArticlesUnderReview'
import { ArticleCard } from '@/components/modules/Home/Index/ArticleCard/ArticleCard'
import { ArticleCardProps } from '@/components/modules/Home/Index/ArticleCard/Typing'
import { BannerStartPublishing } from '@/components/modules/Home/Index/BannerStartPublishing/BannerStartPublishing'
import useWindowDimension from '@/hooks/useWindowDimension'
import { home_routes } from '@/routes/home'
import { useArticles } from '@/services/document/fetchPublic.service'
import { ConfirmProfileRequestProps, confirmProfileService } from '@/services/user/confirmProfile.service'
import { formatAuthors } from '@/utils/format_authors'
import { capitalizeWord } from '@/utils/format_texts'
import { getArticleTypeLabel } from '@/utils/generate_labels'
import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'
import '@styles/home.css'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import IllustrationHero from 'public/svgs/modules/home/illustration-home.svg'
import ShapeMobile from 'public/svgs/modules/home/shape-mobile.svg'
import CirclesHero from 'public/svgs/modules/home/shapes/circles.svg'
import ShapeHero from 'public/svgs/modules/home/shapes/shape1.svg'
import ShapeSecondary from 'public/svgs/modules/home/shapes/shape2.svg'
import ShapeTertiary from 'public/svgs/modules/home/shapes/shape3.svg'
import React, { useEffect, useState } from 'react'
import { CaretRightFill, Eye, HandThumbsUpFill, Person, Search } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'

export default function HomePage() {
   const router = useRouter()
   const queryParams = useSearchParams()

   const { lg } = useWindowDimension()
   const { articles, loading } = useArticles()

   const [topPapers, setTopPapers] = useState<ArticleCardProps[]>([])
   const [isProfileConfirmed, setIsProfileConfirmed] = useState(false)

   const [searchTerm, setSearchTerm] = useState('')
   const [searchAuthor, setSearchAuthor] = useState('')

   const handleSearchArticle = () => {
      let searchQuery = '?'
      if (searchTerm && !searchAuthor) {
         searchQuery += `term=${searchTerm}`
      }

      if (searchAuthor && !searchTerm) {
         searchQuery += `author=${searchAuthor}`
      }

      if (searchAuthor && searchTerm) {
         searchQuery += `term=${searchTerm}&author=${searchAuthor}`
      }

      console.log(searchQuery)

      router.push(home_routes.home.search + searchQuery)
   }

   useEffect(() => {
      const encodedConfirmProfileData = queryParams.get('data')

      if (encodedConfirmProfileData) {
         const confirmProfile = async (confirmProfileData: ConfirmProfileRequestProps) => {
            if (!isProfileConfirmed) {
               const response = await confirmProfileService(confirmProfileData)
               if (response.success) {
                  toast.success(' Your registration is now confirmed')
                  setIsProfileConfirmed(true)
                  return
               }
            }
         }
         const decodedConfirmProfileData = JSON.parse(Buffer.from(encodedConfirmProfileData, 'base64').toString('ascii'))
         confirmProfile(decodedConfirmProfileData)
      }

      const encodedReviewerInviteData = queryParams.get('invite')
      if (encodedReviewerInviteData) {
         localStorage.setItem('invite', encodedReviewerInviteData)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
      if (articles) {
         const papers = articles.slice(0, 3).sort((a, b) => b.likes! - a.likes!)
         setTopPapers(papers)
      }
   }, [articles])

   return (
      <React.Fragment>
         {/* Ilustração */}
         <IllustrationHero className="hidden lg:block lg:w-[45%] xl:w-1/2 absolute right-0 md:top-48 lg:top-50 xl:top-60 h-full lg:max-w-[600px] xl:max-w-[708px] max-h-[554px]" />
         {/* Shape */}
         <ShapeHero className="hidden lg:block lg:w-3/4 xl:w-full absolute right-0 top-0 lg:-right-20 xl:-right-0 z-[-1] md:max-w-[600px] md:max-h-[700px] lg:max-w-[700px] lg:max-h-[800px] xl:max-w-[742px] xl:max-h-[872px]" />
         <div className="h-auto lg:pt-24 lg:h-[calc(100vh-14rem)]">
            <div className="grid gap-4 md:gap-6 content-start">
               <div className="grid gap-2 md:gap-4 mt-6 lg:mt-24">
                  <div className="grid gap-2">
                     <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-6xl font-bold lg:max-w-[20ch] bg-linear-gradient bg-clip-text text-transparent h-8 md:h-14 flex items-center">
                        The DeSci Journal
                     </h1>
                     <h3 className="text-1xl md:text-3xl lg:text-3xl xl:text-4xl font-bold bg-linear-gradient bg-clip-text text-transparent flex md:h-14 lg:h-auto">
                        Redefine how you publish
                     </h3>
                  </div>
                  <p className="text-sm md:text-base lg:text-lg lg:max-w-[50ch] 2xl:max-w-[60ch]">
                     Your scientific and technical documents are welcome here. Publish easily, economically, peer-reviewed papers while retaining 100% of
                     your copyright. deScier is dedicated to fostering a true community where belonging is not just an idea: it{"'"}s your experience with
                     us.
                  </p>
               </div>
               <div className="py-3 px-4 max-w-full lg:max-w-[50vw]  xl:max-w-[600px] 2xl:max-w-full bg-white grid sm:grid-flow-col sm:items-center gap-3 lg:gap-4 rounded-xl lg:rounded-full shadow-search lg:w-fit h-fit ">
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
                  <Button.Button
                     variant="outline"
                     className="rounded-full py-2 md:py-3 px-5 md:px-6 text-xs md:text-sm w-full"
                     onClick={handleSearchArticle}
                  >
                     Search
                     <Search className="w-4 md:w-5 h-4 md:h-5 ml-1" />
                  </Button.Button>
               </div>
            </div>
         </div>
         <div className="hidden md:block">
            <div className="blockchain-text-height"></div>
         </div>
         <div className="grid gap-52">
            <div className="relative w-full flex items-center justify-center lg:hidden">
               <IllustrationHero className="w-[90%] sm:w-3/4 h-auto mt-8 sm:mt-12 max-w-[372px] md:max-w-[454px] lg:hidden" />
               <ShapeMobile className="absolute z-[-1] w-[250vw] sm:w-[200vw] md:w-[164vw] lg:hidden" />
            </div>
            <div className="relative flex lg:justify-center md:mt-8 lg:mt-0">
               <CirclesHero className="absolute left-[-14rem] bottom-0 min-w-[200px] max-w-[200px]" />
               <h2 className="text-lg lg:text-1xl lg:max-w-[50ch] text-center w-full lg:my-auto lg:mx-0 lg:z-10 lg:mt-[-2.5rem]">
                  Leveraged by <span className="font-bold bg-purple bg-clip-text text-transparent">blockchain technology</span>, we build a worldwide
                  community where{' '}
                  <span className="font-bold bg-purple bg-clip-text text-transparent">
                     authors retain 100% ownership and copyright of their creations.
                  </span>
               </h2>
               <ShapeSecondary className="absolute max-w-[372px] z-0 left-[-13rem] top-72 lg:top-[4rem] lg:max-w-[472px] lg:max-h-[680px]" />
            </div>
            <div className="relative h-fit">
               <div className="border-neutral-stroke_light rounded-3xl shadow-search backdrop-blur-md bg-white-home px-8 py-6 grid gap-4 relative z-10">
                  <h3 className="text-1xl lg:text-3xl font-semibold bg-purple bg-clip-text text-transparent">Top papers of the week</h3>
                  <div className="w-full min-h-[600px] grid md:grid-cols-2 md:grid-rows-2 gap-6 z-0">
                     {topPapers[0] && (
                        <CardBig
                           key={topPapers[0].id}
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
                           key={topPapers[1].id}
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
                           key={topPapers[2].id}
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
            <div className="relative pt-8 sm:pt-12 md:pt-16 lg:pl-0 lg:pr-0 lg:-ml-52 lg:-mr-52">
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
                     <BannerStartPublishing />
                  </div>
               </div>
               <div className="articles-background" />
            </div>
         </div>
      </React.Fragment>
   )
}

interface TopPapersProps {
   likes: number
   views: number
   title: string
   image: string
   documentType: string
   authors: { id: string; name: string }[]
   publishedAt: Date
}

const CardBig: React.FC<TopPapersProps> = (data: TopPapersProps) => {
   return (
      <div className="p-4 sm:p-6 rounded-md min-h-[300px] h-full row-span-2 relative">
         <div className="relative flex justify-between z-10">
            <div className="bg-white px-3 py-1 text-primary-main rounded-md w-fit h-fit text-sm font-semibold">
               {data.publishedAt.toLocaleDateString('pt-BR')}{' '}
            </div>
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
               <div className="bg-white px-2 sm:px-3 py-1 text-secundary_blue-main rounded-b-md rounded-tr-md font-semibold max-w-[24ch] text-lg sm:text-3xl">
                  {data.title}
               </div>
            </div>
            <div className="bg-white w-fit px-2 sm:px-3 py-1 rounded-sm text-secundary_blue-main text-xs sm:text-base font-semibold">
               by {formatAuthors(data.authors)}
            </div>
         </div>
      </div>
   )
}

const CardSmall: React.FC<TopPapersProps> = (data: TopPapersProps) => {
   return (
      <div className="p-4 sm:p-6 rounded-md min-h-[300px] h-full relative">
         <div className="relative flex justify-between z-10">
            <div className="bg-white px-3 py-1 text-primary-main rounded-md w-fit h-fit text-sm font-semibold">
               {data.publishedAt.toLocaleDateString('pt-Br')}
            </div>
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
               <div className="bg-white px-2 sm:px-3 py-1 text-secundary_blue-main rounded-t-md w-fit text-sm font-semibold">
                  {getArticleTypeLabel(data.documentType.toLowerCase())}
               </div>
               <div className="bg-white px-2 sm:px-3 py-1 text-secundary_blue-main rounded-b-md rounded-tr-md font-semibold w-fit text-base sm:text-lg">
                  {data.title}
               </div>
            </div>
            <div className="bg-white w-fit px-2 sm:px-3 py-1 rounded-sm text-secundary_blue-main text-xs sm:text-base font-semibold">
               by {formatAuthors(data.authors)}
            </div>
         </div>
      </div>
   )
}
