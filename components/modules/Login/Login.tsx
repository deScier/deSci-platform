'use client'
import '@styles/login.css'

import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'

import { Separator } from '@/components/ui/separator'
import { home_routes } from '@/routes/home'
import { LoginProps, LoginSchema } from '@/schemas/login'
import { loginUserService, Web3AuthenticateDTO } from '@/services/user/login.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { X } from 'react-bootstrap-icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { LoginModalProps } from './Typing'

import { useMetamaskAuth } from '@/hooks/useMetamaskAuth'
import GoogleIcon from 'public/svgs/modules/login/google_icon.svg'
import MetamaskLogo from 'public/svgs/modules/login/metamask.svg'
import React from 'react'
import LoginAnimation from './Animation/Animation'

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
               clientId: 'BDLCDoEW_yk2kzblGIAReTlUlekSqt6znV09LCvSUMTdLrX4iQKbHOHPFkrj3KO-HFGOtZY_nSGe4r_GDDBvLCE',
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
                        clientId: '397245222116-0ibhtaoia20ra1ber1mm0bfc61u52abd.apps.googleusercontent.com'
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

   const { getNounce, web3GoogleAuthenticate } = loginUserService()
   const { data: session } = useSession()
   console.log('session', session)

   const [sessionState, setSession] = React.useState<boolean>(false)

   const handleEnsureSession = async (): Promise<boolean> => {
      const local = localStorage.getItem('openlogin_store')
      if (!local) {
         return false
      }

      const sessionState = JSON.parse(local)

      if (!sessionState) {
         return false
      }

      setSession(true)

      return true
   }

   React.useEffect(() => {
      handleEnsureSession()
   }, [])

   const handleGoogleAuth = async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()

      console.info('Starting Google login process')

      if (!web3auth) {
         toast.error('Web3Auth not initialized yet')
         console.info('Web3Auth not initialized yet')
         return
      }
      try {
         console.info('Setting loading state to true')

         const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: 'google' })

         console.info('Attempting to connect to Web3Auth with Google', web3authProvider)

         if (!web3authProvider) {
            throw new Error('Failed to get Web3Auth provider')
         }
         console.info('Successfully connected to Web3Auth provider', web3authProvider)

         const userInfo = await web3auth.getUserInfo()
         console.info('Attempting to get user info', userInfo)

         const nonce = await getNounce()
         console.info('Attempting to get nonce from backend', nonce)

         const accounts = await web3authProvider.request<never, string[]>({ method: 'eth_accounts' })
         console.info('Attempting to get user accounts', accounts)

         if (!accounts) {
            throw new Error('Failed to get user accounts')
         }
         console.info('Successfully got user accounts', accounts)

         const from = accounts[0] ?? 'from'
         console.info(`Using account: ${from}`)

         const signedMessage = await web3authProvider.request<[string, string], string>({
            method: 'personal_sign',
            params: [nonce.nonce, from]
         })
         console.info('Attempting to sign nonce', signedMessage)

         const data: Web3AuthenticateDTO = {
            walletAddress: from,
            signature: signedMessage ?? '',
            nonce: nonce.nonce,
            provider: 'google',
            idToken: userInfo.idToken
         }
         console.info('Web3AuthenticateDTO', data)

         const result = await signIn('google', {
            redirect: false,
            walletAddress: from,
            signature: signedMessage,
            nonce: nonce.nonce,
            idToken: userInfo.idToken
         })

         if (result?.error) {
            toast.error(`Failed to create session: ${result.error}`)
         } else {
            toast.success('Successfully logged with Google')
            setLoading(false)
            if (noRedirect) {
               onClose()
            } else {
               router.refresh()
               router.push(home_routes.summary)
            }
         }
      } catch (error) {
         console.error('Login error:', error)
         if (error instanceof Error) {
            if (error.message.includes('Already connected')) {
               toast.info('Already connected. Please disconnect first.')
            } else {
               toast.error(`Login failed: ${error.message}`)
            }
         }
      } finally {
         setLoading(false)
      }
   }

   const handleClearSession = async (reload: boolean = true) => {
      localStorage.clear()
      setLoggedIn(false)
      setProvider(null)

      if (reload && typeof window !== 'undefined') {
         window.location.reload()
      }
   }

   //    const walletClient =
   //       typeof window !== undefined && window.ethereum
   //          ? createWalletClient({
   //               chain: sepolia,
   //               transport: custom(window.ethereum!)
   //            })
   //          : null

   //    const handleMetamaskAuth = async (e: React.MouseEvent<HTMLElement>) => {
   //       console.info('Starting Metamask authentication')
   //       e.preventDefault()

   //       try {
   //          if (!walletClient) {
   //             toast.error('No wallet providers available. Try installing Metamask or another wallet provider.')
   //             return
   //          }

   //          const [account] = await walletClient.getAddresses().catch((error) => {
   //             return []
   //          })

   //          console.info('Checking account', account)
   //          if (!account) {
   //             toast.error('Failed to found provider.')
   //             toast.info('Try open your Metamask extension.')
   //             return
   //          }

   //          const nonce = await getNounce()

   //          if (!nonce) {
   //             toast.error('Failed to get nonce. Please try again.')
   //             return
   //          }

   //          const signedMessage = await walletClient
   //             .signMessage({
   //                account,
   //                message: nonce.nonce
   //             })
   //             .catch((error) => {
   //                return ''
   //             })

   //          if (!signedMessage) {
   //             toast.error('Failed to sign message. Please try again.')
   //             return
   //          }

   //          console.info('Preparing authentication data')
   //          const data: Web3AuthenticateDTO = {
   //             walletAddress: account,
   //             signature: signedMessage ?? '',
   //             nonce: nonce.nonce,
   //             provider: 'wallet'
   //          }

   //          const response = await web3GoogleAuthenticate(data)

   //          if (response.status === 404) {
   //             toast.info('User not found. Please register first.')
   //             handleClearSession(false)
   //             onRegister?.()
   //             return
   //          }

   //          if (!String(response.status).includes('20')) {
   //             toast.error(response.reason)
   //             return
   //          }

   //          const result = await signIn('wallet', {
   //             redirect: false,
   //             walletAddress: account,
   //             signature: signedMessage,
   //             nonce: nonce.nonce
   //          })

   //          if (result?.error) {
   //             toast.error(`Failed to create session: ${result.error}`)
   //          } else {
   //             toast.success('Successfully logged with Metamask.')
   //             setLoading(false)
   //             if (noRedirect) {
   //                onClose()
   //             } else {
   //                router.refresh()
   //                router.push(home_routes.summary)
   //             }
   //          }
   //       } catch (error) {
   //          console.error('Metamask login error:', error)
   //       }
   //    }

   const { handleMetamaskAuth } = useMetamaskAuth()

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
                  <Button.Button
                     variant="outline"
                     className="px-4 py-2"
                     onClick={(e) =>
                        handleMetamaskAuth(e, {
                           onSuccess: () => router.push(home_routes.summary),
                           noRedirect,
                           onRegister,
                           onClose
                        })
                     }
                  >
                     <MetamaskLogo className="w-6" />
                     <span className="text-base font-semibold">Continue with Metamask</span>
                  </Button.Button>
                  <div className="space-y-2">
                     <Button.Button
                        variant="outline"
                        className="px-4 py-2"
                        onClick={(e) => {
                           if (sessionState) {
                              handleClearSession()
                           } else {
                              handleGoogleAuth(e)
                           }
                        }}
                     >
                        <GoogleIcon className="w-6" />
                        <span className="text-base font-semibold">{sessionState ? 'Disconnect' : 'Continue with Google'}</span>
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
