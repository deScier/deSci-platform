import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'

import { MembersDTO, MembersSchema } from '@/schemas/create_new_journal'
import { AddNewMemberProps } from '@components/modules/Summary/NewJournal/AddNewMember/Typing'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqueId } from 'lodash'
import { SubmitHandler, useForm } from 'react-hook-form'

import React from 'react'

const AddNewMember: React.FC<AddNewMemberProps> = ({ onAddMember, onEditMember, onClose, onUpdateMember }: AddNewMemberProps) => {
   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      setValue,
      trigger,
      watch
   } = useForm<MembersDTO>({
      resolver: zodResolver(MembersSchema),
      defaultValues: {
         id: onEditMember ? onEditMember.id : uniqueId('member_'),
         email: onEditMember ? onEditMember.email : '',
         name: onEditMember ? onEditMember.name : '',
         role: onEditMember ? onEditMember.role : 'EDITOR_IN_CHIEF'
      }
   })

   const onSubmit: SubmitHandler<MembersDTO> = async (data) => {
      if (onEditMember) {
         onUpdateMember && onUpdateMember(data)
      } else {
         onAddMember && onAddMember(data)
      }
      onClose()
   }
   return (
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
         <Dialog.Title title="New member" onClose={onClose} />
         <div className="grid gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <Input.Root>
                  <Input.Label>Name</Input.Label>
                  <Input.Input {...register('name')} placeholder="Full name of the member" />
                  <Input.Error>{errors.name?.message}</Input.Error>
               </Input.Root>
               <Input.Root>
                  <Input.Label>Role</Input.Label>
                  <Input.Select
                     value={watch('role')}
                     options={[
                        { id: uniqueId(), value: 'EDITOR_IN_CHIEF', label: 'Editor-in-Chief' },
                        { id: uniqueId(), value: 'EDITORIAL_BOARD_MEMBER', label: 'Editorial Board Member' },
                        { id: uniqueId(), value: 'MEMBER', label: 'Member' }
                     ]}
                     onValueChange={(value) => {
                        const value_access = value as 'EDITOR_IN_CHIEF' | 'MEMBER' | 'EDITORIAL_BOARD_MEMBER'
                        setValue('role', value_access)
                        trigger('role')
                     }}
                     {...register('role')}
                  />
                  <Input.Error>{errors.role?.message}</Input.Error>
               </Input.Root>
            </div>
            <div className="grid md:grid-cols-2 items-center gap-6">
               <Input.Root>
                  <Input.Label>E-mail</Input.Label>
                  <Input.Input {...register('email')} placeholder="Ex: email@example.com" />
                  <Input.Error>{errors.email?.message}</Input.Error>
               </Input.Root>
            </div>
            <Button.Button type="submit" variant="primary">
               {onEditMember ? 'Update Member' : 'Add Member'}
            </Button.Button>
         </div>
      </form>
   )
}

export { AddNewMember }
