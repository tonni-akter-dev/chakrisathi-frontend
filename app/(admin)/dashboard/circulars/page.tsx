/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Megaphone, Calendar, Plus, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useGetAllCircularsQuery } from '@/app/redux/features/apis/circular-api';

export default function CircularsPage() {
  const { data: circulars, isLoading, isError } = useGetAllCircularsQuery({});

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-rose-500">
        <p className="text-lg font-semibold">ডাটা লোড করতে সমস্যা হয়েছে!</p>
        <p className="text-sm text-slate-500">আবার চেষ্টা করুন অথবা সার্ভার চেক করুন।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* 💡 হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">সার্কুলারসমূহ</h1>
          <p className="text-sm text-slate-500">সব চলমান সরকারি চাকরির সার্কুলার এখান থেকে ম্যানেজ করুন।</p>
        </div>
        <Link 
          href="/dashboard/circulars/add" 
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" /> Add New Job
        </Link>
      </div>

      {/* 💡 ডাটা না থাকলে এম্পটি স্টেট */}
      {circulars?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <FileText className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">কোনো সার্কুলার পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 mb-4">নতুন সার্কুলার যোগ করতে উপরের বাটনে ক্লিক করুন।</p>
        </div>
      )}

      {/* 💡 সার্কুলার কার্ড গ্রিড */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {circulars?.map((c: any) => {
          const isActive = new Date(c.end) > new Date(); 
          
          return (
            <div key={c._id || c.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: c.color || '#5B3DF5' }}>
                  {c.ab || 'JOB'}
                </div>
                
                {/* স্ট্যাটাস */}
                {isActive ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">সক্রিয়</span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">শেষ</span>
                )}
              </div>
              
              <h3 className="mt-4 text-sm font-bold text-slate-900 leading-tight line-clamp-2">{c.org}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.title}</p>
              
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-3.5 w-3.5 text-slate-400"/> 
                  {c.total || c.posts?.length || 0}টি পদ
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400"/> 
                  শেষ: {formatDate(c.end)}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link 
                  href={`/dashboard/circulars/${c.id || c._id}`} 
                  className="flex-1 text-center rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  আবেদন দেখুন
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}