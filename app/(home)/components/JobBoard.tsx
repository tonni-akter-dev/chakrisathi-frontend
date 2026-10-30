/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useGetAllCircularsQuery } from '@/app/redux/features/apis/circular-api';
import { bn } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';
import CircularCard from './CircularCard';
import PostTable from './PostTable';
import DetailModal from './DetailModal';
import ApplySupportModal from './ApplySupportModal';

export default function JobBoard() {
  const { state, update } = useApp();
  
  const [selectedCircular, setSelectedCircular] = useState<any>(null);
  const [applyCircular, setApplyCircular] = useState<any>(null);

  const { data: circulars = [], isLoading, isError } = useGetAllCircularsQuery({
    search: state.q,
    cat: state.cat,
    sort: state.sort,
  });

  const totalP = circulars.reduce((sum: number, c: any) => sum + (c.total || c.posts?.length || 0), 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6" id="jobs">
      <div className="mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex w-full lg:w-auto bg-white rounded-full p-1 border border-slate-200 shadow-sm">
          <button
            onClick={() => update({ view: 'circ' })}
            className={`flex-1 lg:flex-none rounded-full px-6 py-2 text-sm font-bold transition ${
              state.view === 'circ' 
                ? 'bg-[#7c3aed] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}>
            সার্কুলার ভিউ
          </button>
          <button
            onClick={() => update({ view: 'post' })}
            className={`flex-1 lg:flex-none rounded-full px-6 py-2 text-sm font-bold transition ${
              state.view === 'post' 
                ? 'bg-[#7c3aed] text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}>
            পদভিত্তিক ভিউ
          </button>
        </div>

        {/* Search & Sort (Pill Design) */}
        <div className="flex w-full lg:w-auto flex-col sm:flex-row gap-3">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus-within:border-[#7c3aed] transition">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={state.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="পদ বা প্রতিষ্ঠান খুঁজুন..."
              className="w-full sm:w-56 border-0 bg-transparent outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
            <select
              value={state.sort}
              onChange={(e) => update({ sort: e.target.value as 'dl' | 'posts' | 'new' })}
              className="w-full sm:w-auto bg-transparent outline-none font-bold text-slate-700 cursor-pointer"
            >
              <option value="dl">শেষ তারিখ আগে</option>
              <option value="posts">বেশি পদ আগে</option>
              <option value="new">নতুন আগে</option>
            </select>
          </div>
        </div>
      </div>

      {/* রেজাল্ট লাইন */}
      <div className="mb-6 text-sm font-medium text-slate-600">
        {bn(circulars.length)}টি সার্কুলার · মোট {bn(totalP)}টি পদ
      </div>

      {/* লোডিং এবং ডাটা রেন্ডার */}
      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-[#7c3aed]" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center text-rose-600 font-medium">
          ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।
        </div>
      ) : (
        <>
          {circulars.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20">
              <Search className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">কোনো সার্কুলার পাওয়া যায়নি</h3>
              <p className="text-slate-500 mt-1">অন্য শব্দ দিয়ে খুঁজে দেখুন অথবা ফিল্টার পরিবর্তন করুন।</p>
            </div>
          ) : state.view === 'circ' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {circulars.map((c: any, i: number) => (
                <CircularCard 
                  key={c._id || c.id} 
                  circular={c} 
                  index={i} 
                  onDetail={() => setSelectedCircular(c)} 
                  onApply={() => setApplyCircular(c)} 
                />
              ))} 
            </div>
          ) : (
            <PostTable circulars={circulars} />
          )}
        </>
      )}

      {/* মডালসমূহ */}
      {selectedCircular && (
        <DetailModal 
          circular={selectedCircular} 
          onClose={() => setSelectedCircular(null)} 
        />
      )}
      
      {applyCircular && (
        <ApplySupportModal 
          circular={applyCircular} 
          onClose={() => setApplyCircular(null)} 
        />
      )}
    </section>
  );
}