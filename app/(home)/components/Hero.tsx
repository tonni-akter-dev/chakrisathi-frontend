/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle2, Search, Smartphone } from 'lucide-react';
import { CIRCULARS } from '@/utils/data';
import { bn, timeLeft, totalPosts } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';

const QUICK_TAGS = ['অফিস সহায়ক', 'কম্পিউটার অপারেটর', 'ড্রাইভার'];

export default function Hero() {
  const { update } = useApp();
  
  // State for stats (Default 0 to avoid build crash)
  const [stats, setStats] = useState({ activeCount: 0, totalPosts: 0 });

  // Calculate stats only on the client side after mount
  useEffect(() => {
    const active = CIRCULARS.filter((c) => timeLeft(c) > 0);
    const posts = active.reduce((s, c) => s + totalPosts(c), 0);
    setStats({ activeCount: active.length, totalPosts: posts });
  }, []);

  // Handlers
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
    update({ q, view: 'post' });
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTag = (q: string) => {
    update({ q, view: 'post' });
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/50">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-24 sm:px-6">
        
        {/* =========================================
            LEFT SIDE: Step-by-step Content
            ========================================= */}
        <div>
          {/* 1. Live Indicator */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 py-1 text-sm font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {bn(stats.activeCount)}টি সার্কুলার লাইভ
          </div>

          {/* 2. Headline (Line by Line) */}
          <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl md:text-[54px]">
            <span className="block">কম্পিউটার নেই?</span>
            <span className="block text-brand-600 mt-1">সরকারি চাকরির আবেদন</span>
            <span className="block mt-1">আমরাই করে দেবো</span>
          </h1>

          {/* 3. Description */}
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-slate-600">
            পদ বাছাই করুন, কাগজপত্রের ছবি পাঠান, বিকাশ/নগদে ফি দিন। টেলিটকে আবেদন পূরণ থেকে চূড়ান্ত জমা পর্যন্ত সব আমাদের দায়িত্ব।
          </p>

          {/* 4. Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="mt-8 flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm transition-shadow focus-within:border-brand-300 focus-within:shadow-md"
          >
            <Search className="ml-2 h-4 w-4 flex-none text-slate-400" />
            <input
              name="q"
              placeholder="পদ বা প্রতিষ্ঠান খুঁজুন…"
              className="flex-1 border-0 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400"
            />
            <button 
              type="submit" 
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              খুঁজুন
            </button>
          </form>

          {/* 5. Quick Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
            <span className="font-medium">জনপ্রিয়:</span>
            {QUICK_TAGS.map((q) => (
              <button
                key={q}
                onClick={() => handleTag(q)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700 hover:shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>

          {/* 6. Stats Grid */}
          <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            <div>
              <div className="text-2xl font-bold text-slate-900">{bn(stats.activeCount)}টি</div>
              <div className="mt-0.5 text-xs font-medium text-slate-500">চলমান সার্কুলার</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{bn(stats.totalPosts)}টি</div>
              <div className="mt-0.5 text-xs font-medium text-slate-500">মোট শূন্যপদ</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">৳১০০</div>
              <div className="mt-0.5 text-xs font-medium text-slate-500">থেকে সার্ভিস চার্জ</div>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE: Image & Floating Cards
            ========================================= */}
        <div className="relative hidden md:block ml-auto w-full max-w-md">
          {/* Main Image */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80&auto=format&fit=crop"
              alt="শিক্ষার্থীরা"
              width={900}
              height={1100}
              className="aspect-[4/4.5] w-full object-cover"
              priority
            />
          </div>

          {/* Floating Card 1: Success */}
          <div className="absolute -left-6 top-10 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 pr-5 shadow-lg shadow-slate-200/40">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">আবেদন সম্পন্ন!</div>
              <div className="text-xs text-slate-500">অফিস সহায়ক — HBRI</div>
            </div>
          </div>

          {/* Floating Card 2: Mobile Upload */}
          <div className="absolute -right-4 bottom-12 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 pr-5 shadow-lg shadow-slate-200/40">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">মোবাইল থেকেই</div>
              <div className="text-xs text-slate-500">ছবি তুলে আপলোড করুন</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}