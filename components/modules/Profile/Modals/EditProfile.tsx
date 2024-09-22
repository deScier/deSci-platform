import Dropzone from '@/components/common/Dropzone/Dropzone'
import { StoredFile } from '@/components/common/Dropzone/Typing'
import { UpdateUserProps } from '@/schemas/update_user'
import { uploadAvatarService } from '@/services/file/file.service'
import { updateUserService } from '@/services/user/update.service'
import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { X } from 'react-bootstrap-icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import GenericSuccess from './Success'

/**
 *  @title UpdateProfile Component
 *  @notice This component allows the user to update their profile.
 *  @dev It includes form handling, profile updating, file uploading, and loading state.
 */
const UpdateProfile: React.FC<UpdateProfileProps> = ({
   onClose,
   onConfirm,
   name,
   image,
   title,
   success = false,
   edit_profile = true
}: UpdateProfileProps) => {
   /** @dev Initialize session hook */
   const { data: session, update: updateSession } = useSession()

   /** @dev Initialize form handling */
   const { register, handleSubmit } = useForm<UpdateUserProps>({})

   /** @dev Initialize loading state */
   const [loading, setLoading] = React.useState(false)
   /** @dev Initialize file state for the avatar */
   const [file, setFile] = React.useState<StoredFile | null>()
   /** @dev Initialize avatar preview state */
   const [avatarPreview, setAvatarPreview] = useState<string | undefined>(image)

   /** @dev Function to submit the form and update the profile */
   const onSubmit: SubmitHandler<UpdateUserProps> = async (data) => {
      /** @dev Set loading state to true */
      setLoading(true)
      /** @dev Update the user's profile */
      const response = await updateUserService(data)

      /** @dev If the profile update is not successful, show an error message */
      if (!response.success) {
         toast.error('Error in edit profile.')
         return
      }
      /** @dev If a new avatar is uploaded, upload the avatar and get the URL */
      let fileUrl = ''
      if (file) {
         fileUrl = await uploadAvatarService({
            fileLocalUrl: file.preview!,
            filename: file.name,
            mimetype: file.type
         })
      }

      /** @dev Update the session with the new profile information */
      const udpatedInfo = {
         ...session,
         user: {
            ...session?.user,
            name: data.name ?? session?.user?.userInfo.name,
            userInfo: {
               name: data.name ?? session?.user?.userInfo.name,
               title: data.title ?? session?.user?.userInfo.title,
               avatar: fileUrl || image
            }
         }
      }

      /** @dev Update the session */
      await updateSession(udpatedInfo)
      /** @dev Set loading state to false */
      setLoading(false)

      /** @dev Call the onConfirm function */
      onConfirm()
   }

   return (
      <React.Fragment>
         <X
            className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
            onClick={onClose}
         />
         {success && <GenericSuccess onClose={onClose} text="Profile updated" message="Your profile is now updated!" button_text="Done" />}
         {edit_profile && (
            <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
               <div className="grid gap-2">
                  <h3 className="text-xl font-semibold">Edit profile</h3>
               </div>
               <div className="flex flex-col md:flex-row items-center gap-6">
                  {avatarPreview ? (
                     <Image
                        quality={50}
                        width={160}
                        height={160}
                        alt="profile-image"
                        src={avatarPreview || '/images/profile_dk08wk.png'}
                        className="flex-shrink-0 w-40 h-40 rounded-full mx-auto my-0 lg:w-28 lg:h-28 2xl:w-36 2xl:h-36 object-cover"
                     />
                  ) : (
                     //  <div className="flex-shrink-0 flex justify-center items-center w-40 h-40 rounded-full mx-auto my-0">
                     //     <p className="text-5xl w-full px-6 text-center">{name.charAt(0).toUpperCase()}</p>
                     //  </div>
                     <Image
                        width={144}
                        quality={50}
                        height={144}
                        alt="profile-image"
                        src={'/images/profile_dk08wk.png'}
                        className="w-36 h-36 rounded-full mx-auto my-0 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36 object-cover"
                     />
                  )}
                  <div className="w-full">
                     <Dropzone
                        accept="images"
                        placeholder="Upload profile picture (.jpg, .jpeg, .png)"
                        setSelectedFile={(file) => {
                           setFile(file)
                           setAvatarPreview(file?.preview ?? image)
                        }}
                     />
                  </div>
               </div>
               <div className="flex flex-col md:flex-row items-center gap-4">
                  <Input.Root>
                     <Input.Label>Name</Input.Label>
                     <Input.Input defaultValue={name} placeholder="Your name" {...register('name')} />
                  </Input.Root>
                  <Input.Root>
                     <Input.Label optional>Expertise</Input.Label>
                     <Input.Input defaultValue={title} placeholder="Ex: Biologist, Chemist" {...register('title')} />
                  </Input.Root>
               </div>
               <div className="grid gap-4">
                  <Button.Button className="py-3 px-8" type="submit" loading={loading}>
                     Save updates
                  </Button.Button>
               </div>
            </form>
         )}
      </React.Fragment>
   )
}

interface UpdateProfileProps {
   name: string
   title: string
   image?: string
   success?: boolean
   edit_profile?: boolean
   onConfirm: () => void
   onClose: () => void
}

export default UpdateProfile
