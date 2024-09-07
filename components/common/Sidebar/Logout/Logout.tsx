import { Skeleton } from '@/components/ui/skeleton'
import { home_routes } from '@/routes/home'
import { formatName } from '@/utils/format_texts'
import { handleLogout } from '@/utils/logout'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LogoutIcon from 'public/svgs/common/sidebar/Icons/logout.svg'
import React from 'react'

/**
 * @title Logout Component
 * @notice Handles user logout functionality and displays user's avatar and name.
 * @dev This component takes a logout function as a prop and uses Next.js's useRouter and useSession hooks.
 */
const Logout: React.FC<{ onLogout: () => void }> = ({ onLogout }: { onLogout: () => void }) => {
   /** @dev Initialize Next.js router and session hook. */
   const router = useRouter()

   /** @dev Retrieve the session data and status from the useSession hook. */
   const { data, status } = useSession()

   /**
    * @dev Handles the logout process.
    * @notice When invoked, it signs the user out and redirects to the home page.
    */

   return (
      <React.Fragment>
         <div className="grid grid-flow-col items-center justify-start gap-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-full">
               <Image
                  width={200}
                  height={200}
                  alt="avatar"
                  priority={true}
                  src={data?.user?.userInfo.avatar || '/images/profile_dk08wk.png'}
                  style={{
                     objectFit: 'cover',
                     width: '100%',
                     height: '100%'
                  }}
                  className="hover:scale-110 transition-all duration-300"
               />
            </div>
            <div className="grid grid-flow-col items-center gap-4">
               {status === 'loading' && <Skeleton className="w-28 h-6" />}
               {status === 'authenticated' && (
                  <React.Fragment>
                     <p className="font-semibold text-base text-primary-main select-none">{formatName(data?.user?.userInfo.name as string)}</p>
                  </React.Fragment>
               )}
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

export default Logout
