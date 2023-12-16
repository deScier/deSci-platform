import React, { useEffect, useState } from 'react'
import Profile from '../../Profile/Profile'
import { SidesProps } from '../Typing'
import { connectWeb3AuthWallet, initWeb3Auth } from '@/services/web3auth/web3auth.service'
import { SafeEventEmitterProvider } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

/**
 * @title Mobile Profile Component
 * @notice This component renders the mobile view of a user profile
 * @dev This React functional component uses the SidesProps for props input and handles the rendering of the Profile component in a mobile-responsive manner
 */
export const MobileProfileComponent: React.FC<SidesProps> = ({ onClose }: SidesProps) => {
   const { data: session, update: updateSession } = useSession()

   const [web3auth, setWeb3Auth] = useState<Web3Auth | null>(null)
   const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)

   const handleConnectWallet = async () => {
      console.log('començando...')
      /** @dev Connects to Web3Auth wallet and manages the provider */
      const response = await connectWeb3AuthWallet({
         provider,
         setProvider,
         web3auth
      })

      console.log('fechou')

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
      //setWalletAddress(response.walletAddress)

      /** @dev Notification of successful wallet connection */
      toast.success('Wallet connected successfully.')
   }

   useEffect(() => {
      const loadWeb3Auth = async () => {
         await initWeb3Auth({
            setProvider,
            setWeb3Auth
         })
      }

      loadWeb3Auth()
   }, [])

   return (
      <React.Fragment>
         <div className="relative">
            <Profile className="block w-auto" onClose={() => onClose()} connectWallet={() => handleConnectWallet()} mobileWeb3auth={web3auth} />
         </div>
      </React.Fragment>
   )
}
