import { getSession, useSession } from 'next-auth/react'
import useSWR from 'swr'
import { DocumentProps } from '../document/getArticles'
import { MembersRoles } from './submit.service'

export const useJournals = () => {
   const { data } = useSession()

   const fetchJournal = async (journalId: string) => {
      if (data?.user?.token) {
         const session = await getSession()

         if (session?.user?.token) {
            const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/${journalId}`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  authorization: `Bearer ${session.user.token}`
               }
            })

            const response: JournalProps = await request.json()

            return response
         }
      }
   }

   const fetchJournals = async () => {
      if (data?.user?.token) {
         const session = await getSession()

         if (session?.user?.token) {
            const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  authorization: `Bearer ${session.user.token}`
               }
            })

            const response = (await request.json()) as JournalResponse

            return response.journals
         }
      }
   }

   const { data: journals, isLoading: journal_loading } = useSWR('fetchJournals', () => fetchJournals())

   const fetchPublicJournals = async () => {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/public`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      })

      const response: JournalProps[] = await request.json()

      return response
   }

   const { data: public_journals, isLoading: publicJournalsLoading } = useSWR('publicJournals', fetchPublicJournals)

   return { journals, public_journals, journal_loading, fetchJournal }
}

export type JournalResponse = {
   journals: JournalProps[]
}

export type JournalProps = {
   id: string
   name: string
   field: string
   keywords: string
   rationale: string
   originatesFrom: string
   cover: string
   status: JournalStatus
   createdById: string
   createdBy?: UserProps
   journalMembers?: JournalMemberProps[]
   documents?: DocumentProps[]
   createdAt: Date
   updatedAt: Date
}

export type UserProps = {
   id: string
   name: string
   email: string
}

export type JournalMemberProps = {
   id: string
   name: string
   email: string
   role: MembersRoles
   userId: string | null
   journalId: string
   user?: UserProps
   createdAt: Date
   updatedAt: Date
}

export type JournalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
