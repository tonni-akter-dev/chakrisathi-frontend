/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet } from 'lucide-react';

export default function MoneyStats({ data }: { data: any }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
      <div>
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Wallet className="h-5 w-5 text-brand-600" />
          <h3 className="text-base font-bold text-slate-900">টাকার হিসাব</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">মোট সংগ্রহ (যাচাইকৃত)</div>
            <div className="text-2xl font-bold text-emerald-600">৳{data?.totalCollected || 0}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">যাচাই বাকি পেমেন্ট</div>
            <div className="text-2xl font-bold text-amber-600">৳{data?.pendingPayment || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}