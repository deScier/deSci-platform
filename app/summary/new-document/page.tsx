import { NewDocument } from '@/components/pages/NewDocument/NewDocument'
import { PublicJournalsProps } from '@/services/journal/getJournals.service'

import React from 'react'

export default async function SubmitNewPaperPage() {
   const fetchPublicJournals = async () => {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' },
         next: { revalidate: 60 }
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
