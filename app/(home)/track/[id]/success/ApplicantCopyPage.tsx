/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, CheckCircle2, 
  ExternalLink, Loader2, Info
} from 'lucide-react';

export default function ApplicantCopyPage() {
  const params = useParams();
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/${params.id}`);
        if (!res.ok) throw new Error('আবেদন পাওয়া যায়নি');
        const data = await res.json();
        setApp(data);
      } catch (error) {
        console.error(error);
        setApp(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApp();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF8F4]">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBF8F4]">
        <h1 className="text-2xl font-bold text-slate-900">আবেদন খুঁজে পাওয়া যায়নি!</h1>
        <Link href="/track" className="mt-4 text-brand-600 hover:underline">
          ট্র্যাক পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F4] font-hind pb-20">
      <main className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <Link href="/track" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> ফিরে যান
        </Link>
        
        {/* ================= Success Banner ================= */}
        <div className="mb-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-top-4 duration-500 mt-4">
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">অভিনন্দন! আপনার আবেদন সম্পন্ন হয়েছে।</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-lg">
            আপনার Applicant&apos;s Copy নিচে দেওয়া হলো। এটি ডাউনলোড করে সংরক্ষণ করুন এবং প্রিন্ট করে রাখুন।
          </p>
        </div>

        {/* ================= Applicant Copy Document (Card) ================= */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          
          {/* Document Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white font-bold text-sm">
                {app.circularOrg?.substring(0, 4).toUpperCase() || 'JOB'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Applicant&apos;s Copy</h2>
                <p className="text-xs text-slate-500">Teletalk Application Receipt</p>
              </div>
            </div>
            
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900">{app.applicationId}</div>
              <div className="text-xs text-slate-500">{new Date(app.createdAt).toLocaleDateString('bn-BD')}</div>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 sm:p-10">
            
            {/* Applicant Info */}
            <div className="grid gap-6 sm:grid-cols-2 mb-10">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">প্রার্থীর নাম</div>
                <div className="text-lg font-bold text-slate-900">{app.name}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">পদ</div>
                <div className="text-base font-bold text-slate-900">
                  {app.posts?.map((p: any) => p.name).join(', ')}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">প্রতিষ্ঠান</div>
                <div className="text-base font-medium text-slate-700">{app.circularOrg || 'N/A'}</div>
              </div>
            </div>

            <hr className="border-dashed border-slate-200 mb-8" />

            {/* 💡 Teletalk Credentials with SMS Message */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-blue-100 text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">টেলিটক লগইন তথ্য</h3>
                  
                  {/* SMS Notification Message */}
                  <div className="flex items-start gap-2 rounded-lg bg-blue-100/50 p-3 text-xs text-blue-800 mb-4">
                    <Info className="h-4 w-4 flex-none mt-0.5" />
                    <p>
                      আপনার টেলিটক <strong>User ID</strong> এবং <strong>Password</strong> আপনার মোবাইল নম্বরে <strong>SMS</strong> এর মাধ্যমে পাঠিয়ে দেওয়া হয়েছে। নিচের তথ্য দিয়ে টেলিটকে লগইন করে অ্যাডমিট কার্ড ডাউনলোড করুন।
                    </p>
                  </div>

                  {/* 💡 টেলিটক পোর্টাল বাটন এখানে বসানো হলো */}
                  <a 
                    href="https://alljobs.teletalk.com.bd" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:scale-[1.02]"
                  >
                    টেলিটক পোর্টালে যান <ExternalLink className="h-4 w-4" />
                  </a>
                
                </div>
              </div>
            </div>

            {/* Roll / Application Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">আবেদন আইডি</div>
                <div className="font-bold text-slate-900">{app.applicationId}</div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">মোবাইল নম্বর</div>
                <div className="font-bold text-slate-900">{app.phone}</div>
              </div>
            </div>

          </div>
          
          {/* Document Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-8 py-4 flex items-center justify-between text-xs text-slate-400">
            <span>Generated by sonarhorin</span>
            <span>www.sonarhorin.com</span>
          </div>
        </div>
      </main>
    </div>
  );
}