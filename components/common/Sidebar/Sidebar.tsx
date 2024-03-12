'use client'

import * as Dialog from '@components/common/Dialog/Digalog'

import { PurchasedArticles } from '@/components/modules/Home/Search/Purchase/PurchasedArticles'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { admin_key, article_key, items } from '@/mock/sidebar_items'
import { home_routes } from '@/routes/home'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Clipboard, PlusCircle } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

import { uniqueId } from 'lodash'
import LogoDeScier from 'public/svgs/common/logo/deScier - Logo.svg'
import React from 'react'
import Item from './Item/Item'
import Logout from './Logout/Logout'

/**
 * @title Sidebar Component
 * @notice Provides a sidebar navigation for the application, allowing users to navigate through different sections and functionalities.
 * @dev This component utilizes React.FC for functional component structure, useSession for session management, useRouter for routing, and useState for state management.
 */
const Sidebar: React.FC = () => {
   /** @dev Initialize session hook for user session management */
   const { data: session } = useSession()

   /** @dev Initialize router for navigation control */
   const router = useRouter()

   /** @dev Retrieve current path from the router for active link styling */
   const currentPath = usePathname()

   /** @dev State to manage whether the user has made a purchase */
   const [purchased, setPurchased] = React.useState(false)

   /** @dev Check if the user role is Administrator */
   const isAdministrator = session?.user?.userInfo.role !== 'ADMIN'

   const sidebar_items = [
      {
         id: uniqueId(),
         label: 'New Article',
         icon: <Clipboard size={16} />,
         route: home_routes.summary_routes.new_document
      },
      {
         id: uniqueId(),
         label: 'New Journal',
         icon: <Clipboard size={16} />,
         route: home_routes.summary_routes.new_journal
      }
   ]

   const [currentItem, setCurrentItem] = React.useState<string | undefined>(undefined)

   const findCurrentItem = () => {
      const currentItem = sidebar_items.find((item) => currentPath.includes(item.route))

      if (currentItem) {
         setCurrentItem(currentItem.route)
         return currentItem.route
      }
      return setCurrentItem(undefined)
   }

   React.useEffect(() => {
      findCurrentItem()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentPath])

   return (
      <React.Fragment>
         <Dialog.Root open={purchased}>
            <Dialog.Overlay />
            <Dialog.Content className={twMerge('max-w-[1024px] w-full h-fit', `${purchased && 'max-w-[80%]'}`)}>
               {purchased && <PurchasedArticles onClose={() => setPurchased(false)} />}
            </Dialog.Content>
         </Dialog.Root>
         <aside className="hidden md:flex flex-col gap-8 left-0 sticky pt-10 pb-14 px-6 justify-between bg-[#FEFEFE] z-50 xxl:min-h-full 2xl:h-screen 2xl:min-h-screen">
            <div className="flex flex-col gap-8">
               <LogoDeScier className="w-20 h-20 mx-auto my-0" />
               <Select value={currentItem} onValueChange={(value) => router.push(value as string)}>
                  <SelectTrigger
                     key={currentPath}
                     hasIndicator={false}
                     className="flex gap-2 items-center justify-center w-full rounded-md focus-visible:outline-none bg-primary-main hover:bg-primary-hover transition-all duration-200 hover:scale-[1.01] text-neutral-white mx-auto my-0 p-3 text-sm min-h-[48px] font-regular"
                  >
                     <SelectValue
                        defaultValue={currentItem}
                        placeholder={
                           <React.Fragment>
                              <div className="flex gap-2">
                                 <span className="text-sm font-regular">Submit Article or Journal</span>
                                 <PlusCircle size={18} />
                              </div>
                           </React.Fragment>
                        }
                     />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        {sidebar_items.map((item) => (
                           <SelectItem
                              hasItemIndicator={false}
                              className="py-1.5 px-2 group focus:bg-[#DDA9FF] focus:bg-opacity-30 transition-all duration-200"
                              value={item.route}
                              key={item.id}
                              onMouseEnter={() => router.prefetch(item.route as string)}
                           >
                              <div className="flex items-center gap-2">
                                 <Clipboard size={18} className="group-hover:text-primary-hover" />
                                 <span className="text-base mt-[2px] group-hover:text-primary-hover">{item.label}</span>
                              </div>
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
               <div>
                  {items.map((item) =>
                     isAdministrator && item.text === admin_key ? null : (
                        <div className="grid" key={item.id}>
                           <Item
                              key={item.id}
                              icon={item.icon}
                              href={item.path}
                              divider={item.divider}
                              icon_end={item.icon_end}
                              text={item.text as string}
                              active={currentPath.includes(item.path as string)}
                              onClick={() => item.text === article_key && setPurchased(true)}
                           />
                        </div>
                     )
                  )}
               </div>
            </div>
            <Logout onLogout={() => router.push(home_routes.home.index)} />
         </aside>
      </React.Fragment>
   )
}

export default Sidebar
