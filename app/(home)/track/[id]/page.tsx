import { Suspense } from 'react';
import TrackDetailsPage from './TrackDetails'; 

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <TrackDetailsPage />
    </Suspense>
  );
}