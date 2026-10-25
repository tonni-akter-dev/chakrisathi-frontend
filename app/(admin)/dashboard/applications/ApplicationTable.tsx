/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {  ChevronRight } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string, color: string, bg: string }> = {
  pending: { label: 'পেন্ডিং', color: 'text-amber-700', bg: 'bg-amber-100' },
  processing: { label: 'প্রসেসিং', color: 'text-brand-700', bg: 'bg-brand-100' },
  review: { label: 'রিভিউতে', color: 'text-pink-700', bg: 'bg-pink-100' },
  completed: { label: 'সম্পন্ন', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  rejected: { label: 'বাতিল', color: 'text-rose-700', bg: 'bg-rose-100' },
};

export default function ApplicationTable({ data }: { data: any[] }) {
  if (data.length === 0) {  
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center">
        <div className="text-4xl">📭</div>
        <h3 className="mt-3 text-lg font-bold text-slate-900">কোনো আবেদন পাওয়া যায়নি</h3>
        <p className="text-sm text-slate-500">নতুন সার্চ বা ফিল্টার দিয়ে চেষ্টা করুন।</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">আইডি</th>
              <th className="px-5 py-4">আবেদনকারী</th>
              <th className="px-5 py-4">সার্কুলার ও পদ</th>
              <th className="px-5 py-4">পেমেন্ট</th>
              <th className="px-5 py-4">অবস্থা</th>
              <th className="px-5 py-4">ডেডলাইন</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((app) => {
              const st = STATUS_MAP[app.status];
              return (
                <tr key={app.id} className="group cursor-pointer hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{app.id}</div>
                    <div className="text-xs text-slate-500">{app.date}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{app.name}</div>
                    <div className="text-xs text-slate-500">{app.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{app.circular}</div>
                    <div className="truncate text-xs text-slate-500 max-w-[200px]">{app.posts}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">৳{app.amount}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${st.bg} ${st.color}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold ${app.deadline.includes('বাকি') ? 'text-rose-600' : 'text-slate-500'}`}>
                      {app.deadline}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}