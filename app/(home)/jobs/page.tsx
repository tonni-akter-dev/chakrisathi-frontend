import React, { Suspense } from "react";
import JobsPage from "./JobsPage";
import { Loader2 } from "lucide-react";

const page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          </div>
        }
      >
        <JobsPage />
      </Suspense>
    </div>
  );
};

export default page;
