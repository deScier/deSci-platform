'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { home_routes } from '@/routes/home'
import { useArticles } from '@/services/document/getArticles.service'
import { connectWeb3AuthWallet, initWeb3Auth } from '@/services/web3auth/web3auth.service'
import * as Button from '@components/common/Button/Button'
import { SafeEventEmitterProvider } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import ShapeDeScierHandBookBottom from 'public/svgs/modules/sidebar/Ellipse 46.svg'
import ShapeDeScierHandBookTop from 'public/svgs/modules/sidebar/Ellipse 48.svg'
import IllustrationHandBook from 'public/svgs/modules/sidebar/emojione-v1_document.svg'
import React, { useEffect, useState } from 'react'
import { CaretRight, PlusCircle, X } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'
import SubmitedItem from './SubmitedItem/SubmitedItem'
import { ProfileProps } from './Typing'

/**
 * @title Profile Component
 * @notice This component renders the user's profile page, allowing them to view their profile details, connect a wallet, and access their submitted articles.
 * @dev This component uses the `useSession` and `useArticles` hooks for session management and fetching articles, respectively. It also manages states for the Web3Auth, provider, and wallet connection.
 */
const Profile: React.FC<ProfileProps> = ({ className, onClose }: ProfileProps) => {
   /** @dev Initialize session hook for user data */
   const { data: session, update: updateSession } = useSession()

   /** @dev Initialize hook to fetch articles */
   const { articles } = useArticles()

   /** @dev States for Web3 authentication, provider, and wallet connection */
   const [web3auth, setWeb3Auth] = useState<Web3Auth | null>(null)
   const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)
   const [connectLoading, setConnectLoading] = useState<boolean>(false)
   const [walletAddress, setWalletAddress] = useState<string | undefined>(session?.user?.userInfo.walletAddress || '')

   /**
    * @dev Handles wallet connection logic
    * @notice Connects the user's wallet and updates the session with the new wallet address
    */
   const handleConnectWallet = async () => {
      setConnectLoading(true)
      /** @dev Connects to Web3Auth wallet and manages the provider */
      const response = await connectWeb3AuthWallet({
         provider,
         setProvider,
         web3auth
      })

      setConnectLoading(false)

      /** @dev Shows error message on connection failure */
      if (!response?.success) {
         toast.error('Error in connect wallet!')
         return
      }

      /** @dev Updates the session with the new wallet address */
      const udpatedInfo = {
         ...session,
         user: {
            ...session?.user,
            userInfo: {
               ...session?.user?.userInfo,
               walletAddress: response.walletAddress
            }
         }
      }

      /** @dev Calls the session update function */
      await updateSession(udpatedInfo)

      /** @dev Sets the new wallet address in state */
      setWalletAddress(response.walletAddress)

      /** @dev Notification of successful wallet connection */
      toast.success('Wallet connected successfully.')
   }

   /**
    * @dev Initializes Web3 authentication on component mount
    * @notice Sets up provider and Web3Auth instances
    */
   useEffect(() => {
      initWeb3Auth({
         setProvider,
         setWeb3Auth
      })
   }, [])

   /**
    * @dev Updates wallet address in state when session user data changes
    */
   useEffect(() => {
      if (session?.user) {
         setWalletAddress(session?.user?.userInfo.walletAddress || '')
      }
   }, [session?.user])

   return (
      <React.Fragment>
         <aside className={twMerge('hidden md:relative md:block overflow-hidden', className)}>
            <div className="flex flex-col gap-8 sticky xxl:min-h-full 2xl:h-screen 2xl:min-h-screen right-0 md:py-14 md:px-6 justify-between bg-[#FEFEFE]">
               <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-semibold">My profile</h3>
                     <X
                        className="w-10 h-10 mb-2 cursor-pointer hover:text-status-error transition-all duration-500 ease-out md:hover:scale-110 md:hover:rotate-180 transform md:hidden"
                        onClick={onClose}
                     />
                     <Link
                        href={home_routes.profile}
                        className="hidden md:block text-base text-secundary_purple-main font-regular hover:underline select-none cursor-pointer"
                     >
                        Edit profile
                     </Link>
                  </div>
                  <div className="grid gap-4">
                     <Image
                        src={session?.user?.userInfo.avatar || '/images/profile_dk08wk.png'}
                        quality={50}
                        width={144}
                        height={144}
                        alt="profile-image"
                        className="w-24 h-24 md:w-36 md:h-36 bg-status-pending rounded-full mx-auto my-0 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
                     />
                     <div className="grid gap-2 lg:gap-3 2xl:gap-2">
                        <h1 className="text-xl text-secundary_blue-main font-semibold flex justify-center lg:text-lg 2xl:text-xl">
                           {session?.user?.userInfo.name}
                        </h1>

                        {!walletAddress ? (
                           <Button.Button
                              variant={web3auth ? 'outline' : 'disabled'}
                              className="mx-auto px-2 py-3 my-0 text-sm"
                              onClick={handleConnectWallet}
                           >
                              Connect a wallet
                              <PlusCircle className="w-4" />
                           </Button.Button>
                        ) : (
                           <div className="mx-auto px-2 py-3 my-0 text-sm w-52 overflow-hidden truncate ...">{walletAddress}</div>
                        )}
                     </div>
                  </div>
                  <div className="relative rounded-lg w-full p-4 h-20 gradient-grad-dark overflow-hidden">
                     <ShapeDeScierHandBookTop className="absolute top-[-0.5rem] left-0" />
                     <div className="flex gap-2 w-full p-3 items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <IllustrationHandBook />
                        <div className="grid items-center">
                           <Link href={'https://descier-1.gitbook.io/the-desci-journal-handbook/'} target="_blank" rel="noreferrer">
                              <p className="text-sm font-semibold text-[#F4F4F4] cursor-pointer hover:underline hover:scale-105 transition-all duration-300">
                                 deScier Handbook
                              </p>
                           </Link>
                           <div className="flex justify-between items-center w-full">
                              <p className="text-[13px] select-none text-[#F4F4F4]">Must-read for researchers!</p>
                              <Link href={'https://descier-1.gitbook.io/the-desci-journal-handbook/'} target="_blank" rel="noreferrer">
                                 <CaretRight
                                    size={16}
                                    className="fill-[#F4F4F4] cursor-pointer hover:scale-125 transition-all duration-200 hover:fill-primary-light"
                                 />
                              </Link>
                           </div>
                        </div>
                     </div>
                     <ShapeDeScierHandBookBottom className="absolute bottom-[-0.5rem] right-0" />
                  </div>
                  <hr className="divider-h" />
                  <div className="grid gap-4 pb-8">
                     <p className="text-base font-semibold text-[#3F3F44]">Last Submitted</p>
                     <ScrollArea className="h-[164px] lg:h-[300px] 2xl:h-[400px] pr-2">
                        <div className="grid gap-4">
                           {articles?.slice(0, 9)?.map((item) => (
                              <SubmitedItem key={item.id} date={item.since} status={item.status as 'published' | 'in_review'} title={item.title} />
                           ))}
                        </div>
                     </ScrollArea>
                  </div>
               </div>
            </div>
         </aside>
      </React.Fragment>
   )
}

export default Profile
