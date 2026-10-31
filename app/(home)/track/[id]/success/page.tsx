import React, { Suspense } from 'react'
import ApplicantCopyPage from './ApplicantCopyPage'

const page = () => {
  return (
    <div>
        <Suspense
        fallback={
          <div className="hidden lg:block w-64 bg-white border-r border-slate-200"></div>
        }
      >
        <ApplicantCopyPage />
      </Suspense>
    </div>
  )
}

export default page
