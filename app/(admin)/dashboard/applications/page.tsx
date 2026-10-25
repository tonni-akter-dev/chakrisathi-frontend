'use client';
import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

// Dummy Data for Demo
const MOCK_APPS = [
  { id: 'CS2310-AB12', name: 'রাকিব হাসান', phone: '01711223344', circular: 'WTMU', posts: 'কম্পিউটার অপারেটর', amount: 215, status: 'pending', date: '২৪ অক্টো', deadline: '২ দিন বাকি' },
  { id: 'CS2310-CD34', name: 'সাদিয়া আক্তার', phone: '01811223344', circular: 'HBRI', posts: 'উপ-সহকারী প্রকৌশলী', amount: 350, status: 'processing', date: '২৪ অক্টো', deadline: '৫ দিন বাকি' },
  { id: 'CS2310-EF56', name: 'মেহেদী রহমান', phone: '01911223344', circular: 'TZ-3', posts: 'উচ্চমান সহকারী', amount: 180, status: 'review', date: '২৩ অক্টো', deadline: '১ দিন বাকি' },
  { id: 'CS2310-GH78', name: 'নুসরাত জাহান', phone: '01611223344', circular: 'DC Sherpur', posts: 'অফিস সহকারী', amount: 112, status: 'completed', date: '২২ অক্টো', deadline: 'শেষ' },
  { id: 'CS2310-IJ90', name: 'আরিফ হোসেন', phone: '01511223344', circular: 'WTMU', posts: 'অফিস সহায়ক', amount: 112, status: 'rejected', date: '২১ অক্টো', deadline: 'শেষ' },
];

const TABS = [
  { id: 'all', label: 'সব' },
  { id: 'pending', label: 'পেন্ডিং' },
  { id: 'processing', label: 'প্রসেসিং' },
  { id: 'review', label: 'রিভিউতে' },
  { id: 'completed', label: 'সম্পন্ন' },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filteredApps = MOCK_APPS.filter(app => {
    const matchTab = activeTab === 'all' || app.status === activeTab;
    const matchSearch = app.id.toLowerCase().includes(search.toLowerCase()) || 
                        app.name.includes(search) || 
                        app.phone.includes(search);
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">আবেদনসমূহ</h1>
          <p className="text-sm text-slate-500">সব ইউজার আবেদন এখানে দেখতে ও ম্যানেজ করতে পারবেন।</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          <Download className="h-4 w-4" />
          এক্সপোর্ট করুন
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
          <Filter className="h-4 w-4" />
          ফিল্টার
        </button>
      </div>

      {/* Table */}
      <ApplicationTable data={filteredApps} />
    </div>
  );
}