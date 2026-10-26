'use client'
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useParams } from 'next/navigation';

// Mock Data
const MOCK_APPS = [
  {
    id: 'CS261023-AB12',
    status: 'processing',
    circular: 'উৎসে কর ব্যবস্থাপনা ইউনিট',
    posts: ['কম্পিউটার অপারেটর'],
    date: '২৩ অক্টোবর, ২০২৬',
    amount: '২২৭',
    timeline: [
      {
        title: 'আবেদন জমা দেওয়া হয়েছে',
        date: '২৩ অক্টো, সকাল ১০:০০',
        status: 'done',
        desc: 'পেমেন্ট ও কাগজপত্র যাচাই চলছে।',
      },
      {
        title: 'পেমেন্ট ও কাগজ যাচাই সম্পন্ন',
        date: '২৩ অক্টো, বিকাল ৩:০০',
        status: 'done',
        desc: 'পেমেন্ট নিশ্চিত হয়েছে।',
      },
      {
        title: 'টেলিটকে আবেদন পূরণ হচ্ছে',
        date: 'চলমান',
        status: 'current',
        desc: 'আমাদের টিম আপনার ফর্মটি টেলিটকে পূরণ করছে।',
      },
      {
        title: 'আপনার রিভিউর অপেক্ষায়',
        date: 'অপেক্ষমাণ',
        status: 'pending',
        desc: 'ফর্ম পূরণ শেষে আপনাকে দেখানো হবে।',
      },
      {
        title: 'চূড়ান্ত জমা ও সম্পন্ন',
        date: 'অপেক্ষমাণ',
        status: 'pending',
        desc: "Applicant's Copy ডাউনলোড করতে পারবেন।",
      },
    ],
  },
  {
    id: 'CS261022-CD34',
    status: 'completed',
    circular: 'হাউজিং অ্যান্ড বিল্ডিং রিসার্চ ইনস্টিটিউট (HBRI)',
    posts: ['অফিস সহায়ক'],
    date: '২২ অক্টোবর, ২০২৬',
    amount: '১৭১',
    timeline: [
      {
        title: 'আবেদন জমা দেওয়া হয়েছে',
        date: '২২ অক্টো, সকাল ৯:০০',
        status: 'done',
        desc: '',
      },
      {
        title: 'যাচাই সম্পন্ন',
        date: '২২ অক্টো, সকাল ১১:০০',
        status: 'done',
        desc: '',
      },
      {
        title: 'ফর্ম পূরণ সম্পন্ন',
        date: '২২ অক্টো, দুপুর ২:০০',
        status: 'done',
        desc: '',
      },
      {
        title: 'রিভিউ ও অনুমোদন',
        date: '২২ অক্টো, বিকাল ৪:০০',
        status: 'done',
        desc: '',
      },
      {
        title: 'সফলভাবে সম্পন্ন',
        date: '২৩ অক্টো, সকাল ১০:০০',
        status: 'done',
        desc: "Applicant's Copy নিচে ডাউনলোড করুন।",
      },
    ],
  },
];

type TrackStatus = 'done' | 'current' | 'pending';

export default function TrackDetailsPage() {
  const params = useParams()

  const app = MOCK_APPS.find((item) => item.id === params.id);

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBF8F4]">
        <h1 className="text-2xl font-bold text-slate-900">
          আবেদন খুঁজে পাওয়া যায়নি!
        </h1>

        <Link
          href="/track"
          className="mt-4 text-brand-600 hover:underline"
        >
          ট্র্যাক পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F4] pb-20 pt-10 font-hind">
      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href="/track"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          ট্র্যাক পেজে ফিরুন
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Application Information */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                <FileText className="h-3.5 w-3.5" />
                {app.id}
              </div>

              <h1 className="text-xl font-bold text-slate-900">
                {app.circular}
              </h1>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {app.posts.join(', ')}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {app.date}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-sm text-slate-500">
                মোট পরিশোধিত
              </div>
              <div className="text-2xl font-bold text-brand-600">
                ৳{app.amount}
              </div>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="pt-8">
            <h2 className="mb-6 text-lg font-bold text-slate-900">
              আবেদনের অগ্রগতি
            </h2>

            <div className="relative ml-4 space-y-8 border-l-2 border-slate-100 pb-4">
              {app.timeline.map((step, index) => {
                const status = step.status as TrackStatus;
                const isDone = status === 'done';
                const isCurrent = status === 'current';

                return (
                  <div key={index} className="relative pl-8">
                    <div
                      className={`absolute -left-4.25 top-1 grid h-8 w-8 place-items-center rounded-full border-2 bg-white transition-colors ${
                        isDone
                          ? 'border-emerald-500 text-emerald-500'
                          : isCurrent
                            ? 'border-brand-600 text-brand-600 ring-4 ring-brand-100'
                            : 'border-slate-200 text-slate-300'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isCurrent ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <div>
                      <h3
                        className={`text-base font-bold ${
                          isDone
                            ? 'text-slate-900'
                            : isCurrent
                              ? 'text-brand-700'
                              : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <div
                        className={`mt-1 text-xs font-semibold ${
                          isDone
                            ? 'text-emerald-600'
                            : isCurrent
                              ? 'text-brand-500'
                              : 'text-slate-400'
                        }`}
                      >
                        {step.date}
                      </div>

                      {step.desc && (
                        <p className="mt-2 inline-block rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500">
                          {step.desc}
                        </p>
                      )}
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
                    <h3 className="text-lg font-bold text-emerald-900">
                      আপনার আবেদন সম্পন্ন হয়েছে!
                    </h3>

                    <p className="mt-1 text-sm text-emerald-700">
                      Applicant&apos;s Copy এবং টেলিটক User ID ডাউনলোড করতে
                      নিচের বাটনে ক্লিক করুন।
                    </p>
                  </div>
                </div>

                <Link
                  href={`/track/${app.id}/success`}
                  className="flex w-full flex-none items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] hover:bg-emerald-700 sm:w-auto"
                >
                  Applicant&apos;s Copy দেখুন
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
