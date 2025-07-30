import '@styles/layout.css';

import Sidebar from '@/components/common/Sidebar/Sidebar';
import React from 'react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <section className="home">
        <Sidebar />
        <div className="col-2 row-1 m-16 pb-16">{children}</div>
      </section>
    </React.Fragment>
  );
}
