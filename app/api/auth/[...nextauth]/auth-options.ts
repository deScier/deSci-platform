import { NextAuthOptions, Session } from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const googleClientID = process.env.GOOGLE_ID || ''
const googleSecret = process.env.GOOGLE_SECRET || ''

export const authOptions: NextAuthOptions = {
   secret: process.env.NEXTAUTH_SECRET,
   session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
   providers: [
      CredentialsProvider({
         name: 'Sign in',
         credentials: {
            email: {
               label: 'Email',
               type: 'email',
               placeholder: 'example@example.com'
            },
            password: { label: 'Password', type: 'password' }
         },
         async authorize(credentials): Promise<any> {
            try {
               // Payload to send to the API
               const payload = {
                  email: credentials?.email || '',
                  password: credentials?.password || ''
               }

               // Send the payload to the API
               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     email: payload.email,
                     password: payload.password
                  })
               })

               if (response.status !== 200) {
                  throw new Error('To perform this function please log in first.')
               }

               // Get the response from the API
               const data = await response.json()

               // Desestructure the token from the response
               const token = data?.token

               return {
                  token,
                  ...{ email: credentials?.email },
                  userInfo: data.user
               }
            } catch (error) {
               console.log(error)
               return null
            }
         }
      }),
      CredentialsProvider({
         id: 'login-token',
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
         if (trigger === 'update' && session) {
            return { ...token, ...session?.user }
         }

         if (account?.type === 'credentials') {
            return {
               ...token,
               ...user,
               ...profile,
               ...account
            }
         }

         // If the user is signing in with google
         if (account?.type === 'oauth') {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth/google`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  email: profile?.email,
                  name: profile?.name,
                  googleId: account.providerAccountId,
                  avatar: profile?.image || token?.picture
               })
            })

            //
            // Implement login with web3auth
            // ----------------------------------------------------------------
            // 1. route to generate a nonce: /generate-nonce (GET) return a { nonce: string } object
            //
            // 1.5 se for metamask, assina com o viem. caso seja outro wallet, usar web3 auth (4)
            //
            // 2. com o hash da assinatura, envia para o endpoint: /users/web3-auth (POST) with body export type Web3AuthenticateDTO = { walletAddress: string, signature: string, nonce: string }
            //
            // 3. assinar com o viem: https://viem.sh/docs/actions/wallet/signMessage.html
            //
            // 4. assinar com web3 auth: https://github.com/Web3Auth/w3a-new-demo/blob/b5468c8251fe77b68ee5ca89a37de3eb755e2654/src/store/web3authStore.ts#L161

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
            redirectToRegister: token?.redirectToRegister || false,
            googleId: token?.googleId,
            userInfo: { ...(token?.userInfo as object) }
         }
         return {
            user: {
               ...user_infos
            }
         } as Session
      }
   }
}
