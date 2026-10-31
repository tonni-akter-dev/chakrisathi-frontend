/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, ChevronRight } from 'lucide-react';

export default function TodoList({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 p-5">
        <AlertCircle className="h-5 w-5 text-brand-600" />
        <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক কার্যক্রম</h3>
        <span className="text-xs text-slate-500 font-medium ml-auto">সর্বশেষ ৫টি</span>
      </div>
      <div className="divide-y divide-slate-100">
        {(!data || data.length === 0) && (
          <div className="p-5 text-center text-sm text-slate-500">কোনো সাম্প্রতিক কার্যক্রম নেই।</div>
        )}
        
        {data?.map((item: any) => {
          // স্ট্যাটাস অনুযায়ী কালার ও নাম
          let statusLabel = 'পেন্ডিং';
          let statusColor = 'bg-amber-100 text-amber-700';
          
          if (item.status === 'completed') { statusLabel = 'সম্পন্ন'; statusColor = 'bg-emerald-100 text-emerald-700'; }
          else if (item.status === 'processing') { statusLabel = 'প্রসেসিং'; statusColor = 'bg-brand-100 text-brand-700'; }
          else if (item.status === 'review') { statusLabel = 'রিভিউতে'; statusColor = 'bg-pink-100 text-pink-700'; }
          else if (item.status === 'rejected') { statusLabel = 'বাতিল'; statusColor = 'bg-rose-100 text-rose-700'; }

          return (
            <div key={item._id || item.applicationId} className="flex cursor-pointer items-center gap-4 p-4 hover:bg-slate-50">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
                {statusLabel}
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">
                  {item.applicationId} · {item.name}
                </div>
                <div className="text-xs text-slate-500">আবেদন জমা দিয়েছেন</div>
              </div>
              <div className="text-xs font-bold text-slate-500">
                {new Date(item.createdAt).toLocaleDateString('bn-BD')}
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          );
        })}
      </div>
    </div>
  );
}