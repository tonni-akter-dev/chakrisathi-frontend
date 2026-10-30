import { Suspense } from 'react';
import Sidebar from './components/Sidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-350 flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        
        {/* 💡 সাইডবার */}
        <Suspense fallback={<div className="hidden md:block w-64 bg-white border-r border-slate-200"></div>}>
          <Sidebar />
        </Suspense>
        
        {/* 💡 মেইন কন্টেন্ট */}
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
}