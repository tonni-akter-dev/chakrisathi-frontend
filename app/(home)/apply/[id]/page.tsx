// app/apply/[id]/page.tsx
import { Suspense } from 'react';
import ApplyContent from './ApplyContent';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>}>
      <ApplyContent />
    </Suspense>
  );
}