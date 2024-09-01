import { loginUserService } from '@/services/user/login.service'
import { UserProps } from '@/types/user'
import { NextAuthOptions, Session, User } from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const googleClientID = process.env.GOOGLE_ID || ''
const googleSecret = process.env.GOOGLE_SECRET || ''

export const authOptions: NextAuthOptions = {
   secret: process.env.NEXTAUTH_SECRET,
   session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
   providers: [
      CredentialsProvider({
         id: 'credentials',
         name: 'Login with email',
         credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' }
         },
         async authorize(credentials): Promise<User | null> {
            try {
               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     email: credentials?.email,
                     password: credentials?.password
                  })
               })

               const data: { user: UserProps; token: string } = await response.json()

               const user = {
                  ...{ email: credentials?.email },
                  id: data.user.id,
                  token: data.token,
                  userInfo: data.user
               }

               return user
            } catch (error) {
               console.error('Auth error on id: credentials', error)
               return null
            }
         }
      }),
      CredentialsProvider({
         name: 'Update user info by token',
         credentials: {
            token: { label: 'Token', type: 'text' }
         },
         async authorize(credentials): Promise<any> {
            const token = credentials?.token

            const userInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
               }
            })

            if (userInfoResponse.status !== 200) {
               throw new Error('Error getting user basic info')
            }

            const userInfo = await userInfoResponse.json()

            return {
               token,
               email: userInfo?.email,
               userInfo: userInfo.user
            }
         }
      }),
      CredentialsProvider({
         id: 'wallet',
         name: 'Login with wallet',
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
      GoogleProvider({
         clientId: googleClientID,
         clientSecret: googleSecret,
         authorization: {
            params: {
               prompt: 'consent',
               access_type: 'offline',
               response_type: 'code'
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
         console.log('acc_type', account?.type)
         console.log('profile', profile)

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
            console.log('obj_credentials', obj)
            return obj
         }

         // If the user is signing in with google
         if (account?.type === 'oauth') {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth/google`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  email: profile?.email,
                  name: profile?.name,
                  avatar: profile?.image || token?.picture,
                  googleId: account.providerAccountId
               })
            })

            const data = await response.json()

            if (!data?.token) {
               return Promise.resolve({
                  ...data,
                  googleId: account?.providerAccountId,
                  redirectToRegister: true
               })
            }

            if (response.status !== 200) {
               throw new Error('To perform this function please log in first.')
            }

            token.token = data.token
            token.userInfo = data.user

            return {
               ...token,
               ...user,
               ...profile,
               ...account
            }
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
