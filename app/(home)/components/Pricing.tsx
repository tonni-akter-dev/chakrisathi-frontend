'use client';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { SETTINGS } from '@/utils/data';
import { calcFees, serviceFee } from '@/utils/fees';
import { bn } from '@/utils/helpers';

export default function Pricing() {
  const [n, setN] = useState(1);
  const [fee, setFee] = useState(112);

  const pricing = calcFees(Array.from({ length: n }, () => ({ n: '', fee })), null, SETTINGS);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="pricing">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <div className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">খরচ</div>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">স্বচ্ছ ফি — কোনো লুকানো চার্জ নেই</h2>
        <p className="mt-2 text-sm text-slate-600">
          মোট = সরকারি ফি + SMS ৳{bn(SETTINGS.smsFee)}/পদ + সার্ভিস চার্জ। বেশি পদে ছাড়।
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((tier) => {
          const f = serviceFee(tier, SETTINGS);
          const save = tier * SETTINGS.tiers[0] - f;
          const popular = tier === 2;
          return (
            <div key={tier} className={`relative rounded-2xl border-2 bg-white p-6 text-center transition ${popular ? 'border-brand-600 shadow-lg md:-translate-y-2' : 'border-slate-200'}`}>
              {popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold text-white">জনপ্রিয়</span>
              )}
              <h3 className="text-sm font-medium text-slate-600">{bn(tier)}টি পদে আবেদন</h3>
              <div className="my-2 text-4xl font-bold tracking-tight text-slate-900">৳{bn(f)}</div>
              <div className="text-xs text-slate-500">প্রতি পদে ~৳{bn(Math.round(f / tier))}</div>
              {save > 0 && <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">৳{bn(save)} সাশ্রয়</span>}
            </div>
          );
        })}
      </div>

      <div className="grid items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold">খরচ হিসাব করুন</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">কয়টি পদে আবেদন?</label>
              <div className="flex items-center gap-3 rounded-full border border-slate-200 px-2 py-1">
                <button onClick={() => setN(Math.max(1, n - 1))} className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 hover:bg-slate-200">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-semibold">{bn(n)}</span>
                <button onClick={() => setN(Math.min(10, n + 1))} className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 hover:bg-slate-200">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium">সরকারি ফি</label>
              <select value={fee} onChange={(e) => setFee(+e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option value={56}>৳৫৬ (২০তম গ্রেড)</option>
                <option value={112}>৳১১২ (১৩–১৯তম)</option>
                <option value={168}>৳১৬৮</option>
                <option value={223}>৳২২৩ (৯–১২তম)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <Line label={`সরকারি ফি (${bn(n)} × ৳${bn(fee)})`} val={`৳${bn(pricing.govt)}`} />
          <Line label={`SMS (${bn(n)} × ৳${bn(SETTINGS.smsFee)})`} val={`৳${bn(pricing.sms)}`} />
          <Line label={`সার্ভিস (${bn(n)}টি পদ)`} val={`৳${bn(pricing.service)}`} />
          <div className="mt-3 flex justify-between border-t-2 border-dashed border-slate-300 pt-3 text-lg font-bold">
            <span>মোট</span>
            <span className="text-brand-600">৳{bn(pricing.total)}</span>
          </div>
          {pricing.saved > 0 && (
            <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              🎉 একসাথে আবেদনে ৳{bn(pricing.saved)} সাশ্রয়
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Line({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold">{val}</span>
    </div>
  );
}