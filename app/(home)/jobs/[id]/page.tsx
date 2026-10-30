import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JobDetailsPage from './JobDetailsPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>}>
      <JobDetailsPage />
    </Suspense>
  );
}