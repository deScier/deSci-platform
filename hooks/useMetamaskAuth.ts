import { loginUserService, Web3AuthenticateDTO } from '@/services/user/login.service'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

export const useMetamaskAuth = (): UseMetamaskAuthReturn => {
   const { getNounce, web3GoogleAuthenticate } = loginUserService()

   const walletClient =
      typeof window !== 'undefined' && window.ethereum
         ? createWalletClient({
              chain: sepolia,
              transport: custom(window.ethereum!)
           })
         : null

   const handleMetamaskAuth = async (e: React.MouseEvent<HTMLElement>, { onSuccess, onError, noRedirect, onRegister, onClose }: MetamaskAuthOptions) => {
      console.info('Starting Metamask authentication')
      e.preventDefault()

      try {
         if (!walletClient) {
            toast.error('No wallet providers available. Try installing Metamask or another wallet provider.')
            return
         }

         const [account] = await walletClient.getAddresses().catch(() => [])

         if (!account) {
            toast.error('Failed to find provider.')
            toast.info('Try opening your Metamask extension.')
            return
         }

         const nonce = await getNounce()

         if (!nonce) {
            toast.error('Failed to get nonce. Please try again.')
            return
         }

         const signedMessage = await walletClient
            .signMessage({
               account,
               message: nonce.nonce
            })
            .catch(() => '')

         if (!signedMessage) {
            toast.error('Failed to sign message. Please try again.')
            return
         }

         const data: Web3AuthenticateDTO = {
            walletAddress: account,
            signature: signedMessage,
            nonce: nonce.nonce,
            provider: 'wallet'
         }

         const response = await web3GoogleAuthenticate(data)

         if (response.status === 404) {
            toast.info('User not found. Please register first.')
            onRegister?.()
            return
         }

         if (!String(response.status).startsWith('20')) {
            toast.error(response.reason || 'Authentication failed')
            return
         }

         const result = await signIn('wallet', {
            redirect: false,
            walletAddress: account,
            signature: signedMessage,
            nonce: nonce.nonce
         })

         if (result?.error) {
            toast.error(`Failed to create session: ${result.error}`)
            onError?.()
         } else {
            toast.success('Successfully logged in with Metamask.')
            if (noRedirect) {
               onClose?.()
            } else {
               onSuccess?.()
            }
         }
      } catch (error) {
         console.error('Metamask login error:', error)
         onError?.()
      }
   }

   const handleGetMetamaskAccount = async (): Promise<string | undefined> => {
      if (!walletClient) {
         toast.error('No wallet providers available. Install Metamask or another wallet provider.')
         return undefined
      }
      const [account] = await walletClient.getAddresses().catch(() => [])
      if (!account) {
         toast.error('Failed to find provider. Try opening your Metamask extension.')
         return undefined
      }
      return account
   }

   return { handleMetamaskAuth, handleGetMetamaskAccount }
}

interface MetamaskAuthOptions {
   noRedirect?: boolean
   onSuccess?: () => void
   onError?: () => void
   onRegister?: () => void
   onClose?: () => void
}

interface UseMetamaskAuthReturn {
   handleMetamaskAuth: (e: React.MouseEvent<HTMLElement>, options: MetamaskAuthOptions) => Promise<void>
   handleGetMetamaskAccount: () => Promise<string | undefined>
}
