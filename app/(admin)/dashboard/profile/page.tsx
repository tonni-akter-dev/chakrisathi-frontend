/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
} from '@/app/redux/features/apis/auth-api';

// API error থেকে বার্তা বের করা
const errMsg = (e: any, fallback: string) =>
  e?.data?.msg || e?.data?.error || (typeof e?.data === 'string' ? e.data : '') || fallback;

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

export default function AdminProfilePage() {
  // ===== API =====
  const { data: profile, isLoading, isError } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading: isSavingInfo }] = useUpdateMyProfileMutation();
  const [changePassword, { isLoading: isSavingPass }] = useChangePasswordMutation();

  // ===== প্রোফাইল ফর্ম =====
  const [info, setInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInfo({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info.name.trim()) return toast.error('নাম দিন');
    if (!/^01[3-9]\d{8}$/.test(info.phone.trim())) {
      return toast.error('সঠিক মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
    }
    try {
      await updateProfile({
        name: info.name.trim(),
        phone: info.phone.trim(),
        address: info.address.trim(),
      }).unwrap();
      toast.success('প্রোফাইল আপডেট হয়েছে!');
    } catch (err) {
      toast.error(errMsg(err, 'প্রোফাইল আপডেট করা যায়নি'));
    }
  };

  // ===== পাসওয়ার্ড ফর্ম =====
  const [pass, setPass] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.next.length < 6) return toast.error('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
    if (pass.next !== pass.confirm) return toast.error('নতুন পাসওয়ার্ড দুইবার একই হয়নি');
    if (pass.next === pass.current) return toast.error('নতুন পাসওয়ার্ড আগেরটার মতো হতে পারবে না');

    try {
      const res: any = await changePassword({
        currentPassword: pass.current,
        newPassword: pass.next,
      }).unwrap();
      toast.success(res?.msg || 'পাসওয়ার্ড পরিবর্তন হয়েছে!');
      setPass({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(errMsg(err, 'পাসওয়ার্ড পরিবর্তন করা যায়নি'));
    }
  };

  // পাসওয়ার্ড শক্তি
  const strength = (() => {
    const p = pass.next;
    if (!p) return { score: 0, label: '', color: 'bg-slate-200' };
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

  // ===== লোডিং / এরর =====
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }
  if (isError || !profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        প্রোফাইল লোড করা যায়নি। আবার লগইন করে চেষ্টা করুন।
      </div>
    );
  }

  const initials = (profile.name || 'A')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const inputCls =
    'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

  const PassInput = ({ field, label, placeholder }: { field: 'current' | 'next' | 'confirm'; label: string; placeholder: string }) => (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type={show[field] ? 'text' : 'password'}
          required
          value={pass[field]}
          onChange={(e) => setPass({ ...pass, [field]: e.target.value })}
          placeholder={placeholder}
          autoComplete={field === 'current' ? 'current-password' : 'new-password'}
          className={`${inputCls} pl-10 pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow({ ...show, [field]: !show[field] })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          tabIndex={-1}
        >
          {show[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">আমার প্রোফাইল</h1>
        <p className="text-sm text-slate-500">আপনার তথ্য ও পাসওয়ার্ড পরিবর্তন করুন।</p>
      </div>

      {/* প্রোফাইল কার্ড */}
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
        {profile.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.profileImage} alt={profile.name} className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-brand-600 text-2xl font-bold text-white">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-bold text-slate-900">{profile.name}</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {profile.role === 'admin' ? 'Administrator' : 'User'}
            </span>
          </div>
          <div className="mt-2 grid gap-1.5 text-sm text-slate-600 sm:grid-cols-3">
            <span className="flex items-center gap-1.5 truncate"><Mail className="h-4 w-4 shrink-0 text-slate-400" />{profile.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 shrink-0 text-slate-400" />{profile.phone || '—'}</span>
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />যোগদান: {formatDate(profile.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ব্যক্তিগত তথ্য */}
        <form onSubmit={handleInfoSave} className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
            <User className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">ব্যক্তিগত তথ্য</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">নাম *</label>
              <input
                type="text"
                required
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">ইমেইল</label>
              <input type="email" value={profile.email} disabled className={`${inputCls} cursor-not-allowed bg-slate-50 text-slate-500`} />
              <p className="mt-1 text-xs text-slate-400">ইমেইল দিয়ে লগইন করা হয়, তাই এটি পরিবর্তন করা যাবে না।</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">মোবাইল নম্বর *</label>
              <input
                type="tel"
                required
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                placeholder="017XXXXXXXX"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">ঠিকানা</label>
              <textarea
                rows={2}
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSavingInfo}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
            >
              {isSavingInfo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSavingInfo ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}
            </button>
          </div>
        </form>

        {/* পাসওয়ার্ড পরিবর্তন */}
        <form onSubmit={handlePasswordSave} className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
            <KeyRound className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">পাসওয়ার্ড পরিবর্তন</h2>
          </div>

          <div className="space-y-4">
            {PassInput({ field: 'current', label: 'বর্তমান পাসওয়ার্ড *', placeholder: '••••••••' })}
            {PassInput({ field: 'next', label: 'নতুন পাসওয়ার্ড *', placeholder: 'কমপক্ষে ৬ অক্ষর' })}

            {pass.next && (
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-slate-200'}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">শক্তি: {strength.label}</p>
              </div>
            )}

            {PassInput({ field: 'confirm', label: 'নতুন পাসওয়ার্ড আবার দিন *', placeholder: 'আবার লিখুন' })}

            {pass.confirm && pass.next !== pass.confirm && (
              <p className="text-xs font-medium text-red-600">পাসওয়ার্ড মিলছে না</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSavingPass}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {isSavingPass ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {isSavingPass ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}