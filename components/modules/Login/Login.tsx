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

   /**
    * @dev Handles third-party login using Google
    * @param e The mouse event from the click
    */
   const loginWithGoogle = async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      await signIn('google', { callbackUrl: home_routes.summary })
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
                  <Button.Button variant="outline" className="px-4 py-2" onClick={() => {}}>
                     <MetamaskLogo className="w-6" />
                     <span className="text-base font-semibold">Continue with wallet</span>
                  </Button.Button>
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
