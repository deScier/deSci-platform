import { loginUserService } from '@/services/user/login.service'
import { UserProps } from '@/types/user'
import { NextAuthOptions, Session, User } from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
   secret: process.env.NEXTAUTH_SECRET,
   session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
   cookies: {
      sessionToken: {
         name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
         }
      },
      callbackUrl: {
         name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
         }
      },
      csrfToken: {
         name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.csrf-token`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
         }
      },
      pkceCodeVerifier: {
         name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.pkce.code_verifier`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 900
         }
      },
      state: {
         name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.state`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 900
         }
      },
      nonce: {
         name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.nonce`,
         options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
         }
      }
   },
   providers: [
      CredentialsProvider({
         id: 'credentials',
         name: 'Login with credentials',
         credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
            wallet_address: { label: 'Wallet Address', type: 'text' }
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
         id: 'wallet',
         name: 'Login with wallet (MetaMask)',
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
         clientId: process.env.GOOGLE_ID as string,
         clientSecret: process.env.GOOGLE_SECRET as string,
         authorization: {
            params: {
               prompt: 'consent',
               access_type: 'offline',
               response_type: 'code',
               scope: 'openid profile email'
            }
         },
         httpOptions: {
            timeout: 10000
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
