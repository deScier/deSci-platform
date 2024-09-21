import '@styles/layout.css'

import { HeaderMobile } from '@/components/common/Header/HeaderHome'

import Footer from '@/components/common/Footer/Footer'
import Header from '@/components/common/Header/Header'
import React from 'react'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
   return (
      <main>
         <section className="relative bg-aquarela z-0 2xl:min-h-[100vh] overflow-x-hidden">
            <div className="lg:px-20 2xl:px-52">
               <div className="block ">
                  <HeaderMobile />
               </div>
               <div className="hidden lg:flex lg:pt-14 xl:pt-8 2xl:pt-14 z-10 justify-center">
                  <Header />
               </div>
            </div>
            <div className="z-10">{children}</div>
            <Footer />
         </section>
      </main>
   )
}
