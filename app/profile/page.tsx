'use client';

import * as Dialog from '@components/common/Dialog/Digalog';
import * as Title from '@components/common/Title/Page';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { home_routes } from '@/routes/home';
import { UserSession as User } from '@/types/next-auth';
import { formatAddress } from '@/utils/format_wallet';
import { handleLogout } from '@/utils/logout';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BoxArrowRight, Envelope, Lock, Pencil } from 'react-bootstrap-icons';
import { twMerge } from 'tailwind-merge';

import Box from '@/components/common/Box/Box';
import ForgotPasswordModal from '@/components/modules/ForgotPassword/ForgotPassword';
import UpdatePassword from '@/components/modules/Profile/Modals/ChangePassword';
import UpdateProfile from '@/components/modules/Profile/Modals/EditProfile';
import UpdateEmail from '@/components/modules/Profile/Modals/UpdateEmail';
import Image from 'next/image';
import React from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();

  const router = useRouter();

  const [profileInfo, setProfileInfo] = React.useState<User>();

  const [profile, setProfile] = React.useState({
    edit_profile: false,
    edit_profile_sucess: false,
  });
  const [email, setEmail] = React.useState({
    insert_password_to_edit_email: false,
    new_email: false,
    new_email_sucess: false,
  });
  const [password, setPassword] = React.useState({
    insert_password_to_edit_password: false,
    new_password: false,
    new_password_sucess: false,
  });

  const [passwordRecovery, setPasswordRecovery] = React.useState({
    insert_email_to_recover_password: false,
    insert_code_to_recover_password: false,
    insert_new_password: false,
    recover_password_sucess: false,
  });

  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <React.Fragment>
      <Title.Root>
        <Title.Title>My profile</Title.Title>
      </Title.Root>
      <Box className="h-fit py-10 px-8">
        <div className="grid gap-8">
          <div className="grid gap-6">
            {session?.user?.userInfo?.avatar !== null ? (
              <Image
                width={144}
                quality={50}
                height={144}
                alt="profile-image"
                src={session?.user?.userInfo.avatar || '/images/profile_dk08wk.png'}
                className="w-36 h-36 rounded-full mx-auto my-0 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36 object-cover object-center"
              />
            ) : (
              <Image
                width={144}
                quality={50}
                height={144}
                alt="profile-image"
                src={'/images/profile_dk08wk.png'}
                className="w-36 h-36 rounded-full mx-auto my-0 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36 object-cover object-center"
              />
            )}
            <div className="grid gap-2">
              <h1 className="text-xl text-secundary_blue-main font-semibold flex justify-center lg:text-lg 2xl:text-xl">
                {session?.user?.name}
              </h1>
              <div className="grid md:grid-flow-col items-center justify-center gap-2 md:gap-4">
                {session?.user?.userInfo.title && (
                  <React.Fragment>
                    <p className="text-sm text-primary-main font-regular select-none text-center">
                      {session?.user?.userInfo.title}
                    </p>
                    <Separator orientation="vertical" className="h-4 bg-gray-300 hidden md:block" />
                    <Separator orientation="horizontal" className=" bg-gray-300 md:hidden" />
                  </React.Fragment>
                )}
                <div className="flex items-center gap-2">
                  <Envelope className="w-4 h-5 fill-neutral-gray" />
                  <p className="text-sm text-neutral-gray select-none">{session?.user?.email || '-'}</p>
                </div>
                {session?.user?.userInfo.walletAddress && (
                  <React.Fragment>
                    <Separator orientation="vertical" className="h-4 bg-gray-300 hidden md:block" />
                    <Separator orientation="horizontal" className=" bg-gray-300 md:hidden" />
                    <div className="flex items-center gap-2 mx-auto my-0 md:mx-0 md:my-0">
                      <p className="text-sm text-neutral-gray select-none">
                        {formatAddress(session?.user?.userInfo.walletAddress)}
                      </p>
                      <HoverCard closeDelay={1000} open={isCopied}>
                        <HoverCardTrigger
                          onClick={() => copyToClipboard(session?.user?.userInfo.walletAddress || 'N/A')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            className="bi bi-copy text-neutral-gray hover:text-primary-main cursor-pointer mb-0.5"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                            />
                          </svg>
                        </HoverCardTrigger>
                        <HoverCardContent className="p-2 py-1" side="bottom">
                          <h4 className="text-xs font-semibold text-status-green select-none">
                            Wallet address copied to the clipboard!
                          </h4>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </React.Fragment>
                )}
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
                  onClick={() => setPasswordRecovery({ ...passwordRecovery, insert_email_to_recover_password: true })}
                >
                  <Lock className="w-5 h-5 fill-neutral-gray" />
                  <p className="text-base text-neutral-gray">Change password</p>
                </motion.div>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="border py-6 md:py-14 px-2 flex items-center justify-center gap-4 rounded-lg cursor-pointer hover:border-primary-light transition-colors duration-300 ease-in-out"
                  onClick={() => handleLogout(() => router.push(home_routes.home.index))}
                >
                  <BoxArrowRight className="w-5 h-5 fill-neutral-gray" />
                  <p className="text-base text-neutral-gray">Log out</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <Dialog.Root open={profile.edit_profile || profile.edit_profile_sucess}>
        <Dialog.Content
          className={twMerge(
            'pt-6 px-6 pb-14 md:py-14 md:px-16',
            `${profile.edit_profile && 'md:max-w-[808px]'}`,
            `${profile.edit_profile_sucess && 'md:max-w-[480px]'}`
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
        <Dialog.Content className={twMerge('pt-6 px-6 pb-14 md:py-14 md:px-16 md:max-w-[480px]')}>
          <UpdateEmail
            insert_password={email.insert_password_to_edit_email}
            new_email={email.new_email}
            success={email.new_email_sucess}
            onForgotPassword={() => {
              setEmail({ ...email, insert_password_to_edit_email: false, new_email: false, new_email_sucess: false });
              setPasswordRecovery({ ...passwordRecovery, insert_email_to_recover_password: true });
            }}
            onClose={() => {
              setEmail({ ...email, insert_password_to_edit_email: false, new_email: false, new_email_sucess: false });
            }}
            onSetPassword={() => {
              setEmail({ ...email, insert_password_to_edit_email: false, new_email: true });
            }}
            onSetNewEmail={() => {
              setEmail({ ...email, new_email: false, new_email_sucess: true });
            }}
          />
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root
        open={password.insert_password_to_edit_password || password.new_password || password.new_password_sucess}
      >
        <Dialog.Content className={twMerge('pt-6 px-6 pb-14 md:py-14 md:px-16 md:max-w-[480px]')}>
          <UpdatePassword
            new_password={password.new_password}
            insert_current_password={password.insert_password_to_edit_password}
            success={password.new_password_sucess}
            onClose={() => {
              setPassword({
                ...password,
                insert_password_to_edit_password: false,
                new_password: false,
                new_password_sucess: false,
              });
            }}
            onSetNewPassword={() => {
              setPassword({ ...password, new_password: false, new_password_sucess: true });
            }}
            onSetPassword={() => {
              setPassword({ ...password, insert_password_to_edit_password: false, new_password: true });
            }}
            onForgotPassword={() => {
              setPassword({
                ...password,
                insert_password_to_edit_password: false,
                new_password: false,
                new_password_sucess: false,
              });
              setPasswordRecovery({ ...passwordRecovery, insert_email_to_recover_password: true });
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
        <Dialog.Content className={twMerge('py-0 px-0 md:max-w-[480px]')}>
          <ForgotPasswordModal
            onBack={() => {}}
            onClose={() => {
              setPasswordRecovery({
                ...passwordRecovery,
                insert_code_to_recover_password: false,
                insert_email_to_recover_password: false,
                insert_new_password: false,
                recover_password_sucess: false,
              });
            }}
          />
        </Dialog.Content>
      </Dialog.Root>
    </React.Fragment>
  );
}
