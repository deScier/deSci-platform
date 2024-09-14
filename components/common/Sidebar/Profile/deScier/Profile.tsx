'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import LogoDeScier from 'public/svgs/common/logo/deScier - Logo.svg'
import ShapeDeScierHandBookBottom from 'public/svgs/modules/sidebar/Ellipse 46.svg'
import ShapeDeScierHandBookTop from 'public/svgs/modules/sidebar/Ellipse 48.svg'
import IllustrationHandBook from 'public/svgs/modules/sidebar/emojione-v1_document.svg'
import React from 'react'
import { CaretRight } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

/**
 * @title ProfileDeScier Component
 * @notice Component to display the user profile in a styled format with various sections.
 * @dev This component uses Next.js's useRouter and a custom usePathname hook to handle routing and path information.
 */
const ProfileDeScier: React.FC = () => {
   /** @dev Retrieve the current path using the custom usePathname hook. */
   const currentPath = usePathname()

   /** @dev Initialize Next.js router for navigation purposes. */
   const router = useRouter()
   return (
      <React.Fragment>
         <aside className={twMerge('hidden md:relative md:block overflow-hidden')}>
            <div className="flex flex-col gap-8 sticky h-[100vh] right-0 py-14 px-6 justify-between bg-[#FEFEFE]">
               <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-semibold">My profile</h3>
                  </div>
                  <div className="grid gap-6">
                     <div className="flex items-center justify-center relative overflow-hidden mx-auto my-0">
                        <LogoDeScier className="w-28 h-w-28 mx-auto my-0" />
                     </div>
                     <div className="grid gap-2 lg:gap-3 2xl:gap-2">
                        <h1 className="text-xl text-secundary_blue-main font-semibold flex justify-center lg:text-lg 2xl:text-xl">deScier</h1>
                     </div>
                  </div>
                  <div className="relative rounded-lg w-full p-4 h-20 gradient-grad-dark overflow-hidden">
                     <ShapeDeScierHandBookTop className="absolute top-[-0.5rem] left-0" />
                     <div className="flex gap-2 w-full p-3 items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <IllustrationHandBook />
                        <div className="grid w-full items-center">
                           <Link href={'https://descier-1.gitbook.io/the-desci-journal-handbook/'} target="_blank" rel="noreferrer">
                              <p className="text-sm font-semibold text-[#F4F4F4] cursor-pointer hover:underline hover:scale-105 transition-all duration-300">
                                 deScier Handbook
                              </p>
                           </Link>
                           <div className="flex justify-between items-center w-full">
                              <p className="text-[13px] select-none text-[#F4F4F4]">Must-read for researchers!</p>
                              <CaretRight size={16} className="fill-[#F4F4F4] cursor-pointer hover:scale-125 transition-all duration-200" />
                           </div>
                        </div>
                     </div>
                     <ShapeDeScierHandBookBottom className="absolute bottom-[-0.5rem] right-0" />
                  </div>
                  <hr className="divider-h" />
               </div>
            </div>
         </aside>
      </React.Fragment>
   )
}

export default ProfileDeScier
