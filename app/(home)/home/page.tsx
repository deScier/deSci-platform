import { HomeComponent } from '@/components/pages/Home/Home'
import { PublicJournalsProps } from '@/services/journal/getJournals.service'
import { unstable_noStore } from 'next/cache'

export default async function HomePage() {
   unstable_noStore()

   const fetchPublicJournals = async () => {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' },
         next: { revalidate: 60 }
      })

      const response = (await request.json()) as PublicJournalsProps

      const first_five_journals = response.journals.slice(0, 5)

      const body = { journals: first_five_journals } as PublicJournalsProps

      return body
   }

   const journals = await fetchPublicJournals()

   return <HomeComponent journals={journals.journals} />
}
