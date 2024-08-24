import '@styles/login.css'

import * as Step from '@/components/common/Steps/Steps'

import { useLoading } from '@/hooks/useLoading'
import { home_routes } from '@/routes/home'
import { RegisterProps, RegisterSchema } from '@/schemas/register'
import { registerUserService } from '@/services/user/register.service'
import { RegisterModalProps } from '@components/modules/Register/Typing'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { X } from 'react-bootstrap-icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import LoginAnimation from '@components/modules/Login/Animation/Animation'
import React from 'react'

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
      start()

      const response = await registerUserService({
         name: data.name,
         email: data.email,
         password: data.password
      })

      stop()

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
         <div className="grid md:grid-cols-2 relative min-h-[700px]">
            <LoginAnimation />
            <X
               size={32}
               className="absolute z-20 bg-white rounded-md right-4 top-4 cursor-pointer hover:scale-110 transition-all duration-200"
               onClick={onClose}
            />
            <div className="w-full grid gap-6 md:p-16 relative p-6 pb-12">
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
            </div>
         </div>
      </form>
   )
}

export default RegisterModal
