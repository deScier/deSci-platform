import { HomeComponent } from '@/components/pages/Home/Home'

import React from 'react'

export default function HomePage() {
   return (
      <React.Suspense>
         <HomeComponent />
      </React.Suspense>
   )
}
