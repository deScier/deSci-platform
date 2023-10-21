import Footer from '@/components/common/Footer/Footer'
import Profile from '@/components/common/Profile/Profile'
import { SidebarMobile } from '@/components/common/Sidebar/Mobile/Sidebar'
import Sidebar from '@/components/common/Sidebar/Sidebar'
import '@styles/layout.css'
import React from 'react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
   return (
      <React.Fragment>
         <section className="home scrollbar-hidden md:grid-cols-1">
            <Sidebar />
            <SidebarMobile />
            <div className="col-2 row-1 my-0 mb-10 mx-6 lg:my-10 lg:mx-2 ">{children}</div>
            <Profile />
         </section>
         <Footer />
      </React.Fragment>
   )
}
