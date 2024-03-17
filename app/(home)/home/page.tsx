import { HomeComponent } from '@/components/pages/Home/Home'
import { PublicJournalsProps } from '@/services/journal/getJournals.service'

export default async function HomePage() {
   const fetchPublicJournals = async () => {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' }
      })

      const response = (await request.json()) as PublicJournalsProps

      const first_five_journals = response.journals.slice(0, 5)

      const body = { journals: first_five_journals } as PublicJournalsProps

      return body
   }

   const journals = await fetchPublicJournals()

   return <HomeComponent journals={journals.journals} />
}
