/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Activity, Megaphone, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import KpiCards from '../components/KpiCards';
import TodoList from '../components/TodoList';
import MoneyStats from '../components/MoneyStats';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>;
  }

  const kpis = data?.kpis || { total: 0, pending: 0, processing: 0, review: 0, completed: 0, rejected: 0 };
  const money = data?.money || { totalCollected: 0, pendingPayment: 0 };
  const circularStats = data?.circularStats || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ড্যাশবোর্ড</h1>
        <p className="text-sm text-slate-500">স্বাগতম! এখানে আপনার সারসংক্ষেপ দেখুন।</p>
      </div>

      {/* Top KPIs - 💡 data পাস করে দিচ্ছি */}
      <KpiCards data={kpis} />

      {/* Middle Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* 💡 recentActivity পাস করে দিচ্ছি */}
        <TodoList data={recentActivity} />
        {/* 💡 money পাস করে দিচ্ছি */}
        <MoneyStats data={money} />
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
            {circularStats.length === 0 && <p className="text-sm text-slate-500">কোনো ডাটা নেই।</p>}
            
            {circularStats.map((c: any) => {
              // 💡 শতকরা হিসাব অটোমেটিক বের হবে
              const percent = kpis.total > 0 ? Math.round((c.count / kpis.total) * 100) : 0;
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-semibold text-slate-700 truncate">{c.name}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-8 text-right text-sm font-bold text-slate-900">{c.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক কার্যক্রম</h3>
          </div>
          <ul className="space-y-4">
            {recentActivity.length === 0 && <p className="text-sm text-slate-500">কোনো কার্যক্রম নেই।</p>}
            
            {recentActivity.map((item: any, i: number) => (
              <li key={i} className="flex gap-3">
                <div className={`mt-1.5 h-2 w-2 flex-none rounded-full ${
                  item.status === 'pending' ? 'bg-amber-500' : 
                  item.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-500'
                }`} />
                <div>
                  <div className="text-sm text-slate-900">
                    <span className="font-bold">{item.applicationId}</span> · {item.name} — নতুন আবেদন
                  </div>
                  <div className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString('bn-BD')}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}