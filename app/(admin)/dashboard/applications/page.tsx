/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import ApplicationTable from './ApplicationTable';

const TABS = [
  { id: 'all', label: 'সব' },
  { id: 'pending', label: 'পেন্ডিং' },
  { id: 'processing', label: 'প্রসেসিং' },
  { id: 'review', label: 'রিভিউতে' },
  { id: 'completed', label: 'সম্পন্ন' },
  { id: 'rejected', label: 'বাতিল' },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 সার্চের জন্য Debounce (ইউজার টাইপ করা শেষ করলে ৫০০ms পর API কল হবে)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 💡 API থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get('token');
        const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/admin/all`);
        
        if (activeTab !== 'all') url.searchParams.append('status', activeTab);
        if (debouncedSearch) url.searchParams.append('search', debouncedSearch);

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('ডাটা লোড করতে সমস্যা হয়েছে');
        
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [activeTab, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">আবেদনসমূহ</h1>
          <p className="text-sm text-slate-500">সব ইউজার আবেদন এখানে দেখতে ও ম্যানেজ করতে পারবেন।</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          <Download className="h-4 w-4" /> এক্সপোর্ট করুন
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="আইডি, নাম বা মোবাইল দিয়ে খুঁজুন…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
          <Filter className="h-4 w-4" /> ফিল্টার
        </button>
      </div>

      {/* Table / Loading State */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <ApplicationTable data={applications} />
      )}
    </div>
  );
}