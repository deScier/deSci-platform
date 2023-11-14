'use client'

import ForgotPasswordModal from '@/components/modules/ForgotPassword/ForgotPassword'
import { PurchasedArticles } from '@/components/modules/Home/Search/Purchase/PurchasedArticles'
import LoginModal from '@/components/modules/Login/Login'
import RegisterModal from '@/components/modules/Register/Register'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { dashboard_key, links } from '@/mock/sidebar_home_items'
import { home_routes } from '@/routes/home'
import { formatName } from '@/utils/format_texts'
import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import DeScierLogo from 'public/svgs/common/logo/deScier - Logo.svg'
import ArrowDown from 'public/svgs/modules/home/arrow-down.svg'
import React from 'react'
import { twMerge } from 'tailwind-merge'

const Header: React.FC = () => {
   const router = useRouter()
   const { data, status } = useSession()

   // See more about in https://nextjs.org/docs/app/api-reference/functions/use-pathname
   const currentPath = usePathname()
   const url_splited = currentPath.split('/')
   const array_path = url_splited.filter((item) => item !== 'home' && item !== '')

   function verifyPath(path: string): boolean {
      if (path === 'home') {
         return array_path.length === 0
      } else if (path === 'search') {
         return array_path.includes('search')
      } else {
         return false
      }
   }

   const login_component = 'login'
   const register_component = 'register'
   const forgot_password_component = 'forgot_password'
   const purchased = 'purchased'

   const [open, setOpen] = React.useState(false)
   const [component, setComponent] = React.useState(login_component)

   return (
      <React.Fragment>
         <Dialog.Root open={open}>
            <Dialog.Overlay />
            <Dialog.Content
               className={twMerge(
                  `${component !== purchased && 'w-[80%] max-w-[1200px] p-0 transition-all duration-300'}`,
                  component === forgot_password_component && 'max-w-[554px]'
               )}
            >
               {component === login_component && (
                  <LoginModal
                     onClose={() => setOpen(false)}
                     onForgotPassword={() => setComponent(forgot_password_component)}
                     onLogin={() => setComponent(login_component)}
                     onRegister={() => setComponent(register_component)}
                  />
               )}
               {component === register_component && (
                  <RegisterModal
                     onBack={() => setComponent(login_component)}
                     onClose={() => {
                        setOpen(false)
                        setComponent(login_component)
                     }}
                     onLogin={() => setComponent(login_component)}
                     onRegister={() => setComponent(register_component)}
                     onReturnToLogin={() => setComponent(login_component)}
                  />
               )}
               {component === forgot_password_component && (
                  <ForgotPasswordModal onBack={() => setComponent(login_component)} onClose={() => setComponent(login_component)} />
               )}
               {component === purchased && (
                  <PurchasedArticles
                     onClose={() => {
                        setOpen(false)
                        setComponent('')
                     }}
                  />
               )}
            </Dialog.Content>
         </Dialog.Root>
         <div className="py-3 px-8 bg-white flex items-center gap-8 rounded-full shadow-search w-fit justify-center">
            <div className="flex items-center gap-8">
               <DeScierLogo className="w-10 h-fit" />
               <div className="grid grid-cols-5 justify-items-center items-center">
                  {links.map((link) => (
                     <React.Fragment key={link.id}>
                        {link.id === dashboard_key ? (
                           status !== 'authenticated' ? (
                              <div className="flex justify-center min-w-[149px] py-2 px-4">
                                 <div
                                    onClick={() => {
                                       setOpen(true)
                                       setComponent(login_component)
                                    }}
                                    className={twMerge(
                                       'flex items-center gap-2 text-base text-terciary-main hover:text-secundary_blue-main transition-all duration-200 select-none cursor-pointer',
                                       `${verifyPath(link.label.toLowerCase()) && 'font-semibold text-secundary_blue-main'}`
                                    )}
                                 >
                                    {link.label} {link.icon !== null && link.icon}
                                 </div>
                              </div>
                           ) : (
                              <div className="flex justify-center min-w-[149px] py-2 px-4">
                                 <Link
                                    href={link.link}
                                    className={twMerge(
                                       'flex items-center gap-2 text-base text-terciary-main hover:text-secundary_blue-main transition-all duration-200',
                                       `${verifyPath(link.label.toLowerCase()) && 'font-semibold text-secundary_blue-main'}`
                                    )}
                                 >
                                    {link.label} {link.icon !== null && link.icon}
                                 </Link>
                              </div>
                           )
                        ) : (
                           <div className="flex justify-center min-w-[149px] py-2 px-4">
                              <Link
                                 href={link.link}
                                 className={twMerge(
                                    'flex items-center gap-2 text-base text-terciary-main hover:text-secundary_blue-main transition-all duration-200',
                                    `${verifyPath(link.label.toLowerCase()) && 'font-semibold text-secundary_blue-main'}`
                                 )}
                              >
                                 {link.label}
                                 {link.icon !== null && link.icon}
                              </Link>
                           </div>
                        )}
                     </React.Fragment>
                  ))}
               </div>
            </div>
            {status === 'unauthenticated' && (
               <div className="flex items-center gap-4">
                  <Button.Button
                     variant="outline"
                     className="rounded-full py-2 px-8 text-sm"
                     onClick={() => {
                        setOpen(true)
                        setComponent(login_component)
                     }}
                  >
                     Login
                  </Button.Button>
                  <Button.Button
                     variant="primary"
                     className="rounded-full py-2 px-8 text-sm"
                     onClick={() => {
                        setOpen(true)
                        setComponent(register_component)
                     }}
                  >
                     Register
                  </Button.Button>
               </div>
            )}
            {status === 'authenticated' && (
               <React.Fragment>
                  <div className="grid grid-flow-col items-center justify-start gap-4">
                     <div className="relative w-10 h-10 overflow-hidden rounded-full">
                        <Image
                           width={200}
                           height={200}
                           alt="avatar"
                           priority={true}
                           src={data?.user?.userInfo.avatar || '/images/profile_dk08wk.png'}
                           style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                           className="hover:scale-110 transition-all duration-300"
                        />
                     </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <div className="grid grid-flow-col items-center gap-4">
                              <p className="font-semibold text-sm text-primary-main select-none">{formatName(data?.user?.userInfo.name as string)}</p>
                              <ArrowDown className="w-[14px] fill-neutral-gray" />
                           </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[180px]">
                           <DropdownMenuItem
                              className="grid text-sm text-center text-[#5E6992] "
                              onMouseEnter={() => router.prefetch(home_routes.profile)}
                              onClick={() => router.push(home_routes.profile)}
                           >
                              My profile
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              className="grid text-sm text-center text-[#5E6992] "
                              onClick={() => {
                                 setOpen(true)
                                 setComponent(purchased)
                              }}
                           >
                              Articles purchased
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              className="grid text-sm text-center text-[#5E6992] "
                              onClick={async () => {
                                 await signOut()
                                 router.push(home_routes.home.index)
                              }}
                           >
                              Logout
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </React.Fragment>
            )}
         </div>
      </React.Fragment>
   )
}

export default Header
