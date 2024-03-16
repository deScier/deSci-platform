import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { home_routes } from '@/routes/home'
import { JournalDetailsProps } from '@/services/journal/getJournals.service'
import { NextAuthOptions, Session, getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import JournalDetails from '@/components/pages/Journal/JournalDetails'
import React from 'react'

export default async function JournalDetailsPage({ params }: { params: { id: string } }) {
   const options = authOptions as NextAuthOptions
   const session = await getServerSession(options)

   const fetchJournal = async (journalId: string, data: Session | null) => {
      if (session?.user?.token) {
         const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/${journalId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', authorization: `Bearer ${session.user.token}` }
         })

         const response = (await request.json()) as JournalDetailsProps
         const journal = response.journal

         return journal
      }
   }

   const journal = await fetchJournal(params.id, session)

   if (!journal) redirect(home_routes.journals)

   return <React.Fragment>{journal && <JournalDetails params={{ journal: journal }} />}</React.Fragment>
}
