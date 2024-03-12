'use client'

import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

import React from 'react'

const MembersSchema = z.object({
   name: z.string({ required_error: 'Name is required' }),
   email: z.string({ required_error: 'Email is required' }),
   role: z.enum(['EDITOR_IN_CHIEF', 'MEMBER', 'EDITORIAL_BOARD_MEMBER'], { required_error: 'Role is required' })
})

const CreateJournalSchema = z.object({
   name: z.string({ required_error: 'Name is required' }),
   field: z.string({ required_error: 'Field is required' }),
   keywords: z.array(z.string(), { required_error: 'Keywords is required' }),
   rationale: z.string({ required_error: 'Rationale is required' }),
   originatesFrom: z.string({ required_error: 'Originates from is required' }),
   cover: z.string({ required_error: 'Cover is required' }),
   members: z.array(MembersSchema)
})

type CreateJournalDTO = {
   name: string
   field: string
   keywords: string[]
   rationale: string
   originatesFrom: string
   cover: string
   createdBy: string
   members: CreateMembersDTO[]
}

type CreateMembersDTO = {
   name: string
   email: string
   role: MembersRoles
}

type MembersRoles = 'EDITOR_IN_CHIEF' | 'MEMBER' | 'EDITORIAL_BOARD_MEMBER'

export default function NewJournalPage() {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isDirty },
      setValue,
      trigger,
      getValues,
      control,
      setError,
      clearErrors,
      unregister,
      reset,
      resetField
   } = useForm<CreateJournalDTO>({
      resolver: zodResolver(CreateJournalSchema),
      defaultValues: {
         name: '',
         field: '',
         keywords: [],
         rationale: '',
         originatesFrom: '',
         cover: '',
         createdBy: '',
         members: []
      }
   })

   const onSubmit: SubmitHandler<CreateJournalDTO> = async (data) => {
      console.log(data)
   }

   return <React.Fragment></React.Fragment>
}
