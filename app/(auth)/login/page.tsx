'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '@/utils/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for form inputs
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo login simulation (API call er poriborte)
    setTimeout(() => {
      setIsLoading(false);
      // LocalStorage e dummy user save kora holo
      localStorage.setItem('cs_user', JSON.stringify({ phone, name: 'Demo User' }));
      showToast('সফলভাবে লগইন হয়েছে!');
      router.push('/'); // Home page e pathao
    }, 1500);
  };

  return (
    <div className="w-full max-w-[420px]">
      
      {/* Main Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            আবার স্বাগতম
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            আপনার একাউন্টে লগইন করে আবেদন পরিচালনা করুন।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Phone Input */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              মোবাইল নম্বর
            </label>
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

          {/* Password Input */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700">
                পাসওয়ার্ড
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                লগইন হচ্ছে...
              </span>
            ) : (
              <>
                লগইন করুন
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="px-3 text-xs font-medium uppercase text-slate-400">অথবা</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-600">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            ফ্রি রেজিস্ট্রেশন করুন
          </Link>
        </p>

      </div>

      {/* Bottom small text */}
      <p className="mt-8 text-center text-xs text-slate-400">
        লগইন করার মাধ্যমে আপনি আমাদের <br className="sm:hidden" />
        <Link href="#" className="underline hover:text-slate-600">শর্তাবলী</Link> ও <Link href="#" className="underline hover:text-slate-600">প্রাইভেসি পলিসি</Link> মেনে নিচ্ছেন।
      </p>
    </div>
  );
}