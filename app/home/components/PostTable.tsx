'use client';
import Link from 'next/link';
import type { Circular, PostRow, Fit } from '@/utils/types';
import { bn, catCount, fmtDate, postFit, totalPosts } from '@/utils/helpers';
import { EDU } from '@/utils/data';
import { useApp } from '@/utils/AppContext';

interface Props { circulars: Circular[] }

export default function PostTable({ circulars }: Props) {
  const { state } = useApp();
  let rows: PostRow[] = [];

  circulars.forEach((c) => {
    if (!c.posts.length) {
      rows.push({
        c,
        p: { n: `${bn(catCount(c))} ক্যাটাগরির পদ (বিজ্ঞপ্তিতে)`, v: totalPosts(c) },
        fit: state.user ? 'unk' : null,
      });
      return;
    }
    c.posts.forEach((p) => rows.push({ c, p, fit: postFit(c, p, state.user) }));
  });

  if (state.q) {
    const q = state.q.toLowerCase();
    rows = rows.filter((r) => (r.p.n + r.c.org + r.c.loc).toLowerCase().includes(q));
  }

  if (state.user) {
    const order: Record<string, number> = { ok: 0, unk: 1, no: 2 };
    rows.sort((a, b) => order[a.fit ?? 'unk'] - order[b.fit ?? 'unk']);
  }

  const fitHtml = (f: Fit) => {
    if (f === 'ok') return <span className="text-xs font-semibold text-emerald-600">✓ উপযুক্ত</span>;
    if (f === 'no') return <span className="text-xs font-semibold text-red-600">✕ উপযুক্ত নয়</span>;
    if (f === 'unk') return <span className="text-xs font-semibold text-amber-600">? যাচাই করুন</span>;
    return <span>—</span>;
  };

  if (!rows.length) {
    return <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">কোনো পদ পাওয়া যায়নি।</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-12 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
        <div className="col-span-3">পদের নাম</div>
        <div className="col-span-2">প্রতিষ্ঠান</div>
        <div className="col-span-1">পদ</div>
        <div className="col-span-1">গ্রেড</div>
        <div className="col-span-2">যোগ্যতা / ফি</div>
        <div className="col-span-1">{state.user ? 'উপযুক্ত' : 'শেষ'}</div>
        <div className="col-span-2"></div>
      </div>

      {rows.map((r, i) => (
        <div key={`${r.c.id}-${i}`} className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 text-sm last:border-0 hover:bg-slate-50 md:grid-cols-12 md:items-center md:gap-3">
          <div className="md:col-span-3">
            <div className="font-semibold text-slate-900">{r.p.n}</div>
            <div className="text-xs text-slate-500">{r.c.scope === 'national' ? 'সকল জেলা' : `${r.c.loc} জেলা`}</div>
          </div>
          <div className="md:col-span-2">{r.c.org}</div>
          <div className="md:col-span-1"><b>{r.p.v ? bn(r.p.v) : '—'}</b></div>
          <div className="md:col-span-1">{r.p.g ? `${bn(r.p.g)}তম` : '—'}</div>
          <div className="md:col-span-2">
            {r.p.edu ? EDU[r.p.edu] : '—'}
            {r.p.fee ? ` · ৳${bn(r.p.fee)}` : ''}
          </div>
          <div className="md:col-span-1">
            {state.user ? fitHtml(r.fit) : fmtDate(r.c.end)}
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Link href={`/apply?c=${r.c.id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
              আবেদন
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}