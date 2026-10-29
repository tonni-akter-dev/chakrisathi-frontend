/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; // 💡 js-cookie ইমপোর্ট করুন
import { useLoginMutation } from '@/app/redux/features/apis/auth-api';

export default function LoginPage() {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isRedirecting, setIsRedirecting] = useState(false);

  // RTK Query Hook
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { email, password };
      const response = await login(payload).unwrap();

      // 💡 টোকেন সেভ করা (কুকি এবং লোকাল স্টোরেজ দুটোতেই)
      if (response.token) {
        // ১. কুকিতে টোকেন সেভ করা (মিডলওয়্যারে কাজে লাগবে)
        Cookies.set('token', response.token, { 
          expires: 7, // ৭ দিন পর এক্সপায়ার হবে
          secure: process.env.NODE_ENV === 'production', // প্রোডাকশনে HTTPS-এ কাজ করবে
          sameSite: 'strict' 
        });
        
        // ২. ইউজার ডাটা লোকাল স্টোরেজে সেভ করা (ইউআই-তে দেখানোর জন্য)
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // ৩. (ঐচ্ছিক) যদি ইউজার ডাটাও কুকিতে রাখতে চান
        // Cookies.set('user', JSON.stringify(response.user), { expires: 7 });
      }

      // সফল মেসেজ
      toast.success('সফলভাবে লগইন হয়েছে!');
      
      // রিডাইরেক্ট স্টেট অন করা হলো
      setIsRedirecting(true);

      // ১.৫ সেকেন্ড পর রিডাইরেক্ট হবে
      setTimeout(() => {
        router.push('/'); 
        router.refresh(); // 💡 মিডলওয়্যার যাতে নতুন কুকি রিড করতে পারে তাই refresh
      }, 1500);

    } catch (err: any) {
      console.error("Login Error:", err);
      toast.error(err?.data?.msg || 'লগইন ব্যর্থ হয়েছে! ইমেইল ও পাসওয়ার্ড চেক করুন।');
      setIsRedirecting(false); 
    }
  };

  return (
    <div className="w-full max-w-105">
      
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
          
          {/* Email Input */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              ইমেইল
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                required
                disabled={isRedirecting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50 disabled:text-slate-500"
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
                disabled={isRedirecting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50 disabled:text-slate-500"
              />
              <button
                type="button"
                disabled={isRedirecting}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isRedirecting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                লগইন হচ্ছে...
              </span>
            ) : isRedirecting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                রিডাইরেক্ট হচ্ছে...
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