import '@styles/login.css'

import * as Step from '@/components/common/Steps/Steps'
import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'

import { useLoading } from '@/hooks/useLoading'
import { home_routes } from '@/routes/home'
import { RegisterProps, RegisterSchema } from '@/schemas/register'
import { registerUserService } from '@/services/user/register.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { ArrowLeft, BoxArrowRight, X } from 'react-bootstrap-icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { RegisterModalProps } from './Typing'

import SuccessIllustration from 'public/svgs/modules/login/register-success.svg'
import React from 'react'
import LoginAnimation from '../Login/Animation/Animation'

/**
 * @title RegisterModal Component
 * @notice This component provides a user interface for registering a new account, including form validation and dynamic rendering based on registration status.
 */
const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister, onBack, onLogin, onReturnToLogin }: RegisterModalProps) => {
   /** @dev Initializes form handling and validation using useForm with Zod schema */
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors }
   } = useForm<RegisterProps>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
   })

   /** @dev Initialize loading state management */
   const { loading, start, stop } = useLoading()

   /** @dev State to manage the current component view */
   const success_component = 'success'
   const [component, setComponent] = React.useState('')

   /**
    * @dev Submits registration data to server
    * @param data Contains user input from registration form
    */
   const onSubmit: SubmitHandler<RegisterProps> = async (data) => {
      start('loading')

      const response = await registerUserService({
         name: data.name,
         email: data.email,
         password: data.password
      })

      stop('loading')

      if (response.success) {
         setComponent(success_component)
         return
      }

      toast.error(response.message)
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
      if (currentStep < 3) {
         updateProgress(currentStep + 1)
      }
   }

   const prevStep = () => {
      if (currentStep > 1) {
         updateProgress(currentStep - 1)
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid md:grid-cols-2 relative">
            <LoginAnimation />
            <X
               size={32}
               className="absolute z-20 bg-white rounded-md right-4 top-4 cursor-pointer hover:scale-110 transition-all duration-200"
               onClick={onClose}
            />
            <div className="w-ful grid gap-6 md:p-16 relative p-6 pb-12">
               {component !== success_component && (
                  <React.Fragment>
                     <X
                        size={32}
                        className="hidden md:absolute right-4 top-4 cursor-pointer hover:scale-110 transition-all duration-200"
                        onClick={onClose}
                     />
                     <div className="flex items-center gap-4">
                        <ArrowLeft size={28} onClick={onBack} />
                        <h2 className="font-semibold text-1xl">Register</h2>
                     </div>
                  </React.Fragment>
               )}
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
               <div className="space-y-1">
                  <h2 className="font-semibold text-1xl">Welcome to our platform</h2>
                  <p className="text-base">How would you like to sign up?</p>
               </div>
               {component === success_component && (
                  <React.Fragment>
                     <h2 className="font-semibold text-1xl">Almost there!</h2>
                     <SuccessIllustration className="w-full md:w-96" />
                     <div className="grid gap-6">
                        <p className="text-base">Your account creation is almost complete -We’ve sent an account validation link to your e-mail inbox.</p>
                        <Button.Button variant="outline" onClick={onReturnToLogin}>
                           Return to login
                        </Button.Button>
                     </div>
                  </React.Fragment>
               )}
               {component !== success_component && (
                  <div className="grid gap-6">
                     <div className="grid gap-4">
                        <h2 className="font-semibold text-lg text-center text-neutral-gray">or</h2>
                        <Input.Root>
                           <Input.Label>Name</Input.Label>
                           <Input.Input type="text" placeholder="Type your name" {...register('name')} />
                           <Input.Error>{errors.name?.message}</Input.Error>
                        </Input.Root>
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
                        <Input.Root>
                           <Input.Label>Password confirmation</Input.Label>
                           <Input.Password placeholder="Type your password again" {...register('confirmPassword')} />
                           <Input.Error>{errors.confirmPassword?.message}</Input.Error>
                        </Input.Root>
                     </div>
                     <Button.Button loading={loading.loading} type="submit" onClick={onRegister}>
                        Register now
                        <BoxArrowRight size={24} />
                     </Button.Button>
                     <p
                        className="text-secundary_blue-main text-sm text-center cursor-pointer transition-all hover:underline hover:text-primary-hover underline hover:font-semibold duration-300"
                        onClick={onLogin}
                     >
                        Already have an account? Login here.
                     </p>
                  </div>
               )}
            </div>
         </div>
      </form>
   )
}

const RegisterStepOne: React.FC = () => {
   return <React.Fragment></React.Fragment>
}

const RegisterStepTwo: React.FC = () => {
   return <React.Fragment></React.Fragment>
}

const RegisterStepThree: React.FC = () => {
   return <React.Fragment></React.Fragment>
}

export default RegisterModal
