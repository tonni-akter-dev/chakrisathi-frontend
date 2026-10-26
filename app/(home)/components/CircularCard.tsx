/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect } from 'react';
import { Heart, MapPin } from 'lucide-react';
import type { Circular } from '@/utils/types';
import { bn, catCount, fmtDate, fmtTime, leftText, progress, timeLeft, totalPosts } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';

interface Props {
  circular: Circular;
  index: number;
  onDetail: (id: string) => void;
  onApply: (id: string) => void;
}

export default function CircularCard({ circular: c, index, onDetail, onApply }: Props) {
  const { state, toggleSave } = useApp();
  
  const [isMounted, setIsMounted] = useState(false);
  
  // ✅ 1. Group all time-based calculations into a single state object
  const [timeData, setTimeData] = useState({
    lt: { t: '', cls: 'safe' as 'safe' | 'warn' | 'closed' },
    isNew: false,
    isOpen: true,
    prog: 0,
  });

  // ✅ 2. Calculate everything safely inside useEffect (this runs only in the browser)
  useEffect(() => {
    setIsMounted(true);
    
    const tl = timeLeft(c);
    const now = Date.now();
    
    setTimeData({
      lt: leftText(tl),
      isNew: now - new Date(c.start).getTime() < 5 * 864e5,
      isOpen: tl > 0,
      prog: progress(c),
    });
  }, [c]);

  const tp = totalPosts(c);
  const isSaved = state.saved.includes(c.id);

  return (
    <article
      className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <button
        onClick={() => toggleSave(c.id)}
        className={`absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full transition ${
          isSaved ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500'
        }`}
      >
        <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500' : ''}`} />
      </button>

      <div className="flex items-start gap-3 pr-10">
        <div className="grid h-12 w-12 flex-none place-items-center rounded-xl text-sm font-bold text-white" style={{ background: c.color }}>
          {c.ab}
        </div>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-tight text-slate-900">{c.org}</h3>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3" /> {c.loc}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {/* ✅ 3. Use timeData from state */}
        {isMounted && timeData.isNew && (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">নতুন</span>
        )}
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          {c.scope === 'national' ? 'সকল জেলা' : 'জেলা'}
        </span>
        {isMounted && timeData.isOpen && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            timeData.lt.cls === 'closed' ? 'bg-red-50 text-red-600' : timeData.lt.cls === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
          }`}>
            {timeData.lt.t} বাকি
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {c.posts.slice(0, 2).map((p) => (
          <span key={p.n} className="rounded-md border border-dashed border-slate-200 px-2 py-0.5 text-xs text-slate-600">
            {p.n}
          </span>
        ))}
        {c.posts.length > 2 && (
          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
            +{bn(c.posts.length - 2)}টি পদ
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-50 py-2.5 text-center text-xs">
        <div>
          <div className="font-semibold text-slate-900">{bn(tp)}</div>
          <div className="text-[10px] text-slate-500">মোট পদ</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900">{bn(catCount(c))}</div>
          <div className="text-[10px] text-slate-500">ক্যাটাগরি</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900">{fmtDate(c.end).split(' ')[0]}</div>
          <div className="text-[10px] text-slate-500">{fmtDate(c.end).split(' ')[1]}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-600">
          <span>শেষ: {fmtDate(c.end)}, {fmtTime(c.end)}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-emerald-400 via-amber-400 to-orange-400"
            style={{ width: `${isMounted ? timeData.prog : 0}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => onDetail(c.id)} className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50">
          বিস্তারিত
        </button>
        {(!isMounted || timeData.isOpen) ? (
          <button 
            onClick={() => onApply(c.id)} 
            className="flex-1 rounded-lg bg-brand-600 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
          >
            আবেদনে সাহায্য
          </button>
        ) : (
          <span className="flex-1 cursor-not-allowed rounded-lg bg-slate-100 py-2 text-center text-sm font-medium text-slate-400">
            আবেদন শেষ
          </span>
        )}
      </div>
    </article>
  );
}