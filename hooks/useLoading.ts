'use client'

import React from 'react'

export function useLoading() {
   const [loading, setLoading] = React.useState({ loading: false })

   const start = () => {
      setLoading((prevState) => ({ ...prevState, loading: true }))
   }

   const stop = () => {
      setLoading((prevState) => ({ ...prevState, loading: false }))
   }

   return {
      loading,
      start,
      stop
   }
}
