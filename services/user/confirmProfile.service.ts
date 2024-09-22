export const confirmProfileService = async (data: ConfirmProfileRequestProps) => {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/confirm-profile`, {
      method: 'PATCH',
      headers: {
         'content-type': 'application/json'
      },
      body: JSON.stringify(data)
   })

   const profileData = await response.json()

   if (response.status === 201) {
      return {
         success: true,
         message: 'Register user successfully'
      }
   }

   return {
      success: false,
      message: 'Error in register user'
   }
}

export type ConfirmProfileRequestProps = {
   nconfirmationCode: string
   userEmail: string
}
