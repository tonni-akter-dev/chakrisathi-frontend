    import { Megaphone, ExternalLink, Calendar } from 'lucide-react';

const CIRCULARS = [
  { id: 'wtmu', org: 'উৎসে কর ব্যবস্থাপনা ইউনিট', en: 'WTMU', posts: 13, end: '০৪ নভেম্বর ২০২৬', color: '#12B8A6', active: true },
  { id: 'hbri', org: 'হাউজিং অ্যান্ড বিল্ডিং রিসার্চ', en: 'HBRI', posts: 17, end: '১৫ নভেম্বর ২০২৬', color: '#F2459B', active: true },
  { id: 'tz3ctg', org: 'কর অঞ্চল-৩, চট্টগ্রাম', en: 'TZ-3', posts: 33, end: '০৫ নভেম্বর ২০২৬', color: '#0E9F6E', active: true },
  { id: 'dcsherpur', org: 'জেলা প্রশাসকের কার্যালয়, শেরপুর', en: 'DC', posts: 15, end: '০৪ নভেম্বর ২০২৬', color: '#5B3DF5', active: false },
];

export default function CircularsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">সার্কুলারসমূহ</h1>
        <p className="text-sm text-slate-500">সব চলমান সরকারি চাকরির সার্কুলার এখান থেকে ম্যানেজ করুন।</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CIRCULARS.map((c) => (
          <div key={c.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: c.color }}>
                {c.en}
              </div>
              {c.active ? (
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">সক্রিয়</span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">শেষ</span>
              )}
            </div>
            
            <h3 className="mt-4 text-sm font-bold text-slate-900 leading-tight">{c.org}</h3>
            
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2"><Megaphone className="h-3.5 w-3.5 text-slate-400"/> {c.posts}টি পদ</div>
              <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-slate-400"/> শেষ: {c.end}</div>
            </div>

            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                আবেদন দেখুন
              </button>
              <a href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}                                                                                                                          