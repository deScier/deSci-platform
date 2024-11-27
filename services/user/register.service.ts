export const registerUserService = async (data: RegisterRequestProps) => {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
   })

   if (String(response.status).startsWith('20')) {
      return {
         success: true,
         message: 'User registered successfully'
      }
   }

   const responseData = await response.json()
   const message = responseData.message ?? 'Error in register user.'

   return {
      success: false,
      message: message
   }
}

export type RegisterRequestProps = {
   name: string
   email: string
   password: string
   walletAddress?: string | null
}
