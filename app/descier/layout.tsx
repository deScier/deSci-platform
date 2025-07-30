import "@styles/layout.css";

import { SidebarMobile } from "@/components/common/Sidebar/Mobile/Sidebar";

import Footer from "@/components/common/Footer/Footer";
import ProfileDeScier from "@/components/common/Sidebar/Profile/deScier/Profile";
import SidebarDeScier from "@/components/common/Sidebar/deScier/SidebarDeScier";
import React from "react";

export default function DeScierLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <section className="home scrollbar-hidden md:grid-cols-1">
        <div>
          <SidebarDeScier />
          <SidebarMobile />
        </div>
        <div className="col-2 row-1 my-0 mb-10 mx-6 lg:my-10 lg:mx-2 ">{children}</div>
        <ProfileDeScier />
      </section>
      <Footer />
    </React.Fragment>
  );
}
