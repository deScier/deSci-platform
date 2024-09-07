import { signOut } from 'next-auth/react'

export const handleLogout = async (redirect: () => void) => {
   await signOut({ redirect: false })
   localStorage.clear()
   sessionStorage.clear()
   await new Promise((resolve) => setTimeout(resolve, 1000))
   redirect()
}
