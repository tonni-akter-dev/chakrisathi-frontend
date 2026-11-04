/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Loader2, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useGetMyReviewsQuery } from '@/app/redux/features/apis/review-apis';
import ReviewModal from './ReviewModal';

export default function AppliedJobsTab() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 রিভিউ
  const { data: myReviews = [] } = useGetMyReviewsQuery();
  const [reviewFor, setReviewFor] = useState<{ id: string; title: string } | null>(null);
  const reviewOf = (appId: string) => myReviews.find((r) => r.application === appId);

  // 💡 API থেকে ইউজারের সব আবেদন লোড করা
  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyApplications();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 animate-in fade-in duration-300 my-10">
      <h2 className="text-2xl font-bold text-slate-900">Applied Jobs</h2>
      
      {/* 💡 ডাটা না থাকলে এম্পটি স্টেট */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <FileText className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">কোনো আবেদন পাওয়া যায়নি</h3>
          <p className="text-sm text-slate-500 mb-4">আপনি এখনো কোনো পদে আবেদন করেননি।</p>
          <Link href="/jobs" className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
            জব বোর্ডে যান
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
              <div>
                {/* পদের নাম */}
                <h3 className="text-lg font-bold text-slate-900">
                  {job.posts?.map((p: any) => p.name).join(', ')}
                </h3>
                
                {/* প্রতিষ্ঠানের নাম */}
                <p className="text-sm font-medium text-brand-600">
                  {job.circularOrg || 'N/A'}
                </p>
                
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                  {/* লোকেশন (যদি API-তে থাকে, না থাকলে ফোন নম্বর দেখানো হলো) */}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4"/> {job.phone}
                  </span>
                  {/* আবেদনের তারিখ */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4"/> {new Date(job.createdAt).toLocaleDateString('bn-BD')}
                  </span>
                  <span className="font-semibold text-slate-700">
                    ID: {job.applicationId}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {/* স্ট্যাটাস ব্যাজ */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  job.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  job.status === 'processing' ? 'bg-brand-100 text-brand-700' : 
                  job.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {job.status}
                </span>
                
                {/* 💡 রিভিউ — শুধু সম্পন্ন আবেদনে */}
                {job.status === 'completed' && (() => {
                  const rv = reviewOf(job._id);
                  if (rv) {
                    return (
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {rv.rating}/5 ·{' '}
                        {rv.status === 'approved' ? 'রিভিউ প্রকাশিত' : rv.status === 'hidden' ? 'রিভিউ জমা হয়েছে' : 'অনুমোদনের অপেক্ষায়'}
                      </span>
                    );
                  }
                  return (
                    <button
                      onClick={() =>
                        setReviewFor({ id: job._id, title: job.posts?.map((p: any) => p.name).join(', ') || job.circularOrg })
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
                    >
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      রিভিউ দিন
                    </button>
                  );
                })()}

                {/* বিস্তারিত বাটন */}
                <Link 
                  href={`/track/${job.applicationId}`} 
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
                >
                  বিস্তারিত দেখুন <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 💡 রিভিউ মোডাল */}
      {reviewFor && (
        <ReviewModal
          applicationId={reviewFor.id}
          title={reviewFor.title}
          onClose={() => setReviewFor(null)}
        />
      )}
    </div>
  );
}
