
import { Activity, Megaphone } from 'lucide-react';
import KpiCards from '../components/KpiCards';
import TodoList from '../components/TodoList';
import MoneyStats from '../components/MoneyStats';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ড্যাশবোর্ড</h1>
        <p className="text-sm text-slate-500">স্বাগতম! এখানে আপনার সারসংক্ষেপ দেখুন।</p>
      </div>

      {/* Top KPIs */}
      <KpiCards />

      {/* Middle Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <TodoList />
        <MoneyStats />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Circular Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">সার্কুলার অনুযায়ী আবেদন</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: 'WTMU', count: 45, percent: 80 },
              { name: 'HBRI', count: 32, percent: 60 },
              { name: 'TZ-3', count: 21, percent: 40 },
              { name: 'DC Sherpur', count: 15, percent: 25 },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-20 text-sm font-semibold text-slate-700">{c.name}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${c.percent}%` }} />
                </div>
                <span className="w-6 text-right text-sm font-bold text-slate-900">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক কার্যক্রম</h3>
          </div>
          <ul className="space-y-4">
            {[
              { id: 'CS2310-AB12', name: 'রাকিব হাসান', action: 'আবেদন জমা দিয়েছেন', time: '১০ মিনিট আগে', color: 'bg-amber-500' },
              { id: 'CS2310-CD34', name: 'সাদিয়া আক্তার', action: 'পেমেন্ট যাচাই সম্পন্ন', time: '১ ঘণ্টা আগে', color: 'bg-brand-500' },
              { id: 'CS2310-EF56', name: 'মেহেদী রহমান', action: 'রিভিউ সম্পন্ন করেছেন', time: '২ ঘণ্টা আগে', color: 'bg-pink-500' },
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <div className={`mt-1.5 h-2 w-2 flex-none rounded-full ${item.color}`} />
                <div>
                  <div className="text-sm text-slate-900">
                    <span className="font-bold">{item.id}</span> · {item.name} — {item.action}
                  </div>
                  <div className="text-xs text-slate-500">{item.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}