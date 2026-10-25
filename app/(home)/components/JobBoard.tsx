/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { CIRCULARS } from '@/utils/data';
import { bn, totalPosts } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';
import CircularCard from './CircularCard';
import PostTable from './PostTable';
import EligibilityChecker from './EligibilityChecker';
import DetailModal from './DetailModal';
import ApplySupportModal from './ApplySupportModal'; // Import new modal

export default function JobBoard() {
  const { state, update } = useApp();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [applyId, setApplyId] = useState<string | null>(null); // New state

  const filtered = CIRCULARS
    .filter((c) => state.cat === 'all' || c.cat === state.cat)
    .filter((c) => {
      const q = state.q.trim().toLowerCase();
      if (!q) return true;
      return (c.org + c.orgEn + c.loc + c.posts.map((p) => p.n).join(' ')).toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (state.sort === 'posts') return totalPosts(b) - totalPosts(a);
      if (state.sort === 'new') return new Date(b.start).getTime() - new Date(a.start).getTime();
      return new Date(a.end).getTime() - new Date(b.end).getTime();
    });

  const totalP = filtered.reduce((s, c) => s + totalPosts(c), 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="jobs">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <div className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          জব বোর্ড
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          চলমান সরকারি চাকরির সার্কুলার
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          সার্কুলার দেখুন, "আবেদন করুন" চাপুন। বাকিটা আমাদের টিম দেখবে।
        </p>
      </div>

      <EligibilityChecker />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {/* ... (view toggle & search/filter same as before) ... */}
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          <button
            onClick={() => update({ view: 'circ' })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${state.view === 'circ' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
          >
            সার্কুলার ভিউ
          </button>
          <button
            onClick={() => update({ view: 'post' })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${state.view === 'post' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
          >
            পদভিত্তিক ভিউ
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={state.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="পদ বা প্রতিষ্ঠান…"
              className="w-44 border-0 bg-transparent outline-none placeholder:text-slate-400"
            />
          </label>
          <select
            value={state.sort}
            onChange={(e) => update({ sort: e.target.value as typeof state.sort })}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="dl">শেষ তারিখ আগে</option>
            <option value="posts">বেশি পদ আগে</option>
            <option value="new">নতুন আগে</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-500">
        {bn(filtered.length)}টি সার্কুলার · মোট {bn(totalP)}টি পদ
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          কোনো সার্কুলার পাওয়া যায়নি 😕 অন্য শব্দ দিয়ে খুঁজুন।
        </div>
      ) : state.view === 'circ' ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <CircularCard 
              key={c.id} 
              circular={c} 
              index={i} 
              onDetail={setDetailId} 
              onApply={setApplyId} // Pass setter
            />
          ))}
        </div>
      ) : (
        <PostTable circulars={filtered} />
      )}

      {/* Modals */}
      <DetailModal id={detailId} onClose={() => setDetailId(null)} />
      <ApplySupportModal id={applyId} onClose={() => setApplyId(null)} /> 
    </section>
  );
}