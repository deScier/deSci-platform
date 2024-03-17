import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { NextAuthOptions, getServerSession } from 'next-auth'

import { PublicJournalsProps } from '@/services/journal/getJournals.service'
import React from 'react'
import { SubmitNewPaper } from './submit-new-paper'

export default async function SubmitNewPaperPage() {
   const options = authOptions as NextAuthOptions
   const session = await getServerSession(options)

   const fetchPublicJournals = async () => {
      if (session?.user?.token) {
         const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', authorization: `Bearer ${session.user.token}` }
         })

         const response = (await request.json()) as PublicJournalsProps
         return response.journals
      }
   }

   const journals = await fetchPublicJournals()
   console.log('journal_server', journals)

   return (
      <React.Fragment>
         <SubmitNewPaper journals={journals} />
      </React.Fragment>
   )
}
