import { UserProps } from './user'

export type UserSession = {
   name?: string
   email: string
   token: string
   userInfo: UserProps
   redirectToRegister?: boolean
   googleId?: string
   role: string
   picture: string | null
}

declare module 'next-auth' {
   interface Session {
      user?: UserSession
   }
}
