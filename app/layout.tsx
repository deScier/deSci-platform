import ProgressBar from '@/lib/nprogress'
import { MaterialTailwindThemeProvider } from '@/lib/theme-provider'
import '@styles/globals.css'
import '@styles/utils.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'deScier Plataform - Decentralized Science',
   description:
      'A decentralized science-DeSci publishing platform uses blockchain technology and smart contracts to enable the publication and distribution of academic papers.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
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
            <ProgressBar />
            <MaterialTailwindThemeProvider>{children}</MaterialTailwindThemeProvider>
         </body>
      </html>
   )
}
