import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ManageApplication from '../../components/ManageApplication';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <ManageApplication />
    </Suspense>
  );
}
