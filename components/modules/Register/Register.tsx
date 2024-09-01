import '@styles/login.css'

import * as Step from '@/components/common/Steps/Steps'
import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'

import { Separator } from '@/components/ui/separator'
import { useLoading } from '@/hooks/useLoading'
import { home_routes } from '@/routes/home'
import { RegisterProps, RegisterSchema } from '@/schemas/register'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { ArrowLeft, X } from 'react-bootstrap-icons'
import { FieldErrors, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'
import { RegisterModalProps } from './Typing'

import { AddWalletDTO, loginUserService } from '@/services/user/login.service'
import { registerUserService } from '@/services/user/register.service'
import { useRouter } from 'next/navigation'
import GoogleIcon from 'public/svgs/modules/login/google_icon.svg'
import MetamaskLogo from 'public/svgs/modules/login/metamask.svg'
import React from 'react'
import { toast } from 'react-toastify'
import { createWalletClient, custom, EIP1193EventMap, EIP1193RequestFn, EIP1474Methods } from 'viem'
import { sepolia } from 'viem/chains'
import LoginAnimation from '../Login/Animation/Animation'

import { useSyncProviders } from '@/hooks/useSyncProviders'
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

/**
 * @title RegisterModal Component
 * @notice This component provides a user interface for registering a new account, including form validation and dynamic rendering based on registration status.
 */
const RegisterModal: React.FC<RegisterModalProps> = ({ onLogin, onClose, onBack }: RegisterModalProps) => {
   const router = useRouter()
   const { data: session } = useSession()
   console.log('register_session', session)

   /** @dev Initializes form handling and validation using useForm with Zod schema */
   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm<RegisterProps>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: { name: '', email: '', password: '', wallet_address: null }
   })

   /** @dev Initialize loading state management */
   const { loading, start, stop } = useLoading()

   /**
    * @dev Submits registration data to server
    * @param data Contains user input from registration form
    */
   const onSubmit: SubmitHandler<RegisterProps> = async (data) => {
      start()
      try {
         const res = await registerUserService({
            name: data.name,
            email: data.email,
            password: data.password
         })

         if (!res.success) {
            toast.error(res.message)
            stop()
            return
         }

         const signInRes = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password
         })

         if (signInRes?.error) {
            toast.error('Login error. Check your credentials.')
            return
         }

         updateProgress(currentStep + 1)
         toast.success('Register user successfully.')
      } catch (error) {
         toast.error('An error occurred during registration. Please try again.')
         console.error('Registration error:', error)
      } finally {
         stop()
      }
   }
   /**
    * @dev Handles third-party login using Google
    * @param e The mouse event from the click
    */
   const loginWithGoogle = async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      await signIn('google', { callbackUrl: home_routes.summary })
   }

   const [currentStep, setCurrentStep] = React.useState(1)
   const [completed, setCompleted] = React.useState([0, 0, 0])
   const [allCompleted, setAllCompleted] = React.useState(false)

   const updateProgress = (step: number) => {
      setCurrentStep(step)
      const newCompleted = completed.map((_, i) => (i < step - 1 ? 1 : 0))
      setCompleted(newCompleted)
      setAllCompleted(newCompleted.every((status) => status === 1))
   }

   const nextStep = () => {
      if (currentStep === 2) {
         handleSubmit(onSubmit)()
         return
      }
      if (currentStep < 3) {
         updateProgress(currentStep + 1)
      }
   }

   const prevStep = () => {
      if (currentStep > 1) {
         updateProgress(currentStep - 1)
      }
   }

   const [provider, setProvider] = React.useState<IProvider | null>(null)
   const [web3auth, setWeb3auth] = React.useState<Web3AuthNoModal | null>(null)
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

   const { getNounce, addWalletAddress } = loginUserService()

   const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(
         (
            window as Window & {
               ethereum?:
                  | {
                       on: <event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]) => void
                       removeListener: <event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]) => void
                       request: EIP1193RequestFn<EIP1474Methods>
                    }
                  | undefined
            }
         ).ethereum!
      )
   })

   const handleMetamaskAuth = async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()

      try {
         const [account] = await walletClient.getAddresses()
         console.log('account', account)

         const nonce = await getNounce()

         const signedMessage = await walletClient.signMessage({
            account,
            message: nonce.nonce
         })

         const data: AddWalletDTO = {
            walletAddress: account,
            signature: signedMessage ?? '',
            nonce: nonce.nonce
         }

         console.log('Web3AuthenticateDTO', data)

         const response = await addWalletAddress(data, session?.user?.token as string)

         if (String(response.status).includes('40')) {
            toast.error(response.message)
            return
         }

         if (String(response.status).includes('20')) {
            toast.success('Wallet added successfully')
            router.refresh()
            router.push(home_routes.summary)
            return
         }
      } catch (error) {
         console.error(error)
         toast.error('An error occurred during authentication')
      }
   }

   const [selectedWallet, setSelectedWallet] = React.useState<EIP6963ProviderDetail>()
   const [userAccount, setUserAccount] = React.useState<string>('')
   const providers = useSyncProviders()

   console.log('metamask', {
      selected_wallet: selectedWallet,
      user_account: userAccount,
      providers: providers
   })

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid md:grid-cols-2 relative">
            <LoginAnimation />
            <X
               size={32}
               className="absolute z-20 bg-white rounded-md right-4 top-4 cursor-pointer hover:scale-110 transition-all duration-200 hover:cursor-pointer"
               onClick={() => onClose()}
            />
            <div className="w-ful grid gap-6 md:p-16 relative p-6 pb-12 min-h-[590.5px] content-center">
               <X
                  size={32}
                  className="hidden md:absolute right-4 top-4 cursor-pointer hover:scale-110 transition-all duration-200 hover:cursor-pointer"
                  onClick={onClose}
               />
               <div className="flex items-center gap-4">
                  <ArrowLeft
                     size={28}
                     className="cursor-pointer hover:scale-110 transition-all duration-200"
                     onClick={() => {
                        if (currentStep === 1) {
                           onBack()
                        } else {
                           prevStep()
                        }
                     }}
                  />
                  <h2 className="font-semibold text-1xl">Register</h2>
               </div>
               <div>
                  <Step.Root>
                     <Step.Indicator
                        last_item={false}
                        total_items={3}
                        current={currentStep}
                        step={1}
                        completed={completed[0]}
                        all_completed={allCompleted}
                     />
                     <Step.Indicator
                        last_item={false}
                        total_items={3}
                        current={currentStep}
                        step={2}
                        completed={completed[1]}
                        all_completed={allCompleted}
                     />
                     <Step.Indicator last_item total_items={3} current={currentStep} step={3} completed={completed[2]} all_completed={allCompleted} />
                  </Step.Root>
               </div>
               {currentStep === 1 && <RegisterStepOne register={register} errors={errors} />}

               {currentStep === 1 && (
                  <Button.Button variant="primary" className="px-4 py-2" onClick={() => nextStep()}>
                     Continue
                  </Button.Button>
               )}

               {currentStep === 1 && (
                  <React.Fragment>
                     <div className="relative">
                        <Separator color="#A9A9A9" className="h-[0.5px]" />
                        <p className="text-base p-2 px-3 text-neutral-light_gray absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white">
                           or
                        </p>
                     </div>
                     <Button.Button disabled variant="outline" className="px-4 py-2">
                        <MetamaskLogo className="w-6" />
                        <span className="text-base font-semibold">Login with wallet</span>
                     </Button.Button>
                     <p className="text-secundary_blue-main text-sm text-center" onClick={() => onBack()}>
                        Already have an account?{' '}
                        <span
                           className="underline hover:text-primary-hover duration-200 cursor-pointer transition-all hover:underline"
                           onClick={() => onLogin()}
                        >
                           Login here.
                        </span>
                     </p>
                  </React.Fragment>
               )}

               {currentStep === 2 && <RegisterStepTwo register={register} errors={errors} />}

               {currentStep === 2 && (
                  <Button.Button variant="primary" loading={loading.loading} className="px-4 py-2" onClick={() => nextStep()}>
                     Create account
                  </Button.Button>
               )}

               {currentStep === 3 && <RegisterStepThree register={register} errors={errors} />}

               {currentStep === 3 && (
                  <React.Fragment>
                     <div className="space-y-4">
                        {/* 
                        // Implement adding wallet via metamask and google
                        // --------------------------------------------------
                        // TODO: implement adding wallet via metamask and google
                        */}
                        <Button.Button disabled variant="outline" className="px-4 py-2" onClick={(e) => handleMetamaskAuth(e)}>
                           <MetamaskLogo className="w-6" />
                           <span className="text-base font-semibold">Add wallet with Metamask</span>
                        </Button.Button>
                        <div className="space-y-2">
                           <Button.Button
                              disabled
                              variant="outline"
                              className="px-4 py-2"
                              onClick={(e) => {
                                 //    if (sessionState) {
                                 //       handleClearSession()
                                 //    } else {
                                 //       handleGoogleAuth(e)
                                 //    }
                              }}
                           >
                              <GoogleIcon className="w-6" />
                              <span className="text-base font-semibold">Add wallet with Google</span>
                           </Button.Button>
                           <p className="text-[10px] font-regular text-neutral-light_gray text-center">
                              When connecting via Google, a self-custodial digital wallet will be created using Web3Auth. You will have full control over
                              your assets.
                           </p>
                        </div>
                     </div>
                     <div className="relative">
                        <Separator color="#A9A9A9" className="h-[0.5px]" />
                        <p className="text-base p-2 px-3 text-neutral-light_gray absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white">
                           or
                        </p>
                     </div>
                     <Button.Button
                        variant="outline"
                        className="px-4 py-2"
                        onClick={() => {
                           router.refresh()
                           router.push(home_routes.summary)
                        }}
                     >
                        Go to dashboard
                     </Button.Button>
                  </React.Fragment>
               )}
            </div>
         </div>
      </form>
   )
}

type RegisterStepProps = {
   register: UseFormRegister<RegisterProps>
   errors: FieldErrors<RegisterProps>
}

const RegisterStepOne: React.FC<RegisterStepProps> = ({ register, errors }: RegisterStepProps) => {
   return (
      <React.Fragment>
         <div className="space-y-1">
            <h2 className="font-semibold text-1xl">Welcome to our platform</h2>
            <p className="text-base">How would you like to sign up?</p>
         </div>
         <Input.Root>
            <Input.Label>E-mail</Input.Label>
            <Input.Input type="email" placeholder="Type your best email" {...register('email')} />
            <Input.Error>{errors.email?.message}</Input.Error>
         </Input.Root>
      </React.Fragment>
   )
}

const RegisterStepTwo: React.FC<RegisterStepProps> = ({ register, errors }: RegisterStepProps) => {
   return (
      <React.Fragment>
         <div className="space-y-1">
            <h2 className="font-semibold text-1xl">Complete your profile</h2>
            <p className="text-base">Fill in your details to start exploring our platform.</p>
         </div>
         <Input.Root>
            <Input.Label htmlFor="name">Name</Input.Label>
            <Input.Input placeholder="Type your full name" {...register('name')} id="name" name="name" type="text" autoComplete="new-name" />
            <Input.Error>{errors.name?.message}</Input.Error>
         </Input.Root>

         <Input.Root>
            <Input.Label htmlFor="password">Password</Input.Label>
            <Input.Password placeholder="Type your password" {...register('password')} id="password" name="password" autoComplete="new-password" />
            <Input.Error>{errors.password?.message}</Input.Error>
         </Input.Root>
      </React.Fragment>
   )
}

const RegisterStepThree: React.FC<RegisterStepProps> = ({}: RegisterStepProps) => {
   return (
      <React.Fragment>
         <div className="space-y-1">
            <h2 className="font-semibold text-1xl">Your account is ready!</h2>
            <p className="text-base">
               To make the most of it, register your wallet. This will ensure the security and authenticity of your transactions and publications.
            </p>
         </div>
      </React.Fragment>
   )
}

export default RegisterModal

interface EIP6963ProviderInfo {
   rdns: string
   uuid: string
   name: string
   icon: string
}

interface EIP6963ProviderDetail {
   info: EIP6963ProviderInfo
   provider: EIP1193Provider
}

type EIP6963AnnounceProviderEvent = {
   detail: {
      info: EIP6963ProviderInfo
      provider: Readonly<EIP1193Provider>
   }
}

interface EIP1193Provider {
   isStatus?: boolean
   host?: string
   path?: string
   sendAsync?: (request: { method: string; params?: Array<unknown> }, callback: (error: Error | null, response: unknown) => void) => void
   send?: (request: { method: string; params?: Array<unknown> }, callback: (error: Error | null, response: unknown) => void) => void
   request: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>
}

const formatBalance = (rawBalance: string) => {
   const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
   return balance
}

const formatChainAsNum = (chainIdHex: string) => {
   const chainIdNum = parseInt(chainIdHex)
   return chainIdNum
}

const formatAddress = (addr: string) => {
   const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2)
   return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(39)}`
}
