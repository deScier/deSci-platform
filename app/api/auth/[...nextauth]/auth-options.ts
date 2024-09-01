import { loginUserService } from '@/services/user/login.service'
import { UserProps } from '@/types/user'
import { NextAuthOptions, Session, User } from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
   secret: process.env.NEXTAUTH_SECRET,
   session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
   providers: [
      CredentialsProvider({
         id: 'credentials',
         name: 'Login with credentials',
         credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' }
         },
         async authorize(credentials): Promise<User | null> {
            try {
               console.log('credentials', credentials)

               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     email: credentials?.email,
                     password: credentials?.password
                  })
               })

               const data: { user: UserProps; token: string } = await response.json()
               console.log('data', data)

               const user = {
                  ...{ email: credentials?.email },
                  id: data.user.id,
                  token: data.token,
                  userInfo: data.user
               }

               console.log('user', user)

               return user
            } catch (error) {
               console.error('Auth error on id: credentials', error)
               return null
            }
         }
      }),
      CredentialsProvider({
         id: 'wallet',
         name: 'Login with wallet (Metamask)',
         credentials: {
            walletAddress: { label: 'Wallet Address', type: 'text' },
            signature: { label: 'Signature', type: 'text' },
            nonce: { label: 'Nonce', type: 'text' }
         },
         async authorize(credentials): Promise<User | null> {
            if (!credentials) return null

            const { web3GoogleAuthenticate } = loginUserService()

            try {
               const data = {
                  walletAddress: credentials.walletAddress,
                  signature: credentials.signature,
                  nonce: credentials.nonce,
                  provider: 'wallet'
               }

               const response: { user: UserProps; token: string } = await web3GoogleAuthenticate(data)

               const user = {
                  ...{ email: response.user.email },
                  id: response.user.id,
                  token: response.token,
                  userInfo: response.user
               }

               return user
            } catch (error) {
               console.error('Auth error on id: wallet', error)
               return null
            }
         }
      }),
      CredentialsProvider({
         id: 'google',
         name: 'Login with Google (Web3 Auth)',
         credentials: {
            walletAddress: { label: 'Wallet Address', type: 'text' },
            signature: { label: 'Signature', type: 'text' },
            nonce: { label: 'Nonce', type: 'text' },
            idToken: { label: 'Id Token', type: 'text' }
         },
         async authorize(credentials): Promise<User | null> {
            console.log('credentials', credentials)
            if (!credentials) return null

            const { web3GoogleAuthenticate } = loginUserService()

            try {
               const data = {
                  walletAddress: credentials.walletAddress,
                  signature: credentials.signature,
                  nonce: credentials.nonce,
                  provider: 'google',
                  idToken: credentials.idToken
               }

               const response: { user: UserProps; token: string } = await web3GoogleAuthenticate(data)

               const user = {
                  ...{ email: response.user.email },
                  id: response.user.id,
                  token: response.token,
                  userInfo: response.user
               }

               return user
            } catch (error) {
               console.error('Auth error on id: wallet', error)
               return null
            }
         }
      })
   ],
   pages: {
      signIn: '/home',
      error: '/error'
   },
   callbacks: {
      async jwt({ token, account, session, trigger, profile, user }) {
         if (trigger === 'update' && session) {
            return { ...token, ...session?.user }
         }

         if (account?.type === 'credentials') {
            const obj = {
               ...token,
               ...user,
               ...profile,
               ...account
            }
            return obj
         }

         // This return is necessary for
         // pass the token to the session callback
         return { ...token, ...user, ...profile, ...account }
      },

      async session({ session, token }): Promise<Session> {
         const user_infos = {
            name: token?.name,
            email: token?.email,
            token: token?.token,
            googleId: token?.googleId,
            redirectToRegister: token?.redirectToRegister || false,
            userInfo: { ...(token?.userInfo as object) }
         }
         return {
            user: { ...user_infos }
         } as Session
      }
   }
}
