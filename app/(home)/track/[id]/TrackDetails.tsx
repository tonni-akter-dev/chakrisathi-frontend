/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, Clock, MapPin, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';


export default function TrackDetail() {
  const params = useParams();
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/${params.id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setApp(data);
      } catch (error) {
        setApp(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplication();
  }, [params.id]);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>;

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBF8F4]">
        <h1 className="text-2xl font-bold text-slate-900">আবেদন খুঁজে পাওয়া যায়নি!</h1>
        <Link href="/track" className="mt-4 text-brand-600 hover:underline">ট্র্যাক পেজে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F4] pb-20 pt-10 font-hind">
      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/track" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> ট্র্যাক পেজে ফিরুন
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Application Info */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                <FileText className="h-3.5 w-3.5" /> {app.applicationId}
              </div>
              <h1 className="text-xl font-bold text-slate-900">{app.circularOrg || 'N/A'}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {app.posts?.map((p: any) => p.name).join(', ')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {new Date(app.createdAt).toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-sm text-slate-500">মোট পরিশোধিত</div>
              <div className="text-2xl font-bold text-brand-600">৳{app.amount}</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="pt-8">
            <h2 className="mb-6 text-lg font-bold text-slate-900">আবেদনের অগ্রগতি</h2>
            <div className="relative ml-4 space-y-8 border-l-2 border-slate-100 pb-4">
              {app.timeline?.map((step: any, index: number) => {
                const isDone = step.status === 'done';
                const isCurrent = step.status === 'current';

                return (
                  <div key={index} className="relative pl-8">
                    <div className={`absolute -left-4.25 top-1 grid h-8 w-8 place-items-center rounded-full border-2 bg-white transition-colors ${
                        isDone ? 'border-emerald-500 text-emerald-500' : isCurrent ? 'border-brand-600 text-brand-600 ring-4 ring-brand-100' : 'border-slate-200 text-slate-300'
                      }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : isCurrent ? <Clock className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${isDone ? 'text-slate-900' : isCurrent ? 'text-brand-700' : 'text-slate-400'}`}>{step.title}</h3>
                      <div className={`mt-1 text-xs font-semibold ${isDone ? 'text-emerald-600' : isCurrent ? 'text-brand-500' : 'text-slate-400'}`}>{step.date}</div>
                      {step.desc && <p className="mt-2 inline-block rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500">{step.desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Application Button */}
          {app.status === 'completed' && (
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:flex-row sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900">আপনার আবেদন সম্পন্ন হয়েছে!</h3>
                    <p className="mt-1 text-sm text-emerald-700">Applicant&apos;s Copy এবং টেলিটক User ID ডাউনলোড করতে ক্লিক করুন।</p>
                  </div>
                </div>
                <Link href={`/track/${app.applicationId}/success`} className="flex w-full flex-none items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] hover:bg-emerald-700 sm:w-auto">
                  Applicant&apos;s Copy দেখুন <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}