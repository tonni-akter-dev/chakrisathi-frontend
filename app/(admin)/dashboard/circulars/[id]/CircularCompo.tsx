/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, MapPin, Building2, Download, 
  ExternalLink, FileText, CheckCircle2, Loader2, Clock
} from 'lucide-react';
import { useGetSingleCircularQuery } from '@/app/redux/features/apis/circular-api';

export default function CircularDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // 💡 API থেকে নির্দিষ্ট সার্কুলারের ডাটা লোড করা
  const { data: job, isLoading, isError } = useGetSingleCircularQuery(id, {
    skip: !id, // আইডি না থাকলে কোয়েরি হবে না
  });

  // তারিখ ফরম্যাট করার ফাংশন
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const handleServiceApply = () => {
    // আমাদের মাধ্যমে আবেদনের পেজে নিয়ে যাবে (আপনার রাউট অনুযায়ী পরিবর্তন করুন)
    router.push(`/apply?job=${job?.id || id}`);
  };

  const handleSelfApply = () => {
    if (job?.link) {
      window.open(job.link, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F8FAFC]">
        <FileText className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">সার্কুলারটি পাওয়া যায়নি!</h2>
        <p className="text-slate-500 mt-2">সম্ভবত এটি মুছে ফেলা হয়েছে অথবা ভুল লিংকে এসেছেন।</p>
        <Link href="/jobs" className="mt-6 rounded-lg bg-brand-600 px-6 py-2.5 text-white font-semibold hover:bg-brand-700">
          সব সার্কুলার দেখুন
        </Link>
      </div>
    );
  }

  // সার্কুলারটি এখনো চলমান কিনা চেক করা
  const isActive = new Date(job.end) > new Date();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* ব্যাক বাটন */}
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="h-4 w-4" /> ফিরে যান
        </button>

        {/* মেইন কার্ড */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          
          {/* হেডার সেকশন */}
          <div className="border-b border-slate-100 p-6 sm:p-8 bg-linear-to-r from-white to-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                
                {/* প্রতিষ্ঠানের লোগো/আইকন */}
                <div 
                  className="grid h-20 w-20 flex-none place-items-center rounded-2xl text-2xl font-bold text-white shadow-md"
                  style={{ background: job.color || '#ea580c' }}
                >
                  {job.ab || 'JOB'}
                </div>
                
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{job.title}</h1>
                  <p className="text-base font-semibold text-brand-600 mt-1 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> {job.org} ({job.orgEn})
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.loc}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {job.posts?.length || 0} টি পদ</span>
                  </div>
                </div>
              </div>

              {/* স্ট্যাটাস */}
              <div className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                {isActive ? 'Status: Live' : 'Status: Closed'}
              </div>
            </div>

            {/* তারিখ সেকশন */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 rounded-2xl bg-blue-50/60 p-4 border border-blue-100">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Application Start Date</p>
                  <p className="text-base font-bold text-slate-900">{formatDate(job.start)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 rounded-2xl bg-rose-50/60 p-4 border border-rose-100">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Application End Date</p>
                  <p className="text-base font-bold text-slate-900">{formatDate(job.end)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* বডি সেকশন */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* ১. পদ ও যোগ্যতা (Posts Table) */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-600" /> পদের বিবরণ
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-semibold">পদের নাম</th>
                      <th className="px-5 py-3 font-semibold">পদসংখ্যা</th>
                      <th className="px-5 py-3 font-semibold">গ্রেড ও বেতন</th>
                      <th className="px-5 py-3 font-semibold">যোগ্যতা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {job.posts?.map((post: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-bold text-slate-900">{post.n}</td>
                        <td className="px-5 py-4 text-slate-600">{post.v} টি</td>
                        <td className="px-5 py-4 text-slate-600">
                          <div className="font-semibold text-slate-800">{post.g}</div>
                          <div className="text-xs">{post.sal}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{post.q}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ২. পিডিএফ ডাউনলোড সেকশন */}
            {job.pdfUrl && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-600" /> মূল বিজ্ঞপ্তি (PDF)
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-100 text-red-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">Circular_Document.pdf</p>
                      <p className="text-xs text-slate-500 mt-0.5">বিস্তারিত দেখতে ডাউনলোড করুন</p>
                    </div>
                  </div>
                  <a 
                    href={job.pdfUrl} 
                    download 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white border-2 border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </div>
              </div>
            )}

            {/* ৩. আবেদন করার অপশন (Apply Buttons) */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-5">আবেদন করুন</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* নিজে আবেদন (Teletalk লিংক) */}
                {job.allowSelfApply && (
                  <button 
                    onClick={handleSelfApply}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-brand-600 bg-white py-3.5 text-sm font-bold text-brand-600 hover:bg-brand-50 transition"
                  >
                    <ExternalLink className="h-4 w-4" /> নিজে আবেদন করুন
                  </button>
                )}

                {/* আমাদের মাধ্যমে আবেদন */}
                {job.allowServiceApply && (
                  <button 
                    onClick={handleServiceApply}
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 hover:scale-[1.02] transition"
                  >
                    <CheckCircle2 className="h-4 w-4" /> আমাদের মাধ্যমে আবেদন করুন
                  </button>
                )}
              </div>
            </div>

            {/* নোট / সতর্কতা */}
            <div className="rounded-xl bg-amber-50 p-5 border border-amber-200">
              <p className="text-sm text-amber-800 leading-relaxed font-medium">
                <strong>সতর্কতা:</strong> আবেদন করার আগে অবশ্যই মূল বিজ্ঞপ্তিটি (PDF) ভালোভাবে পড়ে নিন। আমাদের সার্ভিস চার্জ ছাড়া টেলিটকে আবেদন ফি আলাদা।
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}