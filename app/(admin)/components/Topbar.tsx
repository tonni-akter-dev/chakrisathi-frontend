'use client';
import { Search, Bell, Menu, RefreshCw } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      
      {/* Mobile Menu (Left) */}
      <button className="grid h-10 w-10 place-items-center rounded-lg lg:hidden hover:bg-slate-100">
        <Menu className="h-5 w-5 text-slate-600" />
      </button>

      {/* Search */}
      <div className="hidden flex-1 items-center gap-2 sm:flex">
        <label className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-brand-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
          <Search className="h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="আইডি, নাম, মোবাইল বা TrxID…" 
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}