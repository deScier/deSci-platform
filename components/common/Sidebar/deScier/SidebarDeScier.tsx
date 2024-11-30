'use client'

import * as Button from '@components/common/Button/Button'

import { home_routes } from '@/routes/home'
import { handleLogout } from '@/utils/logout'
import { uniqueId } from 'lodash'
import { usePathname, useRouter } from 'next/navigation'
import { PlusCircle } from 'react-bootstrap-icons'

import Item from '@components/common/Sidebar/Item/Item'
import Image from 'next/image'
import deScierLogo from 'public/svgs/common/logo/deScier - Logo.png'
import LogoDeScier from 'public/svgs/common/logo/deScier - Logo.svg'
import ArticlesIcon from 'public/svgs/common/sidebar/Icons/articles.svg'
import JournalIcon from 'public/svgs/common/sidebar/Icons/file-text.svg'
import LogoutIcon from 'public/svgs/common/sidebar/Icons/logout.svg'
import SummaryIcon from 'public/svgs/common/sidebar/Icons/summary.svg'
import React from 'react'

/**
 * @title Sidebar Component for the DeScier Platform
 * @notice Implements the sidebar navigation for the DeScier web application.
 * @dev This component utilizes Next.js's routing and image optimization features.
 */
const SidebarDeScier: React.FC = () => {
   /** @dev Retrieves the current URL path using Next.js's usePathname hook. */
   const currentPath = usePathname()

   /** @dev Initializes Next.js router for navigation purposes. */
   const router = useRouter()

   return (
      <React.Fragment>
         <aside className="hidden md:flex flex-col gap-8 left-0 sticky pt-10 pb-14 px-6 justify-between bg-[#FEFEFE] z-50 h-screen">
            <div className="flex flex-col gap-8">
               <LogoDeScier className="w-20 h-20 mx-auto my-0" />
               <Button.Link href={home_routes.summary_routes.new_document}>
                  <Button.Button variant="primary" className="mx-auto my-0 p-3 text-sm">
                     Submit new article
                     <PlusCircle size={20} />
                  </Button.Button>
               </Button.Link>
               <div>
                  {items.map((item) => (
                     <Item key={item.id} text={item.text} icon={item.icon} href={item.path} active={currentPath.includes(item.path)} />
                  ))}
               </div>
            </div>
            <Logout onLogout={() => router.push(home_routes.home.index)} />
         </aside>
      </React.Fragment>
   )
}

/**
 * @title Logout Component for the DeScier Platform
 * @notice Provides a UI for user logout functionality.
 * @dev This subcomponent handles the user logout process.
 * @param onLogout A function triggered on logout event.
 */
const Logout: React.FC<{ onLogout: () => void }> = ({ onLogout }: { onLogout: () => void }) => {
   /** @dev Initializes Next.js router for navigation after logout. */
   const router = useRouter()
   return (
      <React.Fragment>
         <div className="grid grid-flow-col items-center justify-start gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 overflow-hidden rounded-full">
               <Image
                  width={42}
                  height={42}
                  alt="avatar"
                  priority={true}
                  src={deScierLogo}
                  style={{ objectFit: 'contain' }}
                  className="hover:scale-110 transition-all duration-300"
               />
            </div>
            <div className="grid grid-flow-col items-center gap-4">
               <p className="font-semibold text-base text-primary-main select-none">deScier</p>
               <LogoutIcon
                  width={18}
                  className="fill-neutral-light_gray cursor-pointer hover:fill-primary-main transition-all duration-300 hover:scale-110 mt-[2px]"
                  onClick={() => handleLogout(() => router.push(home_routes.home.index))}
               />
            </div>
         </div>
      </React.Fragment>
   )
}

const items = [
   {
      id: uniqueId(),
      text: 'Dashboard',
      icon: <SummaryIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.summary,
      divider: false
   },
   {
      id: uniqueId(),
      text: 'Articles for approval',
      icon: <ArticlesIcon className="w-6 fill-neutral-light_gray lg:w-5 2xl:w-6" />,
      path: home_routes.descier.index
   },
   {
      id: uniqueId(),
      text: 'Journals for approval',
      icon: <JournalIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.descier.journals_for_approval
   }
]

export default SidebarDeScier
