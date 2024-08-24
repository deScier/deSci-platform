import { getSession } from 'next-auth/react'

export const addWalletService = async (data: AddWalletProps) => {
   const session = await getSession()
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/add-wallet`, {
      method: 'PATCH',
      headers: {
         'content-type': 'application/json',
         authorization: `Bearer ${session?.user?.token}`
      },
      body: JSON.stringify(data)
   })

   if (response.status === 201) {
      return {
         success: true,
         message: 'Added wallet successfully'
      }
   }

   const responseData = await response.json()
   const message = responseData.message ?? 'Error in add wallet.'

   return {
      success: false,
      message: message
   }
}

type AddWalletProps = {
   walletAddress: string
}
