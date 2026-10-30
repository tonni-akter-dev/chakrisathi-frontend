// import React from "react";
// import CircularDetailsPage from "./CircularCompo";

// const Circular = () => {
//   return (
//     <div>
//       <CircularDetailsPage />
//     </div>
//   );
// };

// export default Circular;

// app/dashboard/circulars/[id]/page.tsx
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CircularDetailsPage from "./CircularCompo";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      }
    >
      <CircularDetailsPage />
    </Suspense>
  );
}
