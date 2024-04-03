import { NewDocument } from '@/components/pages/NewDocument/NewDocument'
import { PublicJournalsProps } from '@/services/journal/getJournals.service'
import { unstable_noStore } from 'next/cache'

import React from 'react'

export default async function SubmitNewPaperPage() {
   unstable_noStore()

   const fetchPublicJournals = async () => {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' },
         cache: 'no-store'
      })

      const response = (await request.json()) as PublicJournalsProps
      return response.journals
   }

   const journals = await fetchPublicJournals()

   return (
      <React.Fragment>
         <NewDocument journals={journals} />
      </React.Fragment>
   )
}
