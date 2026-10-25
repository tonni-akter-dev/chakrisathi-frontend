/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect } from 'react';
import { CIRCULARS } from '@/utils/data';
import { bn, leftText, timeLeft, totalPosts } from '@/utils/helpers';

export default function Ticker() {
  // Build time crash thekanor jonno initial state faka array
  const [items, setItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Eta shudhu browser e run hobe (build time e na)
    const tickerItems = [...CIRCULARS]
      .sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime())
      .map((c) => {
        const lt = leftText(timeLeft(c));
        return (
          <span key={c.id} className="inline-flex items-center gap-2 text-xs text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium text-white">{c.org}</span>
            <span className="text-slate-500">·</span>
            <span>{bn(totalPosts(c))}টি পদ</span>
            <span className="text-slate-500">·</span>
            <span className={lt.cls === 'closed' ? 'text-red-400' : lt.cls === 'warn' ? 'text-amber-400' : 'text-emerald-400'}>
              {lt.t} বাকি
            </span>
          </span>
        );
      });
      
    setItems(tickerItems);
  }, []);

  // Jodi data load na hoy, kichu render korbe na (ba skeleton dekhate paro)
  if (items.length === 0) {
    return <div className="border-b border-slate-800 bg-slate-900 h-8" />;
  }

  return (
    <div className="border-b border-slate-800 bg-slate-900 overflow-hidden">
      <div className="mx-auto max-w-6xl flex w-max gap-10 py-2 whitespace-nowrap animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
        {items}
        {items}
      </div>
    </div>
  );
}