/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Calendar, Building2, 
  ArrowRight, Loader2, FileText, Briefcase 
} from 'lucide-react';
import { useGetAllCircularsQuery } from '@/app/redux/features/apis/circular-api';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // 💡 API থেকে সব সার্কুলার লোড করা
  const { data: circulars = [], isLoading, isError } = useGetAllCircularsQuery({});

  // সার্চ ফিল্টার (ক্লায়েন্ট সাইডে)
  const filteredJobs = circulars.filter((job: any) => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.org?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.loc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // তারিখ ফরম্যাট করার ফাংশন
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* হেডার এবং সার্চ বার */}
        <div className="mb-10 text-center">
          <div className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-bold text-brand-700 mb-4">
            সব সরকারি চাকরি
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            আপনার স্বপ্নের চাকরি খুঁজুন
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
            নিচের তালিকা থেকে যেকোনো সার্কুলার বেছে নিন এবং আমাদের মাধ্যমে সহজেই আবেদন করুন।
          </p>

          <div className="mt-6 mx-auto flex max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
            <Search className="ml-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="চাকরির নাম, প্রতিষ্ঠান বা জেলা দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* লোডিং এবং এরর স্টেট */}
        {isLoading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-600">
            সার্কুলার লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">কোনো চাকরি পাওয়া যায়নি!</h3>
            <p className="text-sm text-slate-500 mt-1">অন্য কোনো শব্দ দিয়ে সার্চ করে দেখুন।</p>
          </div>
        ) : (
          /* জব কার্ড গ্রিড */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job: any) => {
              const isActive = new Date(job.end) > new Date();
              const totalVacancies = job.total || job.posts?.reduce((sum: number, p: any) => sum + (Number(p.v) || 0), 0) || 0;

              return (
                <div 
                  key={job._id || job.id} 
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-brand-200"
                >
                  <div>
                    {/* হেডার: লোগো ও স্ট্যাটাস */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="grid h-12 w-12 place-items-center rounded-xl text-sm font-bold text-white shadow-sm"
                        style={{ background: job.color || '#ea580c' }}
                      >
                        {job.ab || 'JOB'}
                      </div>
                      
                      {isActive ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                          সক্রিয়
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-100">
                          শেষ
                        </span>
                      )}
                    </div>

                    {/* চাকরির নাম ও প্রতিষ্ঠান */}
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition">
                      {job.title || 'পদ নির্ধারিত নেই'}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" /> {job.org}
                    </p>

                    {/* লোকেশন ও মেয়াদ */}
                    <div className="mt-4 space-y-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" /> 
                        {job.loc || 'সকল জেলা'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" /> 
                        শেষ তারিখ: {formatDate(job.end)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" /> 
                        মোট পদ: <span className="font-bold text-slate-700">{totalVacancies} টি</span>
                      </div>
                    </div>
                  </div>

                  {/* অ্যাকশন বাটন */}
                  <div className="mt-6 flex gap-2">
                    <Link 
                      href={`/jobs/${job._id || job.id}`}
                      className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      বিস্তারিত
                    </Link>
                    
                    {isActive && job.allowServiceApply !== false ? (
                      <Link 
                        href={`/apply?job=${job._id || job.id}`}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
                      >
                        আবেদন করুন <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button disabled className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                        আবেদন বন্ধ
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}