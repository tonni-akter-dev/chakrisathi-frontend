/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, MapPin, ExternalLink } from 'lucide-react';

interface Props {
  circular: any | null;
  onClose: () => void;
}

export default function DetailModal({ circular: c, onClose }: Props) {
  // 💡 কাউন্টডাউন টাইমারের জন্য স্টেট
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!c) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(c.end).getTime();
      const distance = end - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [c]);

  if (!c) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('bn-BD', {
      hour: 'numeric', minute: '2-digit'
    });
  };

  // বাংলা সংখ্যা কনভার্টার
  const toBn = (num: number | string) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d)]);
  };

  const totalVacancies = c.total || c.posts?.reduce((sum: number, p: any) => sum + (Number(p.v) || 0), 0) || 0;
  const isActive = new Date(c.end) > new Date();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl bg-[#fafafa] shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}>
        
        {/* ================= হেডার সেকশন (টিল গ্রেডিয়েন্ট) ================= */}
        <div className="relative bg-linear-to-br from-[#0E9F8E] to-[#1D5B5A] p-6 sm:p-8 text-white overflow-hidden flex-none">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <button 
            onClick={onClose} 
            className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>

          <div className="relative flex items-start gap-4 mb-6">
            <div className="grid h-14 w-16 flex-none place-items-center rounded-lg border-2 border-white/40 bg-white/10 font-bold tracking-widest text-white backdrop-blur-sm text-lg">
              {c.ab || 'JOB'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{c.org}</h1>
              <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
                {c.orgEn} <span>•</span> <MapPin className="h-3.5 w-3.5" /> {c.loc}
              </p>
            </div>
          </div>

          {/* কাউন্টডাউন বক্স */}
          {isActive ? (
            <div className="relative grid grid-cols-4 gap-3 max-w-sm">
              <div className="rounded-xl bg-white/10 border border-white/10 p-2 text-center">
                <div className="text-xl font-bold">{toBn(timeLeft.days)}</div>
                <div className="text-[10px] text-white/70">দিন</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-2 text-center">
                <div className="text-xl font-bold">{toBn(timeLeft.hours)}</div>
                <div className="text-[10px] text-white/70">ঘণ্টা</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-2 text-center">
                <div className="text-xl font-bold">{toBn(timeLeft.minutes)}</div>
                <div className="text-[10px] text-white/70">মিনিট</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-2 text-center">
                <div className="text-xl font-bold">{toBn(timeLeft.seconds)}</div>
                <div className="text-[10px] text-white/70">সেকেন্ড</div>
              </div>
            </div>
          ) : (
            <div className="inline-block rounded-lg bg-red-500/80 px-4 py-2 font-bold">
              আবেদন শেষ
            </div>
          )}
        </div>

        {/* ================= স্ক্রলযোগ্য বডি ================= */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* তথ্য গ্রিড */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl bg-[#f8f5ff] p-4 border border-[#e9d5ff]/50">
              <p className="text-xs text-slate-500 font-medium mb-1">আবেদন শুরু</p>
              <p className="text-sm font-bold text-slate-900">{formatDate(c.start)}, {formatTime(c.start)}</p>
            </div>
            <div className="rounded-xl bg-[#f8f5ff] p-4 border border-[#e9d5ff]/50">
              <p className="text-xs text-slate-500 font-medium mb-1">আবেদনের শেষ</p>
              <p className="text-sm font-bold text-slate-900">{formatDate(c.end)}, {formatTime(c.end)}</p>
            </div>
            <div className="rounded-xl bg-[#f8f5ff] p-4 border border-[#e9d5ff]/50">
              <p className="text-xs text-slate-500 font-medium mb-1">মোট পদ</p>
              <p className="text-sm font-bold text-slate-900">{toBn(c.cats || c.posts?.length || 0)} ক্যাটাগরি • {toBn(totalVacancies)}টি পদ</p>
            </div>
            <div className="rounded-xl bg-[#f8f5ff] p-4 border border-[#e9d5ff]/50">
              <p className="text-xs text-slate-500 font-medium mb-1">বয়সসীমা</p>
              <p className="text-sm font-bold text-slate-900">{c.age?.note || 'বিজ্ঞপ্তি দেখুন'}</p>
            </div>
            <div className="rounded-xl bg-[#f8f5ff] p-4 border border-[#e9d5ff]/50">
              <p className="text-xs text-slate-500 font-medium mb-1">কোথায় আবেদন করতে পারবে</p>
              <p className="text-sm font-bold text-slate-900">{c.district || 'সকল জেলা'}</p>
            </div>
            <div className="rounded-xl bg-[#f8f5ff] p-4 border border-[#e9d5ff]/50">
              <p className="text-xs text-slate-500 font-medium mb-1">আমাদের সার্ভিস চার্জ</p>
              <p className="text-sm font-bold text-slate-900">৳১০০ থেকে + SMS ৳১৫/পদ</p>
            </div>
          </div>

          {/* পদের তালিকা */}
          <h3 className="text-lg font-bold text-slate-900 mb-4">পদের তালিকা</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white mb-4">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8f5ff] border-b border-slate-200 text-slate-600 font-bold text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">পদের নাম ও যোগ্যতা</th>
                  <th className="px-4 py-3 text-center">পদ</th>
                  <th className="px-4 py-3 text-center">গ্রেড ও বেতন</th>
                  <th className="px-4 py-3 text-center">সরকারি ফি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {c.posts?.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">{p.n}</div>
                      <div className="text-xs text-slate-500 mt-1">{p.q || 'বিজ্ঞপ্তি দেখুন'}</div>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-slate-700">
                      {toBn(p.v || 0)}টি
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-semibold text-slate-800">{toBn(p.g || '')}তম গ্রেড</div>
                      <div className="text-xs text-slate-500 mt-0.5">{p.sal}</div>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-slate-900">
                      ৳{toBn(p.fee || 112)}
                    </td>
                  </tr>
                ))}
                {(!c.posts || c.posts.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      পদগুলোর বিস্তারিত জানতে মূল বিজ্ঞপ্তি দেখুন।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= ফুটার বাটন (ফিক্সড) ================= */}
        <div className="flex-none flex gap-3 p-4 bg-white border-t border-slate-100">
          <Link
            href={c.pdfUrl || c.link || '#'} 
            target="_blank" 
            rel="noreferrer" 
            className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-[#7c3aed] px-4 py-3 text-sm font-bold text-[#7c3aed] hover:bg-[#f3e8ff] transition">
            <ExternalLink className="h-4 w-4" /> মূল বিজ্ঞপ্তি / নিজে আবেদন
          </Link>
          {isActive && c.allowServiceApply !== false ? (
            <Link 
              href={`/apply/${c._id || c.id}`} 
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-500 to-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition"
            >
              আবেদন করুন
            </Link>
          ) : (
            <button 
              disabled 
              className="flex-1 rounded-full bg-slate-200 px-4 py-3 text-sm font-bold text-slate-400 cursor-not-allowed"
            >
              আবেদন শেষ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}