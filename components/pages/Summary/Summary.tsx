'use client'

import * as Dialog from '@components/common/Dialog/Digalog'
import * as Title from '@components/common/Title/Page'

import { PurchaseSuccess } from '@/components/modules/Home/Search/Purchase/Success'
import { home_routes } from '@/routes/home'
import { useStatistics } from '@/services/document/getStatistics.service'
import '@styles/summary.css'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

import Box from '@/components/common/Box/Box'
import WithLink from '@/components/modules/Login/Modals/WithLink/WithLink'
import Publications from '@/components/modules/Summary/Publications/Publications'
import Statistics from '@/components/modules/Summary/Statistics/Statistics'
import Submission from '@/components/modules/Summary/Submission/Submission'
import TopPapers from '@/components/modules/Summary/TopPapers/TopPapers'
import React from 'react'

export function SummaryComponent() {
   const router = useRouter()
   const queryParams = useSearchParams()

   const { statistics } = useStatistics()

   const [open, setOpen] = React.useState(false)
   const [paymentSuccess, setPaymentSuccess] = React.useState(false)
   const [documentId, setDocumentId] = React.useState('')
   const [inviteData, setInviteData] = React.useState({
      article: '',
      author: '',
      inviteCode: ''
   })

   React.useEffect(() => {
      const encodedInviteData = queryParams.get('invite') || localStorage.getItem('invite')

      if (encodedInviteData) {
         const decodedInviteData = JSON.parse(Buffer.from(encodedInviteData, 'base64').toString('ascii'))
         setInviteData({
            article: decodedInviteData.documentTitle,
            author: decodedInviteData.user,
            inviteCode: decodedInviteData.inviteCode
         })
         setOpen(true)
      }

      const encodedPaymentData = queryParams.get('payment')
      if (encodedPaymentData) {
         const decodedPaymentData = Buffer.from(encodedPaymentData, 'base64').toString('ascii')
         setDocumentId(decodedPaymentData)
         setPaymentSuccess(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const { data: session } = useSession()
   console.log('session', session)

   return (
      <React.Fragment>
         <Dialog.Root open={open || paymentSuccess}>
            <Dialog.Content className="max-w-[750px]">
               {open && (
                  <WithLink
                     onClose={() => setOpen(false)}
                     article_name={inviteData.article}
                     invited_by={inviteData.author}
                     inviteCode={inviteData.inviteCode}
                  />
               )}
               {paymentSuccess && (
                  <PurchaseSuccess
                     onClose={() => {
                        setPaymentSuccess(false)
                     }}
                     onReturn={() => {
                        router.push(home_routes.home.search + `/${documentId}`)
                     }}
                  />
               )}
            </Dialog.Content>
         </Dialog.Root>
         <div>
            <Title.Root>
               <Title.Title>My performance</Title.Title>
            </Title.Root>
            <div className="grid gap-8">
               <Box className="flex flex-col w-full lg:flex-row gap-5 items-center px-4 py-6 md:py-6 md:px-8">
                  <div className="w-full md:w-fit flex-shrink-0">
                     <Submission
                        pendingAmount={statistics?.totalUnderReviewDocuments || 0}
                        publishedAmount={statistics?.totalSubmittedDocuments || 0}
                        totalDocuments={statistics?.totalDocuments || 0}
                     />
                  </div>
                  <div className="divider-v" />
                  <div className="w-full md:flex-grow md:self-start">
                     <Publications pendingDocuments={statistics?.pendingDocuments || []} publishedDocuments={statistics?.publishedDocuments || []} />
                  </div>
               </Box>
               <div className="grid lg:grid-cols-2 gap-8">
                  <Box className="h-full px-4 py-6 md:py-6 md:px-8">
                     <h3 className="text-xl font-[500] lg:text-lg 2xl:text-xl">Statistics</h3>
                     <Statistics
                        totalArticlesPublished={statistics?.totalSubmittedDocuments || 0}
                        totalLikes={statistics?.totalLikesOnDocuments || 0}
                        totalViews={statistics?.totalViewsOnDocuments || 0}
                     />
                  </Box>
                  <Box className="h-fit w-full px-4 py-6 md:py-6 md:px-8">
                     <TopPapers publishedDocuments={statistics?.publishedDocuments || []} />
                  </Box>
                  {/* <Box className="h-fit px-4 py-6 md:py-6 md:px-8">
                     <h3 className="text-xl font-[500] lg:text-lg 2xl:text-xl">Earnings</h3>
                     <Earnings />
                  </Box> */}
               </div>
               {/* <Box className="h-fit w-full px-4 py-6 md:py-6 md:px-8">
                  <TopPapers />
               </Box> */}
            </div>
         </div>
      </React.Fragment>
   )
}
