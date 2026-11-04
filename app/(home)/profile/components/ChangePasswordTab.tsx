/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, Check, X, KeyRound } from 'lucide-react';
import { useChangePasswordMutation } from '@/app/redux/features/apis/auth-api';

type Field = 'current' | 'next' | 'confirm';

// API error থেকে বার্তা বের করা
const errMsg = (e: any) =>
  e?.data?.msg || e?.data?.error || (typeof e?.data === 'string' ? e.data : '') || 'পাসওয়ার্ড পরিবর্তন করা যায়নি';

export default function ChangePasswordTab() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [pass, setPass] = useState<Record<Field, string>>({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState<Record<Field, boolean>>({ current: false, next: false, confirm: false });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const update = (field: Field, value: string) => {
    setPass((p) => ({ ...p, [field]: value }));
    setError('');
    setDone(false);
  };

  // ===== নিয়মগুলো (লাইভ চেকলিস্ট) — সার্ভারও ঠিক এই দুটো যাচাই করে =====
  const rules = [
    { ok: pass.next.length >= 6, label: 'কমপক্ষে ৬ অক্ষর' },
    { ok: !!pass.next && pass.next !== pass.current, label: 'বর্তমান পাসওয়ার্ড থেকে আলাদা' },
  ];

  // ===== পাসওয়ার্ড শক্তি =====
  const strength = (() => {
    const p = pass.next;
    if (!p) return { score: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 2) return { score: s, label: 'দুর্বল', color: 'bg-red-500' };
    if (s <= 3) return { score: s, label: 'মাঝারি', color: 'bg-amber-500' };
    return { score: s, label: 'শক্তিশালী', color: 'bg-emerald-500' };
  })();

  const mismatch = !!pass.confirm && pass.next !== pass.confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pass.next.length < 6) return setError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
    if (pass.next === pass.current) return setError('নতুন পাসওয়ার্ড বর্তমানটার মতো হতে পারবে না');
    if (pass.next !== pass.confirm) return setError('নতুন পাসওয়ার্ড দুইবার একই হয়নি');

    try {
      const res: any = await changePassword({
        currentPassword: pass.current,
        newPassword: pass.next,
      }).unwrap();
      toast.success(res?.msg || 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে');
      setPass({ current: '', next: '', confirm: '' });
      setShow({ current: false, next: false, confirm: false });
      setDone(true);
    } catch (err) {
      const msg = errMsg(err);
      setError(msg);
      toast.error(msg);
    }
  };

  // ইনপুট (function হিসেবে ডাকা হচ্ছে, যাতে টাইপ করার সময় focus না হারায়)
  const renderInput = (field: Field, label: string, placeholder: string, autoComplete: string) => (
    <div>
      <label htmlFor={`pw-${field}`} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative mt-1.5">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={`pw-${field}`}
          type={show[field] ? 'text' : 'password'}
          required
          value={pass[field]}
          onChange={(e) => update(field, e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-lg border py-2.5 pl-10 pr-11 text-sm outline-none transition focus:ring-4 ${
            field === 'confirm' && mismatch
              ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/10'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label={show[field] ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
          tabIndex={-1}
        >
          {show[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="my-10 max-w-lg space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">
          অ্যাকাউন্ট সুরক্ষিত রাখতে একটি শক্ত পাসওয়ার্ড ব্যবহার করুন এবং কাউকে জানাবেন না।
        </p>
      </div>

      {/* সফল বার্তা */}
      {done && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">পাসওয়ার্ড পরিবর্তন হয়েছে</p>
            <p className="mt-0.5 text-xs text-emerald-700">পরের বার লগইনের সময় নতুন পাসওয়ার্ড ব্যবহার করুন।</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {renderInput('current', 'বর্তমান পাসওয়ার্ড', '••••••••', 'current-password')}

        <div className="border-t border-slate-100 pt-4">
          {renderInput('next', 'নতুন পাসওয়ার্ড', 'কমপক্ষে ৬ অক্ষর', 'new-password')}

          {/* শক্তি মিটার */}
          {pass.next && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition ${i <= strength.score ? strength.color : 'bg-slate-200'}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                শক্তি: <span className="font-semibold">{strength.label}</span>
              </p>
            </div>
          )}

          {/* নিয়মের চেকলিস্ট */}
          <ul className="mt-3 space-y-1">
            {rules.map((r) => (
              <li
                key={r.label}
                className={`flex items-center gap-2 text-xs ${r.ok ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                {r.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                {r.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {renderInput('confirm', 'নতুন পাসওয়ার্ড আবার দিন', 'আবার লিখুন', 'new-password')}
          {mismatch && <p className="mt-1.5 text-xs font-medium text-red-600">পাসওয়ার্ড মিলছে না</p>}
          {!mismatch && pass.confirm && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" /> পাসওয়ার্ড মিলেছে
            </p>
          )}
        </div>

        {/* সার্ভার/যাচাইয়ের ত্রুটি */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || mismatch}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {isLoading ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
        </button>
      </form>
    </div>
  );
}