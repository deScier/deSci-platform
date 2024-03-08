'use client'
import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'

import { ArticleUnderReviewSkeleton } from '@/components/common/Publication/Item/ArticlesUnderReview'
import ForgotPasswordModal from '@/components/modules/ForgotPassword/ForgotPassword'
import { ArticleCard } from '@/components/modules/Home/Index/ArticleCard/ArticleCard'
import { ArticleCardProps } from '@/components/modules/Home/Index/ArticleCard/Typing'
import { BannerStartPublishing } from '@/components/modules/Home/Index/BannerStartPublishing/BannerStartPublishing'
import { home_routes } from '@/routes/home'
import { useArticles } from '@/services/document/fetchPublic.service'
import { ConfirmProfileRequestProps, confirmProfileService } from '@/services/user/confirmProfile.service'
import { formatAuthors } from '@/utils/format_authors'
import { capitalizeWord } from '@/utils/format_texts'
import { getArticleTypeLabel } from '@/utils/generate_labels'
import '@styles/home.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { CaretRightFill, Eye, HandThumbsUpFill, Person, Search } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

import LoginModal from '@/components/modules/Login/Login'
import RegisterModal from '@/components/modules/Register/Register'
import useWindowDimension from '@/hooks/useWindowDimension'
import Image from 'next/image'
import Link from 'next/link'
import IllustrationHero from 'public/svgs/modules/home/illustration-home.svg'
import ShapeMobile from 'public/svgs/modules/home/shape-mobile.svg'
import ShapeHero from 'public/svgs/modules/home/shapes/shape1.svg'
import ShapeTertiary from 'public/svgs/modules/home/shapes/shape3.svg'
import React, { useEffect, useState } from 'react'
import slug from 'slug'

export function HomeComponent() {
   const router = useRouter()
   const queryParams = useSearchParams()

   const { lg } = useWindowDimension()
   const { articles, loading } = useArticles()

   const [topPapers, setTopPapers] = useState<ArticleCardProps[]>([])
   const [isProfileConfirmed, setIsProfileConfirmed] = useState(false)

   const [searchTerm, setSearchTerm] = useState('')
   const [searchAuthor, setSearchAuthor] = useState('')

   const [inviteAuthorName, setInviteAuthorName] = useState('')

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
         const decodedInviteData = JSON.parse(Buffer.from(encodedReviewerInviteData, 'base64').toString('ascii'))
         setInviteAuthorName(decodedInviteData.user)
         setOpen(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
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
            <div className="h-auto lg:pt-24 lg:h-[calc(100vh-14rem)]">
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
         </div>
         <div className="hidden md:block">
            <div className="blockchain-text-height"></div>
         </div>
         <div className="grid gap-52">
            <div className="relative w-full flex items-center justify-center lg:hidden">
               <IllustrationHero className="w-[90%] sm:w-3/4 h-auto mt-8 sm:mt-12 max-w-[372px] md:max-w-[454px] lg:hidden" />
               <ShapeMobile className="absolute z-[-1] w-[250vw] sm:w-[200vw] md:w-[164vw] lg:hidden" />
            </div>
            <div className="space-y-6 overflow-hidden px-4 lg:px-0">
               <h3 className="text-1xl lg:px-20 2xl:px-52 lg:text-3xl font-semibold bg-purple bg-clip-text text-transparent">Our Journals</h3>
               <Journals />
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

interface TopPapersProps {
   id: string
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
               <Link href="/home/search/[slug]" as={`/home/search/${slug(data.id)}`}>
                  <div className="bg-white px-2 sm:px-3 py-1 text-secundary_blue-main rounded-b-md rounded-tr-md font-semibold max-w-[24ch] text-lg sm:text-3xl hover:underline">
                     {data.title}
                  </div>
               </Link>
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
               <Link href="/home/search/[slug]" as={`/home/search/${slug(data.id)}`}>
                  <div className="bg-white px-2 sm:px-3 py-1 text-secundary_blue-main rounded-b-md rounded-tr-md font-semibold w-fit text-base sm:text-lg hover:underline">
                     {data.title}
                  </div>
               </Link>
            </div>
            <div className="bg-white w-fit px-2 sm:px-3 py-1 rounded-sm text-secundary_blue-main text-xs sm:text-base font-semibold">
               by {formatAuthors(data.authors)}
            </div>
         </div>
      </div>
   )
}

import { EmblaEventType, EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { uniqueId } from 'lodash'

interface AutoScrollPlugin {
   play: () => void
   stop: () => void
   isPlaying: () => boolean
}

const Journals: React.FC = () => {
   const { windowDimension } = useDimension()
   const [hovered_curator_id, setHoveredCuratorId] = useState<string | null>(null)
   const [isPlaying, setIsPlaying] = useState(false)

   const OPTIONS: EmblaOptionsType = {
      loop: true,
      containScroll: 'trimSnaps'
   }

   const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
      AutoScroll({
         playOnInit: true,
         speed: 1.5,
         stopOnMouseEnter: true,
         startDelay: 200
      })
   ])

   useEffect(() => {
      if (windowDimension == null) return

      if (windowDimension < 1024 && hovered_curator_id == null) {
         setHoveredCuratorId(curators[0].id)
      }

      if (windowDimension > 1024 && hovered_curator_id !== null) {
         setHoveredCuratorId(null)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [windowDimension])

   useEffect(() => {
      if (!emblaApi) return

      const autoScroll = emblaApi?.plugins()?.autoScroll as unknown as AutoScrollPlugin

      if (!autoScroll) return

      const updateIsPlaying = () => setIsPlaying(autoScroll.isPlaying() as boolean)

      updateIsPlaying()

      emblaApi.on('autoScroll:play' as EmblaEventType, updateIsPlaying)
      emblaApi.on('autoScroll:stop' as EmblaEventType, updateIsPlaying)
      emblaApi.on('reInit' as EmblaEventType, updateIsPlaying)

      return () => {
         emblaApi.off('autoScroll:play' as EmblaEventType, updateIsPlaying)
         emblaApi.off('autoScroll:stop' as EmblaEventType, updateIsPlaying)
         emblaApi.off('reInit' as EmblaEventType, updateIsPlaying)
      }
   }, [emblaApi])

   useEffect(() => {
      const autoScroll = emblaApi?.plugins()?.autoScroll
      if (!autoScroll) return

      if (hovered_curator_id !== null) {
         ;(autoScroll.stop as () => void)()
      } else {
         ;(autoScroll.play as () => void)()
      }
   }, [emblaApi, hovered_curator_id])

   return (
      <React.Fragment>
         <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
               <div className="embla__container">
                  {curators.map((curator) => (
                     <div
                        key={curator.id}
                        className="embla__slide !relative flex h-[364px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6"
                        onClick={() => setHoveredCuratorId(curator.id)}
                        onMouseEnter={() => setHoveredCuratorId(curator.id)}
                        onMouseLeave={() => setHoveredCuratorId(null)}
                     >
                        <motion.h2
                           className="z-40 flex h-full items-end justify-start font-normal text-white text-xl"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: hovered_curator_id === curator.id ? 1 : 0 }}
                           transition={{ duration: 0.25 }}
                        >
                           {curator.name}
                        </motion.h2>
                        <div className="embla__slide__number">
                           <motion.div
                              className="absolute bottom-0 left-0 z-10 h-1/2 w-full rounded-[25px] bg-[linear-gradient(180deg,_rgba(112,_70,_140,_0.00)_1.65%,_#1E1326_101.65%)] max-w-[284px]"
                              initial={{ height: 0 }}
                              animate={{ height: hovered_curator_id === curator.id ? '50%' : 0 }}
                              transition={{ duration: 0.25 }}
                           />
                           <Image
                              quality={50}
                              width={400}
                              height={400}
                              alt={curator.name}
                              src={curator.image.src}
                              className="absolute left-0 top-0 z-0 object-cover object-center w-[284px] max-h-[424px] h-full rounded-3xl min-w-[284px]"
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}

import useDimension from '@/hooks/useWindowDimension'
import DeScierJournal from 'public/images/journals/descier-journal.png'
import LongBioJournal from 'public/images/journals/longbio.png'

const curators = [
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: LongBioJournal
   }
]
