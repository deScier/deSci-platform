'use client';

import * as Button from '@components/common/Button/Button';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useMetamaskAuth } from '@/hooks/useMetamaskAuth';
import { home_routes } from '@/routes/home';
import { useArticles } from '@/services/document/getArticles.service';
import { addWalletService } from '@/services/user/addWallet.service';
import { formatAddress } from '@/utils/format_wallet';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CaretRight, PlusCircle, X } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { ProfileProps } from './Typing';

import Image from 'next/image';
import Link from 'next/link';
import CopyIcon from 'public/svgs/common/copy.svg';
import ShapeDeScierHandBookBottom from 'public/svgs/modules/sidebar/Ellipse 46.svg';
import ShapeDeScierHandBookTop from 'public/svgs/modules/sidebar/Ellipse 48.svg';
import IllustrationHandBook from 'public/svgs/modules/sidebar/emojione-v1_document.svg';
import React from 'react';
import SubmitedItem from './SubmitedItem/SubmitedItem';

/**
 * @title Profile Component
 * @notice This component renders the user's profile page, allowing them to view their profile details, connect a wallet, and access their submitted articles.
 * @dev This component uses the `useSession` and `useArticles` hooks for session management and fetching articles, respectively. It also manages states for the Web3Auth, provider, and wallet connection.
 */
const Profile: React.FC<ProfileProps> = ({ className, onClose }: ProfileProps) => {
  /** @dev Initialize router hook for navigation */
  const router = useRouter();

  /** @dev Initialize button ref to get the width of the button */
  const button_ref = React.useRef<HTMLButtonElement>(null);

  /** @dev Initialize session hook for user data */
  const { data: session, update } = useSession();

  /** @dev Initialize hook to fetch articles */
  const { articles } = useArticles();

  /** @dev Initialize hook to copy to clipboard */
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  /** @dev Initialize hook to connect wallet */
  const { handleGetMetamaskAccount } = useMetamaskAuth();

  return (
    <React.Fragment>
      <aside className={twMerge('hidden md:relative md:block', className)}>
        <div className="flex flex-col gap-8 xxl:min-h-full 2xl:h-screen 2xl:min-h-screen right-0 md:py-14 md:px-6 justify-between bg-[#FEFEFE]">
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
                className="w-24 h-24 md:w-36 md:h-36 rounded-full mx-auto my-0 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
              />
              <div className="grid gap-2 lg:gap-3 2xl:gap-2">
                <h1 className="text-xl text-secundary_blue-main font-semibold flex justify-center lg:text-lg 2xl:text-xl">
                  {session?.user?.userInfo.name}
                </h1>
                {!session?.user?.userInfo.walletAddress ? (
                  <React.Fragment>
                    {/* <DropdownMenu>
                                 <DropdownMenuTrigger asChild className="w-full"> */}
                    <Button.Button
                      ref={button_ref}
                      variant="outline"
                      className="mx-auto px-2 py-3 my-0 text-sm"
                      onClick={async () => {
                        const account = await handleGetMetamaskAccount();

                        if (account) {
                          await addWalletService({
                            walletAddress: account.walletAddress,
                            signature: account.signature,
                            nonce: account.nonce,
                          }).then(async (res) => {
                            if (res.success) {
                              toast.success('MetaMask wallet connected successfully.');

                              let data = {
                                user: {
                                  ...session?.user,
                                  userInfo: {
                                    ...session?.user?.userInfo,
                                    walletAddress: account.walletAddress,
                                  },
                                },
                              };

                              update(data);
                              router.refresh();
                            } else {
                              toast.error(res.message);
                            }
                          });
                        }
                      }}
                    >
                      Connect wallet
                      <PlusCircle className="w-4" />
                    </Button.Button>
                    {/* </DropdownMenuTrigger>
                                 <DropdownMenuContent className={cn('min-w-[242px]')} style={{ width: button_ref?.current?.clientWidth }}>
                                    <DropdownMenuItem
                                       className="px-3 py-2 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                                       
                                    >
                                       <div className="flex items-center gap-2">
                                          <MetamaskLogo className="w-4" />
                                          <span className="text-sm font-medium">Connect with MetaMask</span>
                                       </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       className="px-3 py-2 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                                       onClick={async (e) => {
                                          const account = await handleGetGoogleAccount()

                                          if (account?.walletAddress) {
                                             await addWalletService({
                                                walletAddress: account.walletAddress,
                                                signature: account.signature,
                                                nonce: account.nonce
                                             }).then(async (res) => {
                                                if (res.success) {
                                                   toast.success('Successfully connected your wallet using Google via Web3 Auth.')

                                                   toast.info(
                                                      'A Web3Auth self-custodial wallet has been created, giving you full control over your assets.'
                                                   )

                                                   let data = {
                                                      user: {
                                                         ...session?.user,
                                                         userInfo: {
                                                            ...session?.user?.userInfo,
                                                            walletAddress: account.walletAddress
                                                         }
                                                      }
                                                   }

                                                   update(data)

                                                   router.refresh()
                                                   router.push(home_routes.summary)
                                                } else {
                                                   toast.error(res.message)
                                                }
                                             })
                                          }
                                       }}
                                    >
                                       <div className="flex items-center gap-2">
                                          <GoogleIcon className="w-4" />
                                          <span className="text-sm font-medium">Connect with Google</span>
                                       </div>
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu> */}
                  </React.Fragment>
                ) : (
                  <div className="flex items-center gap-2 mx-auto my-0">
                    <p className="text-sm text-neutral-gray select-none">
                      {formatAddress(session?.user?.userInfo.walletAddress || 'N/A')}
                    </p>
                    <HoverCard closeDelay={1000} open={isCopied}>
                      <HoverCardTrigger onClick={() => copyToClipboard(session?.user?.userInfo.walletAddress || 'N/A')}>
                        <CopyIcon className="bi bi-copy text-neutral-gray hover:text-primary-main cursor-pointer mb-0.5" />
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2 py-1" side="bottom">
                        <h4 className="text-xs font-semibold text-status-green select-none">
                          Wallet address copied to the clipboard!
                        </h4>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                )}
              </div>
            </div>
            <div className="relative rounded-lg w-full p-4 h-20 gradient-grad-dark overflow-hidden">
              <ShapeDeScierHandBookTop className="absolute top-[-0.5rem] left-0" />
              <div className="flex gap-2 w-full p-3 items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <IllustrationHandBook />
                <div className="grid items-center">
                  <Link
                    href={'https://descier-1.gitbook.io/the-desci-journal-handbook/'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <p className="text-sm font-semibold text-[#F4F4F4] cursor-pointer hover:underline hover:scale-105 transition-all duration-300">
                      deScier Handbook
                    </p>
                  </Link>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[13px] select-none text-[#F4F4F4]">Must-read for researchers!</p>
                    <Link
                      href={'https://descier-1.gitbook.io/the-desci-journal-handbook/'}
                      target="_blank"
                      rel="noreferrer"
                    >
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
                  {articles?.length ? (
                    articles.slice(0, 9).map((item) => (
                      <SubmitedItem
                        key={item.id}
                        date={item.since}
                        status={item.status as 'published' | 'in_review'}
                        title={item.title}
                        onClick={() => {
                          if (item.status === 'SUBMITTED') {
                            router.push(`/home/search/${item.id}`);
                          } else if (item.status === 'PENDING') {
                            router.push(home_routes.articles.in_review + '/' + item.id);
                          }
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-neutral-gray">No submissions available.</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
};

export default Profile;
