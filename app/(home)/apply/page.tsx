'use client';
import { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Check,
  HelpCircle, MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';

const CIRCULAR = {
  id: 'WTMU', org: 'উৎসে কর ব্যবস্থাপনা ইউনিট',
  loc: 'কাকরাইল, ঢাকা', district: 'সকল জেলা',
  postsCount: 13,
  endDate: '৮ নভেম্বর, বিকাল ৫:০০',
  timeLeft: '১০ দিন ৫ ঘণ্টা বাকি',
  posts: [
    { n: 'কম্পিউটার অপারেটর', grade: '১৩তম গ্রেড', sal: '২৪,০০০–৫৮,০০০', vac: '১টি পদ', req: 'ন্যূনতম: স্নাতক', fee: '১১২', desc: 'বিজ্ঞান বিভাগে স্নাতক; টাইপিং বাংলা ২৫, ইংরেজি ৩০ শব্দ/মিনিট' },
    { n: 'ব্যক্তিগত সহকারী', grade: '১৩তম গ্রেড', sal: '২৪,০০০–৫৮,০০০', vac: '৪টি পদ', req: 'ন্যূনতম: স্নাতক', fee: '১১২', desc: 'যেকোনো বিষয়ে স্নাতক; টাইপিং ও সাঁটলিপি দক্ষতা' },
    { n: 'অফিস সহকারী কাম-কম্পিউটার মুদ্রাক্ষরিক', grade: '১৬তম গ্রেড', sal: '২১,৯০০–৫২,৯০০', vac: '৫টি পদ', req: 'ন্যূনতম: এইচএসসি', fee: '১১২', desc: 'এইচএসসি (২য় বিভাগ); টাইপিং বাংলা ও ইংরেজি ২০ শব্দ/মিনিট' },
    { n: 'অফিস সহায়ক', grade: '২০তম গ্রেড', sal: '২০,০০০–৪৮,৪০০', vac: '৩টি পদ', req: 'ন্যূনতম: এসএসসি', fee: '৫৬', desc: 'এসএসসি পাস' },
  ]
};

const STEPS = ['পদ বাছাই', 'ব্যক্তিগত তথ্য', 'কাগজপত্র', 'পেমেন্ট', 'সম্পন্ন'];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const togglePost = (postName: string) => {
    setSelectedPosts(prev =>
      prev.includes(postName)
        ? prev.filter(p => p !== postName)
        : [...prev, postName]
    );
  };

  const handleNext = () => {
    if (step === 0 && selectedPosts.length === 0) {
      return toast.error('অন্তত একটি পদ বাছাই করুন।');
    }
    setStep(s => Math.min(s + 1, STEPS.length));
  };

  const govtFee = selectedPosts.reduce((sum, postName) => {
    const post = CIRCULAR.posts.find(p => p.n === postName);
    const fee = post?.fee === '১১২' ? 112 : 56;
    return sum + fee;
  }, 0);

  const smsFee = selectedPosts.length * 15;
  const serviceFee = selectedPosts.length > 0 ? 100 : 0;
  const total = govtFee + smsFee + serviceFee;

  return (
    <div className="min-h-screen bg-[#FBF8F4] font-hind pb-20">
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0E9F8E] to-[#1D5B5A] text-white shadow-lg">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <circle cx="80" cy="20" r="40" fill="white" opacity="0.3" />
              <circle cx="100" cy="80" r="50" fill="white" opacity="0.1" />
            </svg>
          </div>

          <div className="relative flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-5">
              <div className="grid h-14 w-16 flex-none place-items-center rounded-xl border border-white/30 bg-white/10 font-bold tracking-widest text-white shadow-inner backdrop-blur-sm">
                {CIRCULAR.id}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{CIRCULAR.org}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {CIRCULAR.loc}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{CIRCULAR.postsCount}টি পদ</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{CIRCULAR.district}</span>
                </div>
              </div>
            </div>

            <div className="flex-none text-left sm:text-right">
              <div className="text-sm text-white/80">আবেদনের শেষ</div>
              <div className="text-xl font-bold">{CIRCULAR.endDate}</div>
              <div className="mt-1 text-sm font-bold text-amber-300">{CIRCULAR.timeLeft}</div>
              <a href="#" className="mt-1 inline-block text-xs text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">মূল বিজ্ঞপ্তি</a>
            </div>
          </div>
        </div>

        {/* ================= Beautiful Stepper ================= */}
        <div className="relative mx-auto mb-10 mt-10 max-w-4xl px-4 hidden sm:block">
          <div className="absolute left-10 right-10 top-5 -z-10 h-[2px] bg-slate-200"></div>
          <div className="flex justify-between">
            {STEPS.map((label, i) => {
              const isDone = i < step;
              const isCurrent = i === step;
              return (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition-all duration-300 ${isDone ? 'bg-purple-600 text-white shadow-md shadow-purple-200' :
                    isCurrent ? 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-md shadow-purple-200' :
                      'bg-white text-slate-400 border-2 border-slate-200'
                    }`}>
                    {isDone ? <Check className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${isDone || isCurrent ? 'text-purple-900' : 'text-slate-400'
                    }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= Main Grid Layout ================= */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ---- Left Side: Form Panel ---- */}
          <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm flex flex-col">

            <div className="p-6 sm:p-8 flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">কোন পদে আবেদন করতে চান?</h2>
              <p className="text-sm text-slate-500 mb-6">একাধিক পদ বাছাই করলে সার্ভিস চার্জে ছাড় পাবেন। প্রতিটি পদের জন্য টেলিটকে আলাদা আবেদন হবে।</p>

              <div className="space-y-4">
                {CIRCULAR.posts.map((post) => {
                  const isSelected = selectedPosts.includes(post.n);
                  return (
                    <label
                      key={post.n}
                      onClick={() => togglePost(post.n)} // 👈 Click handler added
                      className={`flex items-start gap-4 cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 ${isSelected ? 'border-purple-500 bg-purple-50/30 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'
                        }`}
                    >
                      {/* Custom Checkbox Design */}
                      <div className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border-2 transition-colors ${isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300 bg-white'
                        }`}>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900">{post.n}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-md bg-purple-50 px-2 py-1 text-purple-700">{post.grade}</span>
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">৳{post.sal}</span>
                          <span className="rounded-md bg-purple-50 px-2 py-1 text-purple-700">{post.vac}</span>
                          <span className="rounded-md bg-purple-50 px-2 py-1 text-purple-700">{post.req}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed">{post.desc}</p>
                      </div>

                      <div className="text-right flex-none">
                        <div className="text-xs text-slate-500 font-medium">সরকারি ফি</div>
                        <div className="text-lg font-bold text-slate-900">৳{post.fee}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer Nav */}
            <div className="flex items-center justify-between border-t border-slate-100 p-5 px-6 sm:px-8 bg-slate-50/50 rounded-b-[24px]">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition ${step === 0 ? 'invisible' : 'text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <ArrowLeft className="h-4 w-4" /> পেছনে
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:scale-[1.02] hover:shadow-lg"
              >
                পরবর্তী <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* ---- Right Side: Summary Panel ---- */}
          <div className="space-y-6">

            {/* Summary Card */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-slate-900">আপনার আবেদন</h3>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                  {selectedPosts.length}টি পদ
                </span>
              </div>

              <div className="space-y-3 text-sm font-medium text-slate-600">
                {selectedPosts.length === 0 && (
                  <p className="text-slate-400 text-center py-4">এখনো কোনো পদ বাছাই করেননি</p>
                )}

                <div className="flex justify-between">
                  <span>সরকারি ফি</span>
                  <span className="text-slate-900">৳{govtFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>SMS চার্জ</span>
                  <span className="text-slate-900">৳{smsFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>সার্ভিস চার্জ</span>
                  <span className="text-slate-900">৳{serviceFee}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-base font-bold text-slate-900">মোট</span>
                <span className="text-2xl font-bold text-purple-600">৳{total}</span>
              </div>
            </div>

            {/* Help Card */}
            <div className="rounded-[24px] bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-200">
                <HelpCircle className="h-4 w-4" /> সাহায্য দরকার? কল করুন
              </div>
              <div className="mt-2 text-2xl font-bold tracking-wide">০১৭০০-০০০০০০</div>
              <div className="mt-1 text-sm text-purple-200">সকাল ৯টা – রাত ৯টা</div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}