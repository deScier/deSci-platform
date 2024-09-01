'use client'

import * as Dialog from '@components/common/Dialog/Digalog'
import * as Title from '@components/common/Title/Page'

import { home_routes } from '@/routes/home'
import { UserSession as User } from '@/types/next-auth'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BoxArrowRight, Envelope, Lock, Pencil } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

import Box from '@/components/common/Box/Box'
import ForgotPasswordModal from '@/components/modules/ForgotPassword/ForgotPassword'
import UpdatePassword from '@/components/modules/Profile/Modals/ChangePassword'
import UpdateProfile from '@/components/modules/Profile/Modals/EditProfile'
import UpdateEmail from '@/components/modules/Profile/Modals/UpdateEmail'
import Image from 'next/image'
import React from 'react'

export default function ProfilePage() {
   const { data: session } = useSession()

   const router = useRouter()

   const [profileInfo, setProfileInfo] = React.useState<User>()

   const [profile, setProfile] = React.useState({
      edit_profile: false,
      edit_profile_sucess: false
   })
   const [email, setEmail] = React.useState({
      insert_password_to_edit_email: false,
      new_email: false,
      new_email_sucess: false
   })
   const [password, setPassword] = React.useState({
      insert_password_to_edit_password: false,
      new_password: false,
      new_password_sucess: false
   })

   const [passwordRecovery, setPasswordRecovery] = React.useState({
      insert_email_to_recover_password: false,
      insert_code_to_recover_password: false,
      insert_new_password: false,
      recover_password_sucess: false
   })

   const handleLogout = async () => {
      await signOut()
      router.push(home_routes.home.index)
   }

   // Hook to get the user info
   // ---------------------------------------------------------------
   // TODO: verify if this is necessary or the best way to get the user info

   //    React.useEffect(() => {
   //       console.log(session?.user)
   //       if (session?.user) {
   //          setProfileInfo(session?.user?.userInfo)
   //       }
   //    }, [session])

   return (
      <React.Fragment>
         <Dialog.Root open={profile.edit_profile || profile.edit_profile_sucess}>
            <Dialog.Content
               className={twMerge(
                  'pt-6 px-6 pb-14 md:py-14 md:px-16',
                  `${profile.edit_profile && 'max-w-[808px]'}`,
                  `${profile.edit_profile_sucess && 'max-w-[480px]'}`
               )}
            >
               <UpdateProfile
                  name={session?.user?.name ?? ''}
                  title={session?.user?.userInfo.title ?? ''}
                  image={session?.user?.userInfo?.avatar ?? ''}
                  success={profile.edit_profile_sucess}
                  edit_profile={profile.edit_profile}
                  onClose={() => setProfile({ ...profile, edit_profile: false, edit_profile_sucess: false })}
                  onConfirm={() => setProfile({ ...profile, edit_profile: false, edit_profile_sucess: true })}
               />
            </Dialog.Content>
         </Dialog.Root>
         <Dialog.Root open={email.insert_password_to_edit_email || email.new_email || email.new_email_sucess}>
            <Dialog.Content className={twMerge('pt-6 px-6 pb-14 md:py-14 md:px-16 max-w-[480px]')}>
               <UpdateEmail
                  insert_password={email.insert_password_to_edit_email}
                  new_email={email.new_email}
                  success={email.new_email_sucess}
                  onForgotPassword={() => {
                     setEmail({ ...email, insert_password_to_edit_email: false, new_email: false, new_email_sucess: false })
                     setPasswordRecovery({ ...passwordRecovery, insert_email_to_recover_password: true })
                  }}
                  onClose={() => {
                     setEmail({ ...email, insert_password_to_edit_email: false, new_email: false, new_email_sucess: false })
                  }}
                  onSetPassword={() => {
                     setEmail({ ...email, insert_password_to_edit_email: false, new_email: true })
                  }}
                  onSetNewEmail={() => {
                     setEmail({ ...email, new_email: false, new_email_sucess: true })
                  }}
               />
            </Dialog.Content>
         </Dialog.Root>
         <Dialog.Root open={password.insert_password_to_edit_password || password.new_password || password.new_password_sucess}>
            <Dialog.Content className={twMerge('pt-6 px-6 pb-14 md:py-14 md:px-16 max-w-[480px]')}>
               <UpdatePassword
                  new_password={password.new_password}
                  insert_current_password={password.insert_password_to_edit_password}
                  success={password.new_password_sucess}
                  onClose={() => {
                     setPassword({ ...password, insert_password_to_edit_password: false, new_password: false, new_password_sucess: false })
                  }}
                  onSetNewPassword={() => {
                     setPassword({ ...password, new_password: false, new_password_sucess: true })
                  }}
                  onSetPassword={() => {
                     setPassword({ ...password, insert_password_to_edit_password: false, new_password: true })
                  }}
                  onForgotPassword={() => {
                     setPassword({ ...password, insert_password_to_edit_password: false, new_password: false, new_password_sucess: false })
                     setPasswordRecovery({ ...passwordRecovery, insert_email_to_recover_password: true })
                  }}
               />
            </Dialog.Content>
         </Dialog.Root>
         <Dialog.Root
            open={
               passwordRecovery.insert_code_to_recover_password ||
               passwordRecovery.insert_email_to_recover_password ||
               passwordRecovery.insert_new_password ||
               passwordRecovery.recover_password_sucess
            }
         >
            <Dialog.Content className={twMerge('py-0 px-0 max-w-[480px]')}>
               <ForgotPasswordModal
                  onBack={() => {}}
                  onClose={() => {
                     setPasswordRecovery({
                        ...passwordRecovery,
                        insert_code_to_recover_password: false,
                        insert_email_to_recover_password: false,
                        insert_new_password: false,
                        recover_password_sucess: false
                     })
                  }}
               />
            </Dialog.Content>
         </Dialog.Root>
         <Title.Root>
            <Title.Title>My profile</Title.Title>
         </Title.Root>
         <Box className="h-fit py-10 px-8">
            <div className="grid gap-8">
               <div className="grid gap-6">
                  {profileInfo?.userInfo?.avatar ? (
                     <Image
                        width={144}
                        quality={50}
                        height={144}
                        alt="profile-image"
                        src={profileInfo?.userInfo?.avatar ?? ''}
                        className="w-36 h-36 bg-status-pending rounded-full mx-auto my-0 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
                     />
                  ) : (
                     <div className="flex justify-center items-center w-40 h-40 bg-status-pending rounded-full mx-auto my-0 lg:w-28 lg:h-28 2xl:w-36 2xl:h-36">
                        <p className="text-5xl w-full px-6 text-center">{session?.user?.name?.charAt(0).toUpperCase()}</p>
                     </div>
                  )}
                  <div className="grid gap-2">
                     <h1 className="text-xl text-secundary_blue-main font-semibold flex justify-center lg:text-lg 2xl:text-xl">{session?.user?.name}</h1>
                     <div className="grid md:grid-flow-col items-center justify-center gap-2 md:gap-4">
                        {session?.user?.userInfo.title !== '' && (
                           <React.Fragment>
                              <p className="text-sm text-primary-main font-regular select-none text-center">{session?.user?.userInfo.title}</p>
                              <div className="divider-h md:hidden bg-gray-300 h-px" />
                              <div className="divider-v hidden md:block bg-gray-300 w-px" />
                           </React.Fragment>
                        )}
                        <div className="flex items-center gap-2">
                           <Envelope className="w-4 h-5 fill-neutral-gray" />
                           <p className="text-sm text-neutral-gray select-none">{session?.user?.email}</p>
                        </div>
                     </div>
                  </div>
               </div>
               <hr className="divider-h" />
               <div className="grid gap-4">
                  <div className="grid gap-4">
                     <h3 className="text-lg font-semibold">Settings</h3>
                     <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <motion.div
                           whileTap={{ scale: 0.95 }}
                           className="border py-6 md:py-14 px-2 flex items-center justify-center gap-4 rounded-lg cursor-pointer hover:border-primary-light transition-colors duration-300 ease-in-out"
                           onClick={() => setProfile({ ...profile, edit_profile: true })}
                        >
                           <Pencil className="w-5 h-5 fill-neutral-gray" />
                           <p className="text-base text-neutral-gray">Edit profile</p>
                        </motion.div>
                        <motion.div
                           whileTap={{ scale: 0.95 }}
                           className="border py-6 md:py-14 px-2 flex items-center justify-center gap-4 rounded-lg cursor-pointer hover:border-primary-light transition-colors duration-300 ease-in-out"
                           onClick={() => setEmail({ ...email, insert_password_to_edit_email: true })}
                        >
                           <Envelope className="w-5 h-5 fill-neutral-gray" />
                           <p className="text-base text-neutral-gray">Change e-mail</p>
                        </motion.div>
                        <motion.div
                           whileTap={{ scale: 0.95 }}
                           className="border py-6 md:py-14 px-2 flex items-center justify-center gap-4 rounded-lg cursor-pointer hover:border-primary-light transition-colors duration-300 ease-in-out"
                           onClick={() => setPassword({ ...password, insert_password_to_edit_password: true })}
                        >
                           <Lock className="w-5 h-5 fill-neutral-gray" />
                           <p className="text-base text-neutral-gray">Change password</p>
                        </motion.div>
                        <motion.div
                           whileTap={{ scale: 0.95 }}
                           className="border py-6 md:py-14 px-2 flex items-center justify-center gap-4 rounded-lg cursor-pointer hover:border-primary-light transition-colors duration-300 ease-in-out"
                           onClick={handleLogout}
                        >
                           <BoxArrowRight className="w-5 h-5 fill-neutral-gray" />
                           <p className="text-base text-neutral-gray">Log out</p>
                        </motion.div>
                     </div>
                  </div>
               </div>
            </div>
         </Box>
      </React.Fragment>
   )
}
