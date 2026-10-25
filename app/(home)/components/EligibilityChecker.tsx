'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { CIRCULARS } from '@/utils/data';
import { bn, postFit } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';

export default function EligibilityChecker() {
  const { update } = useApp();
  const [result, setResult] = useState<{ age: number; ok: number; unk: number } | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const age = Number((e.currentTarget.elements.namedItem('age') as HTMLInputElement).value);
    const edu = Number((e.currentTarget.elements.namedItem('edu') as HTMLSelectElement).value);
    update({ user: { age, edu }, view: 'post' });

    let ok = 0;
    let unk = 0;
    CIRCULARS.forEach((c) =>
      c.posts.forEach((p) => {
        const f = postFit(c, p, { age, edu });
        if (f === 'ok') ok += p.v || 1;
        if (f === 'unk') unk++;
      })
    );
    setResult({ age, ok, unk });
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-brand-50 to-orange-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">আমি কোন পদে আবেদন করতে পারব?</h3>
          <p className="mt-0.5 text-sm text-slate-600">বয়স ও শিক্ষাগত যোগ্যতা দিন — উপযুক্ত পদ দেখাবো।</p>
        </div>
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
          <input
            name="age"
            type="number"
            min={15}
            max={40}
            placeholder="বয়স"
            required
            className="w-20 rounded-lg border border-white bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <select
            name="edu"
            required
            defaultValue=""
            className="rounded-lg border border-white bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
          >
            <option value="">যোগ্যতা</option>
            <option value="1">অষ্টম</option>
            <option value="2">এসএসসি</option>
            <option value="3">এইচএসসি</option>
            <option value="4">ডিপ্লোমা</option>
            <option value="5">স্নাতক</option>
          </select>
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            যাচাই
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 text-sm font-medium">
          {result.age < 18 ? (
            <span className="text-amber-700">⚠️ বেশিরভাগ পদে ন্যূনতম বয়স ১৮ বছর।</span>
          ) : result.age > 32 ? (
            <span className="text-amber-700">⚠️ সাধারণভাবে সর্বোচ্চ ৩২ বছর।</span>
          ) : (
            <>
              <span className="text-emerald-700">🎉 নিশ্চিত উপযুক্ত: <b>{bn(result.ok)}টি পদ</b></span>
              <span className="text-amber-700">আরও {bn(result.unk)}টি বিজ্ঞপ্তিতে যাচাই করুন</span>
            </>
          )}
          <button onClick={() => { setResult(null); update({ user: null }); }} className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
            <X className="h-3 w-3" /> রিসেট
          </button>
        </div>
      )}
    </div>
  );
}