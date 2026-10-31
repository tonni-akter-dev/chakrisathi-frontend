import React, { Suspense } from 'react'
import EditCircular from './EditCircular'

const page = () => {
  return (
    <div>
        <Suspense
        fallback={
          <div className="hidden lg:block w-64 bg-white border-r border-slate-200"></div>
        }
      >
        <EditCircular />
      </Suspense>
    </div>
  )
}

export default page
