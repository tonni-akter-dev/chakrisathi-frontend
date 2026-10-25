'use client';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';
import { CIRCULARS } from '@/utils/data';
import { bn, catCount, fmtDate, fmtTime, totalPosts, timeLeft } from '@/utils/helpers';

interface Props {
  id: string | null;
  onClose: () => void;
}

export default function DetailModal({ id, onClose }: Props) {
  const c = CIRCULARS.find((x) => x.id === id);
  if (!c) return null;
  const ms = timeLeft(c);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-slate-900 px-7 py-6 text-white">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/30 bg-white/20 font-bold" style={{ background: c.color }}>
              {c.ab}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{c.org}</h3>
              <p className="text-sm text-white/80">{c.orgEn} · 📍 {c.loc}</p>
            </div>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-2">
            {ms > 0 ? (
              <span className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium">
                শেষ: {fmtDate(c.end)}, {fmtTime(c.end)}
              </span>
            ) : (
              <span className="rounded-lg bg-red-500/80 px-3 py-1.5 text-sm font-medium">আবেদন শেষ</span>
            )}
            <span className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium">{bn(totalPosts(c))}টি পদ</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              ['আবেদন শুরু', `${fmtDate(c.start)}, ${fmtTime(c.start)}`],
              ['আবেদনের শেষ', `${fmtDate(c.end)}, ${fmtTime(c.end)}`],
              ['মোট পদ', `${bn(catCount(c))} ক্যাটাগরি · ${bn(totalPosts(c))}টি`],
              ['বয়সসীমা', c.age?.note ?? 'বিজ্ঞপ্তি দেখুন'],
              ['কারা পারবে', c.district],
              ['সার্ভিস চার্জ', '৳১০০ + SMS ৳১৫/পদ'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 px-3.5 py-2.5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{k}</div>
                <div className="mt-0.5 text-sm font-medium text-slate-900">{v}</div>
              </div>
            ))}
          </div>

          {c.note && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">📌 {c.note}</div>
          )}

          <h4 className="mb-3 mt-6 text-base font-semibold">পদের তালিকা</h4>
          {c.posts.length ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">পদ ও যোগ্যতা</th>
                    <th className="px-3 py-2">পদ</th>
                    <th className="px-3 py-2">গ্রেড ও বেতন</th>
                    <th className="px-3 py-2">ফি</th>
                  </tr>
                </thead>
                <tbody>
                  {c.posts.map((p) => (
                    <tr key={p.n} className="border-t border-slate-100">
                      <td className="px-3 py-2.5 font-medium">
                        {p.n}
                        {p.q && <div className="mt-0.5 text-xs font-normal text-slate-500">{p.q}</div>}
                      </td>
                      <td className="px-3 py-2.5">{p.v ? `${bn(p.v)}টি` : '—'}</td>
                      <td className="px-3 py-2.5">
                        {p.g ? (
                          <>
                            {bn(p.g)}তম গ্রেড
                            <div className="text-xs text-slate-500">৳{p.sal}</div>
                          </>
                        ) : 'বিজ্ঞপ্তি দেখুন'}
                      </td>
                      <td className="px-3 py-2.5">{p.fee ? `৳${bn(p.fee)}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              এই সার্কুলারে {bn(catCount(c))} ক্যাটাগরিতে {bn(totalPosts(c))}টি পদ আছে। পদের নাম মূল বিজ্ঞপ্তিতে দেখুন।
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <a href={c.link} target="_blank" rel="noopener" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
              <ExternalLink className="h-4 w-4" /> মূল বিজ্ঞপ্তি
            </a>
            <Link href={`/apply?c=${c.id}`} onClick={onClose} className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-700">
              আবেদন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}