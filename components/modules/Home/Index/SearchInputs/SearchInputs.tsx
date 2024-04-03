'use client'

import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { home_routes } from '@/routes/home'
import { ConfirmProfileRequestProps, confirmProfileService } from '@/services/user/confirmProfile.service'
import '@styles/home.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'

import React from 'react'

type SearchInputsProps = {
   setIsProfileConfirmed: React.Dispatch<React.SetStateAction<boolean>>
   isProfileConfirmed: boolean
   setOpen: React.Dispatch<React.SetStateAction<boolean>>
   setInviteAuthorName: React.Dispatch<React.SetStateAction<string>>
   searchTerm: string
   setSearchTerm: React.Dispatch<React.SetStateAction<string>>
   searchAuthor: string
   setSearchAuthor: React.Dispatch<React.SetStateAction<string>>
   searchType: string
   setSearchType: React.Dispatch<React.SetStateAction<string>>
}

const SearchInputs: React.FC<SearchInputsProps> = ({
   isProfileConfirmed,
   setInviteAuthorName,
   setIsProfileConfirmed,
   setOpen,
   searchTerm,
   setSearchTerm,
   searchAuthor,
   setSearchAuthor,
   searchType,
   setSearchType
}: SearchInputsProps) => {
   const router = useRouter()
   const queryParams = useSearchParams()

   const handleSearchArticle = () => {
      let searchQuery = '?'
      if (searchTerm && !searchAuthor) {
         searchQuery += `term=${searchTerm}`
      }

      if (searchAuthor && !searchTerm) {
         searchQuery += `author=${searchAuthor}`
      }

      if (searchAuthor && searchTerm) {
         searchQuery += `term=${searchTerm}&author=${searchAuthor}`
      }

      if (searchType) {
         searchQuery += `&type=${searchType}`
      }

      router.push(home_routes.home.search + searchQuery)
   }

   React.useEffect(() => {
      const encodedConfirmProfileData = queryParams.get('data')

      if (encodedConfirmProfileData) {
         const confirmProfile = async (confirmProfileData: ConfirmProfileRequestProps) => {
            if (!isProfileConfirmed) {
               const response = await confirmProfileService(confirmProfileData)
               if (response.success) {
                  toast.success(' Your registration is now confirmed')
                  setIsProfileConfirmed(true)
                  return
               }
            }
         }
         const decodedConfirmProfileData = JSON.parse(Buffer.from(encodedConfirmProfileData, 'base64').toString('ascii'))
         confirmProfile(decodedConfirmProfileData)
      }

      const encodedReviewerInviteData = queryParams.get('invite')
      if (encodedReviewerInviteData) {
         localStorage.setItem('invite', encodedReviewerInviteData)
         const decodedInviteData = JSON.parse(Buffer.from(encodedReviewerInviteData, 'base64').toString('ascii'))
         setInviteAuthorName(decodedInviteData.user)
         setOpen(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className="py-3 px-4 max-w-full lg:max-w-[50vw]  xl:max-w-[600px] 2xl:max-w-full bg-white grid sm:grid-flow-col sm:items-center gap-3 lg:gap-4 rounded-xl lg:rounded-full shadow-search lg:w-fit h-fit ">
         <Input.Input
            className="rounded-full py-2 md:py-3 px-3 md:px-4 border-neutral-stroke_light bg-transparent shadow-none border focus:outline-none focus:border-neutral-stroke_light text-xs md:text-sm w-full"
            placeholder={`Find ${searchType === 'author' ? 'author' : searchType === 'journal' ? 'journal' : 'paper'} by term`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
               <React.Fragment>
                  <Search className="w-4 md:w-5 h-4 md:h-5 ml-1 text-neutral-light_gray" />
               </React.Fragment>
            }
         />
         <Select value={searchType} onValueChange={(value) => setSearchType(value)}>
            <SelectTrigger
               defaultValue={searchType}
               className="rounded-full py-2 md:py-3 px-3 md:px-4 border-neutral-stroke_light bg-transparent shadow-none border focus:border-neutral-stroke_light text-xs md:text-sm w-full h-[47px] min-w-[154px]"
               classNameSelectIcon="fill-neutral-light_gray w-4 h-4"
            >
               <SelectValue
                  placeholder={
                     <React.Fragment>
                        <p className="text-base text-neutral-light_gray">Search type</p>
                     </React.Fragment>
                  }
               />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="author">Author</SelectItem>
               <SelectItem value="journal">Journal</SelectItem>
               <SelectItem value="paper">Paper</SelectItem>
            </SelectContent>
         </Select>
         <Button.Button
            variant="outline"
            className="rounded-full py-2 md:py-3 px-5 md:px-6 text-xs md:text-sm w-full justify-center"
            onClick={handleSearchArticle}
         >
            <Search
               className="w-4 
           
           md:w-5 h-4 md:h-5"
            />
         </Button.Button>
      </div>
   )
}

export { SearchInputs }
