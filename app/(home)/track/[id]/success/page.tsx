'use client';
import Link from 'next/link';
import { 
  ArrowLeft, Download, ShieldCheck, CheckCircle2, 
 ExternalLink, Printer, User, Lock
} from 'lucide-react';

// Mock Data
const APP_DATA = {
  id: 'CS261022-CD34',
  circular: 'হাউজিং অ্যান্ড বিল্ডিং রিসার্চ ইনস্টিটিউট (HBRI)',
  post: 'অফিস সহায়ক',
  applicantName: 'রাকিব হাসান',
  userID: 'HBRI-88291A',
  password: 'Hb#992X',
  date: '২৩ অক্টোবর, ২০২৬',
  rollNo: '10293847',
};

export default function ApplicantCopyPage() {
  return (
    <div className="min-h-screen bg-[#FBF8F4] font-hind pb-20">
      
      {/* ================= Top Header ================= */}
      <header className="border-b border-slate-200/60 bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/track" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> ফিরে যান
          </Link>
          <div className="text-lg font-extrabold text-slate-900">চাকরি<span className="text-orange-500">সাথী</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        
        {/* ================= Success Banner ================= */}
        <div className="mb-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-top-4 duration-500">
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
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white font-bold text-lg">
                HBRI
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Applicant&apos;s Copy</h2>
                <p className="text-xs text-slate-500">Teletalk Application Receipt</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900">{APP_DATA.id}</div>
              <div className="text-xs text-slate-500">{APP_DATA.date}</div>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 sm:p-10">
            
            {/* Applicant Info */}
            <div className="grid gap-6 sm:grid-cols-2 mb-10">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">প্রার্থীর নাম</div>
                <div className="text-lg font-bold text-slate-900">{APP_DATA.applicantName}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">পদ</div>
                <div className="text-base font-bold text-slate-900">{APP_DATA.post}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">প্রতিষ্ঠান</div>
                <div className="text-base font-medium text-slate-700">{APP_DATA.circular}</div>
              </div>
            </div>

            <hr className="border-dashed border-slate-200 mb-8" />

            {/* Teletalk Credentials */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-blue-100 text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-sm font-bold text-blue-900 mb-4">টেলিটক লগইন তথ্য</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white border border-blue-100 p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">User ID</div>
                        <div className="font-mono text-sm font-bold text-slate-900">{APP_DATA.userID}</div>
                      </div>
                      <User className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="rounded-xl bg-white border border-blue-100 p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Password</div>
                        <div className="font-mono text-sm font-bold text-slate-900">{APP_DATA.password}</div>
                      </div>
                      <Lock className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-blue-700">
                    এই তথ্য দিয়ে Teletalk এর ওয়েবসাইটে লগইন করে অ্যাডমিট কার্ড ডাউনলোড করতে পারবেন।
                  </p>
                </div>
              </div>
            </div>

            {/* Roll / Application Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">আবেদন আইডি</div>
                <div className="font-bold text-slate-900">{APP_DATA.id}</div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-1">রোল নম্বর (ডেমো)</div>
                <div className="font-bold text-slate-900">{APP_DATA.rollNo}</div>
              </div>
            </div>

          </div>
          
          {/* Document Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-8 py-4 flex items-center justify-between text-xs text-slate-400">
            <span>Generated by ChakriSathi</span>
            <span>www.chakrisathi.com</span>
          </div>
        </div>

        {/* ================= Action Buttons ================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-700 hover:scale-[1.02]">
            <Download className="h-4 w-4" /> Applicant&apos;s Copy ডাউনলোড
          </button>
          
          <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Printer className="h-4 w-4" /> প্রিন্ট করুন
          </button>

          <a 
            href="https://teletalk.com.bd" 
            target="_blank" 
            rel="noreferrer"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            টেলিটক পোর্টাল <ExternalLink className="h-4 w-4" />
          </a>
        </div>

      </main>
    </div>
  );
}