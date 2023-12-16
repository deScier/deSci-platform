import { SafeEventEmitterProvider } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { getSession } from 'next-auth/react'
import { Web3 } from 'web3'

interface InitWeb3Props {
   setWeb3Auth: (web3Auth: Web3Auth) => void
   setProvider: (provider: SafeEventEmitterProvider | null) => void
}

interface ConnectWeb3Props {
   web3auth: Web3Auth | null
   provider: SafeEventEmitterProvider | null
   setProvider: (provider: SafeEventEmitterProvider | null) => void
}

const inProduction = process.env.NEXT_PUBLIC_NODE_ENV === 'production'
const clientId = inProduction ? process.env.WEB3AUTH_CLIENT_ID! : process.env.WEB3AUTH_CLIENT_ID_TEST!
const alchemyApiUrl = inProduction ? process.env.ALCHEMY_API_URL : process.env.ALCHEMY_API_URL_TEST

export const initWeb3Auth = async ({ setWeb3Auth, setProvider }: InitWeb3Props) => {
   try {
      const web3authInstance = new Web3Auth({
         clientId,
         web3AuthNetwork: inProduction ? 'sapphire_mainnet' : 'sapphire_devnet',
         chainConfig: {
            chainId: inProduction ? '0x89' : '0x13881',
            displayName: inProduction ? 'Polygon' : 'Polygon mumbai',
            chainNamespace: 'eip155',
            rpcTarget: alchemyApiUrl,
            blockExplorer: inProduction ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com',
            ticker: 'MATIC',
            tickerName: 'Polygon'
         }
      })
      setWeb3Auth(web3authInstance)
      await web3authInstance.initModal()
      if (web3authInstance.provider) {
         setProvider(web3authInstance.provider)
      }
   } catch (error) {
      console.log(error)
   }
}

/* Connect to the wallet using Web3Auth */
export const connectWeb3AuthWallet = async ({ web3auth, provider, setProvider }: ConnectWeb3Props) => {
   if (!web3auth) {
      console.log('web3auth not initialized')
      return
   }
   const session = await getSession()

   const web3authProvider = await web3auth.connect()
   setProvider(web3authProvider)

   const walletAddress = await getAccount(provider)

   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/add-wallet`, {
      method: 'PATCH',
      headers: {
         'content-type': 'application/json',
         authorization: `Bearer ${session?.user?.token}`
      },
      body: JSON.stringify({
         walletAddress: walletAddress
      })
   })

   if (response.status === 200) {
      return {
         success: true,
         message: 'Wallet connected successfully.',
         walletAddress: walletAddress as string
      }
   }

   const responseData = await response.json()

   const message = responseData.message ?? 'Error in download document.'

   return {
      success: false,
      message: message
   }
}

const getAccount = async (provider: SafeEventEmitterProvider | null) => {
   try {
      const web3 = new Web3(provider as any)

      const address = (await web3.eth.getAccounts())[0]

      return address
   } catch (error) {
      return error
   }
}
