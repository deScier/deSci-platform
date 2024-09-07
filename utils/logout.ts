import { signOut } from 'next-auth/react'

export const handleLogout = async (redirect: () => void) => {
   redirect()
   await signOut({ redirect: false })
   localStorage.clear()
   sessionStorage.clear()
}
