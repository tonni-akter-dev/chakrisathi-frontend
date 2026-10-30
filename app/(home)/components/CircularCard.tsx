

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { MapPin, Heart} from 'lucide-react';
import Link from 'next/link';

interface Props {
  circular: any;
  index: number;
  onDetail: () => void;
  onApply: () => void;
}

export default function CircularCard({ circular: c, index, onDetail }: Props) {
  const totalPosts = c.total || c.posts?.length || 0;
  const totalCats = c.cats || 1;
  
  return (
    <div 
      className="flex flex-col relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 💡 কার্ডের ওপরের কালারফুল বর্ডার */}
      <div className="h-1.5 w-full bg-linear-to-r from-teal-400 to-[#7c3aed]" />

      <div className="p-5 flex-1 flex flex-col">
        {/* হেডার: লোগো, প্রতিষ্ঠান, লোকেশন এবং উইশলিস্ট আইকন */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-3 items-center">
            <div 
              className="grid h-12 w-12 flex-none place-items-center rounded-lg text-white font-bold text-lg shadow-sm"
              style={{ backgroundColor: c.color || '#7c3aed' }}
            >
              {c.ab || 'JOB'}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 leading-tight line-clamp-1">{c.org}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {c.loc || 'সকল জেলা'}
              </p>
            </div>
          </div>
          <button className="text-slate-300 hover:text-rose-500 transition">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* জেলা ব্যাজ */}
        <div className="mb-4">
          <span className="inline-block rounded-md bg-[#f3e8ff] px-2 py-1 text-[10px] font-bold text-[#7c3aed]">
            {c.scope === 'national' ? 'সকল জেলা' : 'নির্দিষ্ট জেলা'}
          </span>
        </div>

        {/* পোস্টের ট্যাগসমূহ */}
        <div className="flex flex-wrap gap-2 mb-4">
          {c.posts?.slice(0, 3).map((post: any, idx: number) => (
            <span key={idx} className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
              {post.n}
            </span>
          ))}
          {c.posts?.length > 3 && (
            <span className="rounded-md border border-dashed border-[#d8b4fe] bg-[#f3e8ff] px-2 py-1 text-[11px] font-bold text-[#7c3aed]">
              +{c.posts.length - 3}টি পদ
            </span>
          )}
          {(!c.posts || c.posts.length === 0) && (
            <span className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
              {totalCats} ক্যাটাগরির পদ — বিজ্ঞপ্তিত দেখুন
            </span>
          )}
        </div>

        {/* 💡 স্ট্যাটস বক্স (মাঝখানে) */}
        <div className="rounded-xl bg-[#f8f5ff] p-3 grid grid-cols-3 gap-2 text-center mb-5 mt-auto">
          <div>
            <div className="text-lg font-bold text-slate-900">{totalPosts}</div>
            <div className="text-[10px] font-semibold text-slate-500">মোট পদ</div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">{totalCats}</div>
            <div className="text-[10px] font-semibold text-slate-500">ক্যাটাগরি</div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">{totalPosts}</div>
            <div className="text-[10px] font-semibold text-slate-500">নেড়ভার</div>
          </div>
        </div>

        {/* ডেডলাইন এবং প্রোগ্রেস বার */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-[11px] font-bold mb-2">
            <span className="text-slate-700">শেষ: {new Date(c.end).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' })}</span>
            <span className="text-orange-500">৫ দিন ০ ঘণ্টা বাকি</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-[60%] rounded-full bg-linear-to-r from-teal-400 via-amber-400 to-orange-500" />
          </div>
        </div>

        {/* বাটনসমূহ */}
        <div className="flex gap-2 mt-auto">
          <button 
            onClick={onDetail}
            className="flex-1 rounded-full border border-[#7c3aed] bg-white py-2.5 text-sm font-bold text-[#7c3aed] hover:bg-[#f3e8ff] transition"
          >
            বিস্তারিত
          </button>
          <Link href={`/apply/${c._id}`} className="flex-1 text-center rounded-full bg-[#7c3aed] py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
            আবেদন করুন
          </Link>
          
        </div>
      </div>
    </div>
  );
}