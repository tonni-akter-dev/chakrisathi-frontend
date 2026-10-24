'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Phone, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (phone.length !== 11) {
      toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন!');
      return;
    }

    setIsLoading(true);

    // Demo registration simulation
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('cs_user', JSON.stringify({ phone, name }));
      toast.success('সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!');
      router.push('/'); // Home page e pathao
    }, 1500);
  };

  return (
    <div className="w-full max-w-[420px] my-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            নতুন অ্যাকাউন্ট খুলুন
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            সরকারি চাকরির আবেদন পরিচালনা করতে ফ্রি রেজিস্ট্রেশন করুন।
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">পূর্ণ নাম</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রাকিব হাসান"
                className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
          </div>

          {/* Phone */}
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

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">পাসওয়ার্ড</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                minLength={6}
                className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">কনফার্ম পাসওয়ার্ড</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার পাসওয়ার্ড দিন"
                minLength={6}
                className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                রেজিস্টার হচ্ছে...
              </span>
            ) : (
              <>
                রেজিস্ট্রেশন করুন
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            লগইন করুন
          </Link>
        </p>

      </div>
    </div>
  );
}