import { getSession } from 'next-auth/react'

export const addWalletService = async (data: AddWalletDTO) => {
   const session = await getSession()
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/add-wallet`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${session?.user?.token}` },
      body: JSON.stringify(data)
   })

   if (String(response.status).startsWith('20')) {
      return { success: true, message: 'Added wallet successfully', status: response.status }
   }

   const responseData = await response.json()
   const message = responseData.message ?? 'Error in add wallet.'

   return {
      success: false,
      message: message,
      status: response.status
   }
}

export type AddWalletDTO = {
   walletAddress: string
   signature: string
   nonce: string
}
