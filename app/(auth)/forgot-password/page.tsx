'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, KeyRound, Phone } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 11) {
      toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন!');
      return;
    }

    setIsLoading(true);
    // Demo OTP send simulation
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      toast.success('আপনার মোবাইলে একটি OTP পাঠানো হয়েছে! (ডেমো OTP: 123456)');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      toast.error('ভুল OTP! ডেমো OTP হলো 123456');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('পাসওয়ার্ড সফলভাবে রিসেট হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
      router.push('/login');
    }, 1200);
  };

  return (
    <div className="w-full max-w-[420px] my-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        
        {/* Back to login */}
        <Link href="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="h-4 w-4" />
          লগইনে ফিরে যান
        </Link>

        {step === 1 ? (
          <>
            <div className="mb-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">পাসওয়ার্ড ভুলে গেছেন?</h1>
              <p className="mt-2 text-sm text-slate-500">
                আপনার রেজিস্টার্ড মোবাইল নম্বরটি দিন। আমরা একটি ভেরিফিকেশন কোড (OTP) পাঠাবো।
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">মোবাইল নম্বর</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? 'পাঠানো হচ্ছে...' : 'OTP পাঠান'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">OTP যাচাই করুন</h1>
              <p className="mt-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{phone}</span> নম্বরে পাঠানো ৬ ডিজিটের OTP টি দিন।
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">OTP কোড</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="block w-full tracking-widest text-center text-lg font-semibold rounded-xl border border-slate-200 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />
                <p className="mt-2 text-xs text-slate-500 text-center">ডেমো OTP: 123456</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    যাচাই হচ্ছে...
                  </span>
                ) : (
                  <>
                    যাচাই করুন
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                নম্বর পরিবর্তন করুন?
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}