import '@styles/login.css'

import * as Step from '@/components/common/Steps/Steps'
import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'

import { Separator } from '@/components/ui/separator'
import { useGoogleWeb3Auth } from '@/hooks/useGoogleWeb3Auth'
import { useLoading } from '@/hooks/useLoading'
import { useMetamaskAuth } from '@/hooks/useMetamaskAuth'
import { home_routes } from '@/routes/home'
import { RegisterProps, RegisterSchema } from '@/schemas/register'
import { addWalletService } from '@/services/user/addWallet.service'
import { registerUserService } from '@/services/user/register.service'
import { verifyEmailService } from '@/services/user/verifyEmail.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X } from 'react-bootstrap-icons'
import { FieldErrors, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'
import { toast } from 'react-toastify'
import { RegisterModalProps } from './Typing'

import LoginAnimation from '@/components/modules/Login/Animation/Animation'
import GoogleIcon from 'public/svgs/modules/login/google_icon.svg'
import MetamaskLogo from 'public/svgs/modules/login/metamask.svg'
import React from 'react'

/**
 * @title RegisterModal Component
 * @notice This component provides a user interface for registering a new account, including form validation and dynamic rendering based on registration status.
 */
const RegisterModal: React.FC<RegisterModalProps> = ({ onLogin, onClose, onBack }: RegisterModalProps) => {
   const router = useRouter()
   const { data: session, update } = useSession()

   /** @dev Initializes form handling and validation using useForm with Zod schema */
   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
      trigger
   } = useForm<RegisterProps>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: { name: '', email: '', password: '', wallet_address: null },
      reValidateMode: 'onChange'
   })

   const { loading, start, stop } = useLoading()

   const onSubmit: SubmitHandler<RegisterProps> = async (data) => {
      start()

      if (!data.email || !data.name || !data.password) {
         toast.error('Please fill in all fields.')
         stop()
         return
      }

      if (!data.email) {
         toast.error('Please enter a valid email.')
         stop()
         return
      }

      if (!data.name) {
         toast.error('Please enter your name.')
         stop()
         return
      }

      if (!data.password || data.password.length < 8) {
         toast.error('Please enter a password with at least 8 characters.')
         stop()
         return
      }

      try {
         const res = await registerUserService({
            name: data.name,
            email: data.email,
            password: data.password
         })

         if (!res.success) {
            toast.error('An error occurred during registration. Please try again.')
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

   const { handleGoogleAuth, handleGetGoogleAccount } = useGoogleWeb3Auth()
   const { handleMetamaskAuth, handleGetMetamaskAccount } = useMetamaskAuth()

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
               {currentStep === 1 && (
                  <React.Fragment>
                     <div className="space-y-1">
                        <h2 className="font-semibold text-1xl">Welcome to our platform</h2>
                        <p className="text-base">How would you like to sign up?</p>
                     </div>
                     <Input.Root>
                        <Input.Label>E-mail</Input.Label>
                        <Input.Input
                           {...register('email')}
                           type="email"
                           placeholder="Type your best email"
                           onChange={(e) => {
                              if (e.currentTarget.value === '') {
                                 trigger('email')
                              }
                              if (e.currentTarget.value !== '') {
                                 setValue('email', e.currentTarget.value)
                                 trigger('email')
                              }
                           }}
                        />
                        <Input.Error>{errors.email?.message}</Input.Error>
                     </Input.Root>
                  </React.Fragment>
               )}
               {currentStep === 1 && (
                  <Button.Button
                     loading={loading.loading}
                     variant="primary"
                     className="px-4 py-2"
                     onClick={async () => {
                        trigger('email')
                        if (watch('email') && !errors.email) {
                           start()
                           await verifyEmailService({ email: watch('email') }).then((res) => {
                              if (res) {
                                 nextStep()
                                 stop()
                              } else {
                                 toast.error('Email already in use.')
                                 stop()
                              }
                           })
                        } else {
                           toast.error('Please enter a valid email.')
                           stop()
                        }
                     }}
                  >
                     Continue
                  </Button.Button>
               )}
               {currentStep === 2 && (
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
                        <Input.Password
                           placeholder="Type your password"
                           {...register('password')}
                           id="password"
                           name="password"
                           autoComplete="new-password"
                        />
                        <Input.Error>{errors.password?.message}</Input.Error>
                     </Input.Root>
                  </React.Fragment>
               )}
               {currentStep === 2 && (
                  <Button.Button variant="primary" loading={loading.loading} className="px-4 py-2" onClick={() => nextStep()}>
                     Create account
                  </Button.Button>
               )}
               {currentStep === 3 && <RegisterStepThree register={register} errors={errors} />}
               {currentStep === 3 && (
                  <React.Fragment>
                     <div className="space-y-4">
                        <Button.Button
                           variant="outline"
                           className="px-4 py-2"
                           onClick={async () => {
                              const account = await handleGetMetamaskAccount()

                              if (account) {
                                 setValue('wallet_address', account.walletAddress)

                                 await addWalletService({
                                    walletAddress: account.walletAddress,
                                    signature: account.signature,
                                    nonce: account.nonce
                                 }).then(async (res) => {
                                    if (res.success) {
                                       toast.success('Connected wallet successfully.')

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
                           <MetamaskLogo className="w-6" />
                           <span className="text-base font-semibold">Connect with MetaMask</span>
                        </Button.Button>
                        <div className="space-y-2">
                           <Button.Button
                              variant="outline"
                              className="px-4 py-2"
                              onClick={async (e) => {
                                 const account = await handleGetGoogleAccount()

                                 if (account?.walletAddress) {
                                    setValue('wallet_address', account.walletAddress)

                                    await addWalletService({
                                       walletAddress: account.walletAddress,
                                       signature: account.signature,
                                       nonce: account.nonce
                                    }).then(async (res) => {
                                       if (res.success) {
                                          toast.success('Connected wallet successfully.')

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
                              <GoogleIcon className="w-6" />
                              <span className="text-base font-semibold">Connect with Google</span>
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
         <div className="space-y-2">
            <h2 className="font-semibold text-1xl">Your account is ready!</h2>
            <p className="text-base">
               To make the most of it, you can optionally register your wallet. This will enhance the security and authenticity of your transactions and
               publications, but it&apos;s not required to use the platform.
            </p>
            <p className="text-sm text-neutral-light_gray">Note: The wallet created through this process will be on the Polygon network.</p>
         </div>
      </React.Fragment>
   )
}

export default RegisterModal
