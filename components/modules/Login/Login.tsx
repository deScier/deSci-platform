import { home_routes } from '@/routes/home'
import '@styles/login.css'

import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'

import { Separator } from '@/components/ui/separator'
import { LoginProps, LoginSchema } from '@/schemas/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { X } from 'react-bootstrap-icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { LoginModalProps } from './Typing'

import GoogleIcon from 'public/svgs/modules/login/google_icon.svg'
import MetamaskLogo from 'public/svgs/modules/login/metamask.svg'
import React from 'react'
import LoginAnimation from './Animation/Animation'

import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

import { useSyncProviders } from '@/hooks/useSyncProviders'
import RPC from '@utils/viem_rpc'; // for using viem

/** @title LoginModal Component
 *  @notice This component provides a modal interface for user login, with optional registration, password recovery, and third-party login via Google.
 *  @dev The component uses React hooks for state management and routing, and integrates form handling and validation using the useForm hook.
 */
const LoginModal: React.FC<LoginModalProps> = ({ withLink = false, authorName, onClose, onForgotPassword, onRegister, noRedirect }: LoginModalProps) => {
   /** @dev Initialize Next.js router */
   const router = useRouter()

   /** @dev State for managing loading status */
   const [loading, setLoading] = React.useState(false)

   /** @dev Setup form handling with useForm hook, including form validation using zodResolver */
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors }
   } = useForm<LoginProps>({
      resolver: zodResolver(LoginSchema),
      defaultValues: { email: '', password: '' }
   })

   /**
    * @dev Handles form submission, performs sign-in using credentials, and manages routing based on authentication result
    * @param data The user's login credentials
    */
   const onSubmit: SubmitHandler<LoginProps> = async (data) => {
      setLoading(true)
      const authResult = await signIn('credentials', {
         redirect: false,
         email: data.email,
         password: data.password
      })

      setLoading(false)

      if (authResult?.error) {
         toast.error('Login error. Check your credentials.')
         return
      }

      toast.success('Successful login. Redirecting...')
      if (noRedirect) {
         onClose()
         return
      }
      router.refresh()
      router.push(home_routes.summary)
   }

   // ===============================================

   const [web3auth, setWeb3auth] = React.useState<Web3AuthNoModal | null>(null)
   console.log('web3auth', web3auth)
   const [provider, setProvider] = React.useState<IProvider | null>(null)
   console.log('provider', provider)
   const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null)

   React.useEffect(() => {
      const init = async () => {
         try {
            const chainConfig = {
               chainNamespace: CHAIN_NAMESPACES.EIP155,
               chainId: '0x1', // Please use 0x1 for Mainnet
               rpcTarget: 'https://rpc.ankr.com/eth',
               displayName: 'Ethereum Devnet',
               blockExplorerUrl: 'https://etherscan.io/',
               ticker: 'ETH',
               tickerName: 'Ethereum',
               logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
            }

            const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } })

            const web3auth = new Web3AuthNoModal({
               clientId: process.env.WEB3AUTH_NEW_LOGIN_CLIENT_ID as string, 
               web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
               privateKeyProvider
            })

            const openloginAdapter = new OpenloginAdapter({
               loginSettings: {
                  mfaLevel: 'optional'
               },
               adapterSettings: {
                  uxMode: 'popup',
                  whiteLabel: { defaultLanguage: 'en' },
                  mfaSettings: {
                     deviceShareFactor: {
                        enable: true,
                        priority: 1,
                        mandatory: true
                     },
                     backUpShareFactor: {
                        enable: true,
                        priority: 2,
                        mandatory: false
                     },
                     socialBackupFactor: {
                        enable: true,
                        priority: 3,
                        mandatory: false
                     },
                     passwordFactor: {
                        enable: true,
                        priority: 4,
                        mandatory: true
                     }
                  },
                  loginConfig: {
                     google: {
                        verifier: 'google-development-verifier',
                        typeOfLogin: 'google',
                        clientId: process.env.GOOGLE_ID as string
                     }
                  }
               }
            })

            web3auth.configureAdapter(openloginAdapter)
            setWeb3auth(web3auth)

            await web3auth.init()
            setProvider(web3auth.provider)

            if (web3auth.connected) {
               setLoggedIn(true)
            }
         } catch (error) {
            console.error(error)
         }
      }

      init()
   }, [])

   //    const handleGoogleAuth = async (e: React.MouseEvent<HTMLElement>) => {
   //     e.preventDefault()
   //     signIn('google', { callbackUrl: `/login` })
   //   }

   const login = async (e: React.MouseEvent<HTMLElement>) => {
      if (!web3auth) {
         uiConsole('web3auth not initialized yet')
         return
      }
      try {
         const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: 'google' })

         signIn('google', { callbackUrl: `/home` })

         setProvider(web3authProvider)
      } catch (error) {
         if (error instanceof Error && error.message.includes('Already connected')) {
            toast.info('Already connected. Please disconnect first.')
         } else {
            console.error('Login error:', error)
         }
      }
   }

   const authenticateUser = async () => {
      if (!web3auth) {
         uiConsole('web3auth not initialized yet')
         return
      }
      const idToken = await web3auth.authenticateUser()
      uiConsole(idToken)
   }

   const getUserInfo = async () => {
      if (!web3auth) {
         uiConsole('web3auth not initialized yet')
         return
      }
      const user = await web3auth.getUserInfo()
      uiConsole(user)
   }

   const logout = async () => {
      if (!web3auth) {
         uiConsole('web3auth not initialized yet')
         return
      }
      await web3auth.logout()
      setLoggedIn(false)
      setProvider(null)
   }

   const getChainId = async () => {
      if (!provider) {
         uiConsole('provider not initialized yet')
         return
      }
      const rpc = new RPC(provider)
      const chainId = await rpc.getChainId()
      uiConsole(chainId)
   }
   const getAccounts = async () => {
      if (!provider) {
         uiConsole('provider not initialized yet')
         return
      }
      const rpc = new RPC(provider)
      const address = await rpc.getAccounts()
      uiConsole(address)
   }

   const getBalance = async () => {
      if (!provider) {
         uiConsole('provider not initialized yet')
         return
      }
      const rpc = new RPC(provider)
      const balance = await rpc.getBalance()
      uiConsole(balance)
   }

   const sendTransaction = async () => {
      if (!provider) {
         uiConsole('provider not initialized yet')
         return
      }
      const rpc = new RPC(provider)
      const receipt = await rpc.sendTransaction()
      uiConsole(receipt)
   }

   const signMessage = async () => {
      if (!provider) {
         uiConsole('provider not initialized yet')
         return
      }
      const rpc = new RPC(provider)
      const signedMessage = await rpc.signMessage()
      uiConsole(signedMessage)
   }

   const getPrivateKey = async () => {
      if (!provider) {
         uiConsole('provider not initialized yet')
         return
      }
      const rpc = new RPC(provider)
      const privateKey = await rpc.getPrivateKey()
      uiConsole(privateKey)
   }

   function uiConsole(...args: any[]): void {
      const el = document.querySelector('#console>p')
      if (el) {
         el.innerHTML = JSON.stringify(args || {}, null, 2)
      }
   }

   /* =============== Metamask Auth =================== */
   const [selectedWallet, setSelectedWallet] = React.useState<EIP6963ProviderDetail>()
   const [userAccount, setUserAccount] = React.useState<string>('')
   const providers = useSyncProviders()

   console.log('metamask', {
      selected_wallet: selectedWallet,
      user_account: userAccount,
      providers: providers
   })

   const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
      try {
         const accounts = (await providerWithInfo.provider.request({
            method: 'eth_requestAccounts'
         })) as string[]

         // Login
         // ----------------------------------------------------------------
         // TODO: implement a login to get session when the user is connected
         //  setValue('wallet_address', accounts[0])
         setUserAccount(accounts[0])
      } catch (error) {
         console.error(error)
      }
   }

   return (
      <React.Fragment>
         <div className="grid md:grid-cols-2 relative">
            <X
               size={32}
               className="absolute z-20 bg-white rounded-md right-4 top-4 cursor-pointer hover:scale-110 transition-all duration-200"
               onClick={onClose}
            />
            <LoginAnimation />
            <div className="w-ful grid gap-6 md:p-16 relative p-6 pb-12">
               <X size={32} className="hidden md:absolute right-4 top-4 cursor-pointer hover:scale-110 transition-all duration-200" onClick={onClose} />
               <h2 className="font-semibold text-1xl">Sign in</h2>
               {withLink && (
                  <React.Fragment>
                     <p className="text-sm font-regular">
                        “{authorName}” has extended a kind invitation for you to serve as Reviewer/ Editor. Sign in or register to continue.
                     </p>
                  </React.Fragment>
               )}
               <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                     <Input.Root>
                        <Input.Label>E-mail</Input.Label>
                        <Input.Input type="email" placeholder="Type your best email" {...register('email')} />
                        <Input.Error>{errors.email?.message}</Input.Error>
                     </Input.Root>
                     <Input.Root>
                        <Input.Label>Password</Input.Label>
                        <Input.Password placeholder="Type your password" {...register('password')} />
                        <Input.Error>{errors.password?.message}</Input.Error>
                     </Input.Root>
                  </div>
                  <Button.Button type="submit" loading={loading}>
                     Login
                  </Button.Button>
                  <p className="text-secundary_blue-main text-sm text-center">
                     Forgot your password?{' '}
                     <span
                        className="underline hover:text-primary-hover duration-200 cursor-pointer transition-all hover:underline"
                        onClick={onForgotPassword}
                     >
                        Click here
                     </span>
                  </p>
                  <div className="relative">
                     <Separator color="#A9A9A9" className="h-[0.5px]" />
                     <p className="text-base p-2 px-3 text-neutral-light_gray absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white">
                        or
                     </p>
                  </div>
                  <Button.Button variant="outline" className="px-4 py-2" onClick={() => handleConnect(providers[0])}>
                     <MetamaskLogo className="w-6" />
                     <span className="text-base font-semibold">Continue with wallet</span>
                  </Button.Button>
                  <div className="space-y-2">
                     <Button.Button variant="outline" className="px-4 py-2" onClick={(e) => login(e)}>
                        <GoogleIcon className="w-6" />
                        <span className="text-base font-semibold">Continue with Google</span>
                     </Button.Button>
                     <p className="text-[10px] font-regular text-neutral-light_gray text-center">
                        When connecting via Google, a self-custodial digital wallet will be created using Web3Auth. You will have full control over your
                        assets.
                     </p>
                  </div>
                  <p className="text-secundary_blue-main text-sm text-center">
                     Don&apos;t have an account yet?{' '}
                     <span className="underline hover:text-primary-hover duration-200 cursor-pointer transition-all hover:underline" onClick={onRegister}>
                        Create account
                     </span>
                  </p>
               </form>
            </div>
         </div>
      </React.Fragment>
   )
}

export default LoginModal
