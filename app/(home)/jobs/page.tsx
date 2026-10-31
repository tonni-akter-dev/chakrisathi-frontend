/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Calendar, Building2, Heart, ChevronDown, ChevronUp,
  Loader2, FileText, Briefcase, X
} from 'lucide-react';
import { useGetAllCircularsQuery } from '@/app/redux/features/apis/circular-api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // একাধিক কার্ড এক্সপ্যান্ড করার জন্য অ্যারে স্টেট
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  
  const [userWishlist, setUserWishlist] = useState<any[]>([]);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState<string | null>(null);

  const { data: circulars = [], isLoading, isError } = useGetAllCircularsQuery({});

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserWishlist(data);
        }
      } catch (error) {
        console.error("Failed to load wishlist", error);
      }
    };
    fetchWishlist();
  }, []);

  // সার্চ চেঞ্জ হলে অটোমেটিক্যালি ম্যাচিং কার্ডগুলো ওপেন করার লজিক
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const matchedJobs = circulars.filter((job: any) => 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.org?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.loc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.posts?.some((p: any) => p.n?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      // ম্যাচিং সব সার্কুলারের আইডি অ্যারেতে সেট করে দিলাম, যাতে ড্রপডাউন ওপেন হয়
      const ids = matchedJobs.map((j: any) => j._id || j.id);
      setExpandedIds(ids);
    } else {
      // সার্চ খালি করলে সব ড্রপডাউন বন্ধ হয়ে যাবে
      setExpandedIds([]);
    }
  }, [searchQuery, circulars]);

  const handleToggleWishlist = async (circularId: string, postName: string, e: React.MouseEvent) => {
    e.stopPropagation(); 

    const token = Cookies.get('token');
    if (!token) {
      toast.error('উইশলিস্টে সেভ করতে লগইন করুন!');
      return;
    }

    const isAlreadySaved = userWishlist.some(
      (item) => item.circularId === circularId && item.postName === postName
    );

    setIsUpdatingWishlist(postName);

    try {
      if (isAlreadySaved) {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist?circularId=${circularId}&postName=${postName}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserWishlist(userWishlist.filter(item => !(item.circularId === circularId && item.postName === postName)));
        toast.success('উইশলিস্ট থেকে সরানো হয়েছে');
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ circularId, postName })
        });
        setUserWishlist([...userWishlist, { circularId, postName }]);
        toast.success('উইশলিস্টে সেভ করা হয়েছে!');
      }
    } catch (error) {
      toast.error('সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      setIsUpdatingWishlist(null);
    }
  };

  // ম্যানুয়ালি ড্রপডাউন ওপেন/ক্লোজ করার ফাংশন
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredJobs = circulars.filter((job: any) => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.org?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.loc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.posts?.some((p: any) => p.n?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-20 pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* হেডার এবং সার্চ বার */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 text-sm font-bold text-brand-700 mb-4 shadow-sm">
            <Briefcase className="h-4 w-4" /> সব সরকারি চাকরি
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            আপনার স্বপ্নের চাকরি খুঁজুন
          </h1>
          <p className="mt-3 text-sm text-slate-500 max-w-lg mx-auto">
            চাকরির নাম, প্রতিষ্ঠান বা পদ দিয়ে সার্চ করুন। সার্চ করলে ম্যাচিং ড্রপডাউন অটোমেটিক ওপেন হবে।
          </p>

          <div className="mt-8 mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-50 transition-all">
            <Search className="ml-2 h-5 w-5 text-slate-400 flex-none" />
            <input
              type="text"
              placeholder="যেমন: কম্পিউটার অপারেটর..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 text-slate-700"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition flex-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* কন্টেন্ট এরিয়া */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-slate-200"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/3 rounded bg-slate-200"></div>
                    <div className="h-4 w-1/4 rounded bg-slate-200"></div>
                    <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-600 flex flex-col items-center">
            <X className="h-10 w-10 mb-3 text-rose-400" />
            <h3 className="font-bold text-lg">সার্কুলার লোড করতে সমস্যা হয়েছে।</h3>
            <p className="text-sm mt-1">পেজ রিফ্রেশ করে আবার চেষ্টা করুন।</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
            <Search className="h-14 w-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">কোনো চাকরি পাওয়া যায়নি!</h3>
            <p className="text-slate-500 mt-2">অন্য কোনো শব্দ দিয়ে সার্চ করে দেখুন।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job: any) => {
              const jobId = job._id || job.id;
              const isActive = new Date(job.end) > new Date();
              // অ্যারেতে আইডি থাকলে true হবে
              const isExpanded = expandedIds.includes(jobId);
              const totalVacancies = job.total || job.posts?.reduce((sum: number, p: any) => sum + (Number(p.v) || 0), 0) || 0;

              return (
                <div 
                  key={jobId} 
                  className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isExpanded 
                      ? 'border-brand-400 shadow-lg ring-1 ring-brand-100' 
                      : 'border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md'
                  }`}
                >
                  {/* কার্ড হেডার (ক্লিকেবল) */}
                  <div 
                    onClick={() => toggleExpand(jobId)}
                    className={`flex cursor-pointer items-center justify-between p-5 transition-colors ${isExpanded ? 'bg-brand-50/30' : 'hover:bg-slate-50/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="grid h-14 w-14 flex-none place-items-center rounded-xl text-lg font-bold text-white shadow-sm"
                        style={{ background: job.color || '#ea580c' }}
                      >
                        {job.ab || 'JOB'}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-brand-700' : 'text-slate-900 group-hover:text-brand-600'}`}>
                          {job.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1">
                          <Building2 className="h-3.5 w-3.5 text-brand-500" /> {job.org}
                        </p>
                        
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                            <MapPin className="h-3.5 w-3.5" /> {job.loc || 'সকল জেলা'}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                            <Calendar className="h-3.5 w-3.5" /> শেষ: {formatDate(job.end)}
                          </span>
                          <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md font-semibold">
                            <Briefcase className="h-3.5 w-3.5" /> {totalVacancies} টি পদ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      {isActive ? (
                        <span className="rounded-full bg-emerald-100/50 px-3 py-1 text-[11px] font-bold tracking-wide text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> সক্রিয়
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-100/50 px-3 py-1 text-[11px] font-bold tracking-wide text-rose-700 border border-rose-200">
                          বন্ধ
                        </span>
                      )}
                      <div className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${isExpanded ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600'}`}>
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>

                  {/* ড্রপডাউন কন্টেন্ট (পদসমূহ) */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-5 animate-in slide-in-from-top-4 duration-200">
                      
                      <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" /> পদসমূহ ({job.posts?.length || 0})
                        </h4>
                        <Link 
                          href={`/jobs/${jobId}`}
                          className="flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50 transition shadow-sm"
                        >
                          সম্পূর্ণ বিবরণ <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                        </Link>
                      </div>

                      <div className="space-y-3">
                        {job.posts?.map((post: any, idx: number) => {
                          const isSaved = userWishlist.some(
                            (item) => item.circularId === job._id && item.postName === post.n
                          );

                          // সার্চ করা নামের সাথে পোস্টের নাম মিললে হাইলাইট করার জন্য (অপশনাল)
                          const isMatchedBySearch = searchQuery.trim() !== '' && post.n?.toLowerCase().includes(searchQuery.toLowerCase());

                          return (
                            <div 
                              key={idx} 
                              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-xl border p-4 transition-colors shadow-sm ${
                                isMatchedBySearch 
                                  ? 'border-brand-400 bg-brand-50/20 ring-1 ring-brand-200' 
                                  : 'border-slate-200 bg-white hover:border-brand-200'
                              }`}
                            >
                              
                              <div className="flex-1">
                                <h5 className={`text-base font-bold ${isMatchedBySearch ? 'text-brand-700' : 'text-slate-800'}`}>
                                  {post.n}
                                </h5>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
                                  {post.g && <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-700 border border-indigo-100">{post.g}তম গ্রেড</span>}
                                  {post.sal && <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-100">৳{post.sal}</span>}
                                  {post.v && <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600 border border-slate-200">{post.v} টি পদ</span>}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <Link 
                                  href={`/apply/${jobId}`}
                                  className="flex-1 sm:flex-none rounded-lg bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700 transition shadow-sm hover:shadow"
                                >
                                  Apply
                                </Link>
                                
                                <button 
                                  onClick={(e) => handleToggleWishlist(jobId, post.n, e)}
                                  disabled={isUpdatingWishlist === post.n}
                                  title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                                  className={`flex-none grid h-10 w-10 place-items-center rounded-lg border transition-all duration-200 ${
                                    isSaved 
                                      ? 'border-rose-200 bg-rose-50 text-rose-500 shadow-sm' 
                                      : 'border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
                                  }`}
                                >
                                  {isUpdatingWishlist === post.n ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                                  ) : (
                                    <Heart className={`h-5 w-5 transition-transform ${isSaved ? 'fill-rose-500 scale-110' : ''}`} />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}