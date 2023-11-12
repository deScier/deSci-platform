'use client'

import { ArticleAcess } from '@/components/modules/Home/Search/ArticleAccess/ArticleAcess'
import { Checkout } from '@/components/modules/Home/Search/Purchase/Checkout'
import { PurchaseError } from '@/components/modules/Home/Search/Purchase/Error'
import { PurchaseProcessing } from '@/components/modules/Home/Search/Purchase/Processing'
import { PurchasedArticles } from '@/components/modules/Home/Search/Purchase/PurchasedArticles'
import { PurchaseSuccess } from '@/components/modules/Home/Search/Purchase/Success'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { addLikeService } from '@/services/document/addLike.service'
import { downloadDocument } from '@/services/document/download.service'
import { useArticles } from '@/services/document/fetchPublic.service'
import { AuthorsPublicInfo, GetDocumentPublicProps, ReviewersPublicInfo } from '@/services/document/getArticles'
import { createCheckoutService } from '@/services/payment/checkout.service'
import { capitalizeWord } from '@/utils/format_texts'
import * as Dialog from '@components/common/Dialog/Digalog'
import { uniqueId } from 'lodash'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LikedIcon from 'public/svgs/common/likes/Icons/liked.svg'
import UnlikedIcon from 'public/svgs/common/likes/Icons/unliked.svg'
import FacebookIcon from 'public/svgs/modules/home/article-details/facebook.svg'
import LinkIcon from 'public/svgs/modules/home/article-details/link.svg'
import TelegramIcon from 'public/svgs/modules/home/article-details/telegram.svg'
import TwitterIcon from 'public/svgs/modules/home/article-details/twitter.svg'
import WhatsAppIcon from 'public/svgs/modules/home/article-details/whatsapp.svg'
import React from 'react'
import { ArrowLeft, Eye, HandThumbsUp, HandThumbsUpFill } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

export default function Page({ params }: { params: { slug: string } }) {
   const router = useRouter()

   const { data: session } = useSession()

   const { fetch_article, loading } = useArticles()

   const [liked, setLiked] = React.useState(false)
   const [purchase, setPurchase] = React.useState({ checkout: false, processing: false, success: false, error: false, my_articles: false })
   const [article, setArticle] = React.useState<GetDocumentPublicProps>()
   const [authors, setAuthors] = React.useState<AuthorsPublicInfo[]>([])
   const [reviewers, setReviewers] = React.useState<ReviewersPublicInfo[]>([])
   const [accessType, setAccessType] = React.useState('PAID')
   const [likesAmount, setLikesAmount] = React.useState(0)
   const [viewsAmount, setViewsAmount] = React.useState(0)

   const fetchSingleArticle = async (documentId: string) => {
      await fetch_article(documentId).then((res) => {
         setArticle(res as GetDocumentPublicProps)
         setAuthors(res?.document?.authors || [])
         setReviewers(res?.document?.reviewers || [])
         setAccessType(res?.document?.accessType || 'PAID')
         setLikesAmount(res?.document.likes || 0)
         setViewsAmount(res?.document.views || 0)
         const isUserLikeThisDocument = res?.document.documentLikes.find((item) => item.userId === session?.user?.userInfo.id)
         if (isUserLikeThisDocument) {
            setLiked(true)
         }
      })
   }

   const handleAddLike = async () => {
      const response = await addLikeService(article?.document.id!)
      if (!response.success) {
         toast.error('Error in add like.')
         return
      }

      setLiked(true)
      setLikesAmount((state) => {
         return state + 1
      })
   }

   const handlePurchase = async () => {
      setPurchase({ ...purchase, checkout: false, processing: true })
      const response = await createCheckoutService(article?.document.id!)
      if (!response.success) {
         setPurchase({
            ...purchase,
            checkout: false,
            error: true,
            processing: false
         })
      }
      setPurchase({
         ...purchase,
         checkout: false,
         processing: false
      })

      window.open(response.checkoutUrl)
   }

   const handleDownloadDocument = async () => {
      const response = await downloadDocument(article?.document.id!)

      if (!response.success) {
         toast.error(response.message)
         return
      }

      const url = URL.createObjectURL(response.file!)
      const link = document.createElement('a')
      link.href = url
      link.download = article?.document.title.replace(' ', '_') + '.pdf'!
      link.click()
      URL.revokeObjectURL(url)

      toast.success('Download will start...')
   }

   const formatAccessType = () => {
      switch (accessType) {
         case 'PAID':
            return 'paid'
         case 'FREE':
            return 'open'
         case 'PURCHASED':
            return 'purchased'
         case 'OWNER':
            return 'author'
         default:
            return 'paid'
      }
   }

   React.useEffect(() => {
      if (!article) {
         fetchSingleArticle(params.slug)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <React.Fragment>
         <Dialog.Root open={purchase.checkout || purchase.processing || purchase.success || purchase.error || purchase.my_articles}>
            <Dialog.Overlay />
            <Dialog.Content
               className={twMerge(
                  'max-w-[1024px] w-full h-fit',
                  `${purchase.processing && 'max-w-[600px] md:px-16 md:py-14'}`,
                  `${purchase.success && 'max-w-[600px] md:px-16 md:py-14'}`,
                  `${purchase.error && 'max-w-[600px] md:px-16 md:py-14'}`,
                  `${purchase.my_articles && 'max-w-[80%]'}`
               )}
            >
               {purchase.checkout && (
                  <Checkout
                     article={{
                        image: article?.document.cover || 'https://source.unsplash.com/random/900×700/?technology',
                        date: new Date(article?.document.createdAt!).toLocaleDateString() || '',
                        id: article?.document.id || '',
                        price: article?.document.price || 0,
                        title: article?.document.title || ''
                     }}
                     onPurchase={() => {
                        handlePurchase()
                     }}
                     onClose={() => setPurchase({ ...purchase, checkout: false })}
                     onSetPaymentOption={(value) => {
                        console.log(value)
                     }}
                  />
               )}
               {purchase.success && (
                  <PurchaseSuccess
                     onClose={() => {
                        setPurchase({ ...purchase, success: false })
                     }}
                     onReturn={() => {
                        setPurchase({ ...purchase, success: false, error: true })
                     }}
                  />
               )}
               {purchase.error && (
                  <PurchaseError
                     onClose={() => {
                        setPurchase({ ...purchase, error: false })
                     }}
                  />
               )}
               {purchase.processing && <PurchaseProcessing />}
               {purchase.my_articles && (
                  <PurchasedArticles
                     onClose={() => {
                        setPurchase({ ...purchase, my_articles: false })
                     }}
                  />
               )}
            </Dialog.Content>
         </Dialog.Root>
         <div className="grid gap-8">
            <div className="flex items-center gap-4 pt-8 md:pt-12">
               <ArrowLeft size={32} className="hover:scale-110 transition-all cursor-pointer" onClick={() => router.back()} />
               <h1 className="text-1xl font-semibold">Return</h1>
            </div>
            <div className="bg-white rounded-xl h-fit p-6 flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                  <div className="hidden md:flex items-center gap-2">
                     <div className="border border-neutral-stroke_light rounded-md px-2 py-1 w-fit flex items-center flex-shrink gap-2">
                        <div className="w-3 h-3 bg-status-green rounded-full" />
                        <p className="text-sm select-none">{accessType === 'FREE' ? 'Open access' : 'Paid access'} </p>
                     </div>
                     <span className="text-black font-semibold">•</span>
                     <p className="text-lg font-semibold">{capitalizeWord(article?.document?.documentType || 'paper')} </p>
                     <span className="text-black font-semibold">•</span>
                     <p className="text-lg font-semibold text-primary-main">{article?.document?.field}</p>
                  </div>
                  <div className="flex flex-col md:hidden md:items-center gap-2">
                     <div className="border border-neutral-stroke_light rounded-md px-2 py-1 w-full flex items-center justify-center flex-shrink gap-2">
                        <div className="w-3 h-3 bg-status-green rounded-full" />
                        <p className="text-sm select-none">{accessType === 'FREE' ? 'Open access' : 'Paid access'}</p>
                     </div>
                     <HoverCard>
                        <div className="grid gap-0">
                           <HoverCardTrigger className="flex flex-col md:flex-row md:items-center gap-4 flex-1 min-w-0">
                              <p className="text-sm font-semibold text-primary-main max-w-full truncate">
                                 <span className="text-black">{capitalizeWord(article?.document.documentType || 'paper')} -</span>{' '}
                                 {article?.document?.field}
                              </p>
                           </HoverCardTrigger>
                        </div>
                        <HoverCardContent>
                           <p className="text-base text-start font-semibold text-primary-main w-full">
                              <span className="text-black">{capitalizeWord(article?.document?.documentType || 'paper')} -</span>{' '}
                              {article?.document?.field}
                           </p>
                        </HoverCardContent>
                     </HoverCard>
                     <hr className="divider-h w-full my-2" />
                  </div>

                  <h3 className="text-2xl md:text-3xl text-black font-bold">{article?.document?.title}</h3>
                  <div className="flex flex-wrap gap-2">
                     {article?.document?.keywords.split(';')?.map((tag) => (
                        <div className="border rounded-md border-neutral-stroke_light flex items-center px-2 py-[2px]" key={uniqueId('tag')}>
                           <span className="text-xs md:text-sm text-primary-main">{tag}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex items-center gap-1 flex-wrap">
                  {authors?.map((item, index) => (
                     <React.Fragment key={uniqueId('author')}>
                        <p className="text-sm text-[#5E6992]">
                           {item.name}
                           {index < authors.length - 1 && <span className="text-[#5E6992]">,</span>}
                        </p>
                     </React.Fragment>
                  ))}
               </div>
               <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                  <Image
                     fill
                     src={article?.document?.cover || 'https://source.unsplash.com/random/900×700/?technology'}
                     alt="article-image"
                     style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                     className="object-cover"
                  />
               </div>
            </div>
            <div className="flex items-start flex-col lg:flex-row-reverse gap-8 mb-10">
               <ArticleAcess
                  access_type={formatAccessType()}
                  date={new Date(article?.document?.createdAt!).toLocaleDateString('pt-BR')}
                  value={article?.document?.price || 0}
                  onBuyDocument={() => handlePurchase()}
                  onViewDocument={() => handleDownloadDocument()}
               />
               <div className="flex flex-col gap-6 bg-white rounded-xl h-fit w-full flex-grow p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                     <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-1">
                           {liked ? <HandThumbsUpFill className="text-terciary-main w-5 h-5" /> : <HandThumbsUp className="text-terciary-main w-5 h-5" />}

                           <p className="text-lg text-neutral-gray">{likesAmount} likes</p>
                        </div>
                        <div className="flex items-center gap-1">
                           <Eye className="text-terciary-main w-5 h-5" />
                           <p className="text-lg text-neutral-gray">{viewsAmount} views</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <p className="text-lg text-neutral-gray">Share</p>
                        <LinkIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                        <TwitterIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                        <FacebookIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                        <WhatsAppIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                        <TelegramIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                     </div>
                  </div>
                  <hr className="divider-h" />
                  <div>
                     <h6 className="text-base font-semibold">Authors</h6>
                     <div className="flex flex-col bg-[#F6F6FF] rounded-lg px-4">
                        {authors.map((author, index) => (
                           <React.Fragment key={uniqueId('document-author')}>
                              <div
                                 className={twMerge(
                                    'flex items-center py-3 gap-4',
                                    `${index != authors.length - 1 && 'border-b border-neutral-stroke_light'}`
                                 )}
                              >
                                 <p className="text-base font-regular text-[#5E6992] w-4">{index + 1}º</p>
                                 <div className="grid grid-cols-2 w-full">
                                    <p className="text-base font-regular text-secundary_blue-main">{author.name}</p>
                                    <p className="text-base font-regular text-secundary_blue-main">{author.title}</p>
                                 </div>
                              </div>
                           </React.Fragment>
                        ))}
                     </div>
                  </div>
                  <div className="flex gap-4 flex-col md:flex-row md:items-center">
                     <div className="flex flex-col flex-grow">
                        <p className="text-base font-semibold">Field</p>
                        <p className="text-base font-regular">{article?.document?.field}</p>
                     </div>
                     <div className="flex flex-col flex-grow">
                        <p className="text-base font-semibold">Document type</p>

                        <p className="text-base font-regular">{capitalizeWord(article?.document?.documentType || 'paper')}</p>
                     </div>
                  </div>
                  <div>
                     <p className="text-base font-semibold">Abstract</p>
                     <p className="text-base font-regular">{article?.document?.abstract}</p>
                  </div>
                  {/* <div className="flex flex-col gap-2">
                     <p className="text-base font-semibold">Visual abstract</p>
                    
                     <img loading="lazy" src={'/images/Frame 987.png'} alt="article-image" className="w-fit lg:h-72 object-contain" />
                  </div> */}
                  <div>
                     <p className="text-base font-semibold">Editors/reviewers</p>
                     <div>
                        {reviewers.map((item) => (
                           <div key={uniqueId('reviewer')} className="border-b border-neutral-stroke_light">
                              <div className="grid md:grid-cols-5 gap-4  items-center px-0 py-3 rounded-md">
                                 <div className="border border-neutral-stroke_light rounded px-2 w-full lg:w-28 flex items-center justify-center">
                                    <p
                                       className={twMerge(
                                          'text-base text-secundary_blue-main first-letter:uppercase font-semibold',
                                          `${item.role == 'reviewer' && 'text-[#B07F03]'}`,
                                          `${item.role == 'editor' && 'text-terciary-main'}`
                                       )}
                                    >
                                       {item.role}
                                    </p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div>
                                       <p className="text-base text-secundary_blue-main">{item.name}</p>
                                    </div>
                                 </div>
                                 <div>
                                    <p className="text-base text-secundary_blue-main">{item.title}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={handleAddLike}>
                     {liked ? <LikedIcon className="ml-1 w-6 h-6 cursor-pointer" /> : <UnlikedIcon className="ml-1 w-6 h-6 cursor-pointer" />}
                     <p className="text-lg cursor-pointer select-none">Like the article</p>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}

const tags = [
   { id: 1, name: 'Blockchain' },
   { id: 2, name: 'Technology' }
]

const authors = [
   { id: 1, name: 'Alice Thompson.' },
   { id: 2, name: 'Bob Richards.' }
]

const header_editor_reviewer = [
   {
      id: 1,
      label: 'Name',
      value: 'name'
   },
   {
      id: 2,
      label: 'Title',
      value: 'title'
   },
   {
      id: 3,
      label: 'E-mail',
      value: 'email'
   }
]
