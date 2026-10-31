import React, { Suspense } from 'react'
import AdminApplicationDetails from './AdminApplicationDetails'

const page = () => {
  return (
    <div>
        <Suspense
        fallback={
          <div className="hidden lg:block w-64 bg-white border-r border-slate-200"></div>
        }
      >
        <AdminApplicationDetails />
      </Suspense>
    </div>
  )
}

export default page
