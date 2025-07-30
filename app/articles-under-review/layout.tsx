import Footer from '@/components/common/Footer/Footer';
import { SidebarMobile } from '@/components/common/Sidebar/Mobile/Sidebar';
import Profile from '@/components/common/Sidebar/Profile/Profile';
import Sidebar from '@/components/common/Sidebar/Sidebar';
import '@styles/layout.css';
import React from 'react';

export default function ArticlesUnderReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <section className="home scrollbar-hidden md:grid-cols-1">
        <div>
          <Sidebar />
          <SidebarMobile />
        </div>
        <div className="col-2 row-1 my-0 mb-10 mx-6 lg:my-10 lg:mx-2 ">{children}</div>
        <Profile />
      </section>
      <Footer />
    </React.Fragment>
  );
}
