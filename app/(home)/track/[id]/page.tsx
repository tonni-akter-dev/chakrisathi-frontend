import React, { Suspense } from 'react'
import TrackDetail from './TrackDetails'

const page = () => {
  return (
    <div>
        <Suspense
        fallback={
          <div className="hidden lg:block w-64 bg-white border-r border-slate-200"></div>
        }
      >
        <TrackDetail />
      </Suspense>
    </div>
  )
}

export default page
