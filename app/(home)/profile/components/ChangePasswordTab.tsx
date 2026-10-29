'use client';
import { Lock } from 'lucide-react';
import { useState } from 'react';

export default function ChangePasswordTab() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="max-w-lg space-y-6 animate-in fade-in duration-300 my-10">
      <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Current Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            {/* 💡 focus:border-brand-500 করা হয়েছে */}
            <input type="password" required placeholder="••••••••" className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition" />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-semibold text-slate-700">New Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="password" required minLength={6} placeholder="••••••••" className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition" />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="password" required minLength={6} placeholder="••••••••" className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition" />
          </div>
        </div>
        
        {/* 💡 bg-brand-600 করা হয়েছে */}
        <button type="submit" disabled={isLoading} className="w-full mt-2 flex justify-center items-center rounded-lg bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-70 transition">
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}