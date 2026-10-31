/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText, Clock, Loader2, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function KpiCards({ data }: { data: any }) {
  // API থেকে আসা ডাটা ম্যাপ করা হলো
  const kpis = [
    { label: 'মোট আবেদন', value: data?.total || 0, icon: FileText, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'পেন্ডিং', value: data?.pending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'প্রসেসিং', value: data?.processing || 0, icon: Loader2, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'ইউজার রিভিউতে', value: data?.review || 0, icon: Eye, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'সম্পন্ন', value: data?.completed || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'বাতিল', value: data?.rejected || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi, i) => (
        <div key={i} className="flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-2">
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold uppercase text-slate-500 truncate">{kpi.label}</span>
          </div>
          <div className={`mt-3 text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
        </div>
      ))}
    </div>
  );
}