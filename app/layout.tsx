import '@styles/globals.css'
import '@styles/utils.css'
import 'keen-slider/keen-slider.min.css'
import 'react-toastify/dist/ReactToastify.css'

import { TooltipProvider } from '@/lib/tooltip'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './auth-provider'

import ProgressBar from '@/lib/nprogress'

export const metadata: Metadata = {
   title: 'deSci Publications - Decentralized Science',
   description:
      'A decentralized science-DeSci publishing platform uses blockchain technology and smart contracts to enable the publication and distribution of academic papers.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" className="antialiased">
         <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
               href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
               rel="stylesheet"
            />
         </head>
         <body>
            <TooltipProvider>
               <ProgressBar />
               <AuthProvider>{children}</AuthProvider>
               <ToastContainer />
            </TooltipProvider>
         </body>
      </html>
   )
}
