import React, { Suspense } from "react";
import CircularApplications from "./CircularApplications";

const page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="hidden lg:block w-64 bg-white border-r border-slate-200"></div>
        }
      >
        <CircularApplications />
      </Suspense>
    </div>
  );
};

export default page;
