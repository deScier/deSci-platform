import { HomeComponent } from '@/components/pages/Home/Home'
import { PublicJournalsProps } from '@/services/journal/getJournals.service'
import React from 'react'

export default async function HomePage() {
   const fetchPublicJournals = async () => {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' }
      })

      const response = (await request.json()) as PublicJournalsProps
      return response.journals
   }

   const journals = await fetchPublicJournals()
   console.log('journal_server', journals)
   return (
      <React.Suspense>
         <HomeComponent />
      </React.Suspense>
   )
}
