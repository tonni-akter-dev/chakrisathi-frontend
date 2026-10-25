import { Wallet } from 'lucide-react';

export default function MoneyStats() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-brand-600" />
        <h3 className="text-base font-bold text-slate-900">টাকার হিসাব</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">সার্ভিস চার্জ আয়</div>
          <div className="mt-1 text-lg font-bold text-emerald-600">৳১৫,৪০০</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">মোট সংগ্রহ (যাচাইকৃত)</div>
          <div className="mt-1 text-lg font-bold text-slate-900">৳৮৫,২০০</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">টেলিটকে পরিশোধ বাকি</div>
          <div className="mt-1 text-lg font-bold text-blue-600">৳৪৫,৬০০</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-slate-500">যাচাই বাকি পেমেন্ট</div>
          <div className="mt-1 text-lg font-bold text-amber-600">৳১২,৪০০</div>
        </div>
      </div>
    </div>
  );
}