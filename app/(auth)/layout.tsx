import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container  mx-auto flex min-h-screen flex-col bg-slate-50/50">
      
      {/* Auth Header (Minimal) */}
      <header className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-80">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600">
            <span className="text-base font-bold text-white">চ</span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-slate-900">
            চাকরি<span className="text-brand-600">সাথী</span>
          </span>
        </Link>
        
        <Link 
          href="/" 
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          হোমে ফিরে যান
        </Link>
      </header>

      {/* Main Auth Content */}
      <main className="flex flex-1 items-center justify-center p-4 py-8">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-slate-500">
        <p>© ২০২৬ চাকরি সাথী। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
      
    </div>
  );
}