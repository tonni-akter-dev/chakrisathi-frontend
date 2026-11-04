/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
  Users,
  ShieldCheck,
  Ban,
  UserPlus,
  Search,
  X,
  Loader2,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  IdCard,
  FileText,
  Unlock,
  ShieldOff,
} from 'lucide-react';
import {
  useGetAdminUsersQuery,
  useGetAdminUserStatsQuery,
  useGetAdminUserDetailQuery,
  useUpdateUserRoleMutation,
  useSetUserBlockedMutation,
  type AdminUser,
} from '@/app/redux/features/apis/user-api';

const bnNum = (n: number | string) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const APP_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'অপেক্ষমাণ', cls: 'bg-amber-100 text-amber-700' },
  processing: { label: 'প্রক্রিয়াধীন', cls: 'bg-blue-100 text-blue-700' },
  review: { label: 'যাচাই চলছে', cls: 'bg-violet-100 text-violet-700' },
  completed: { label: 'সম্পন্ন', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'বাতিল', cls: 'bg-rose-100 text-rose-700' },
};

type Confirm =
  | { type: 'role'; user: AdminUser; role: 'user' | 'admin' }
  | { type: 'block'; user: AdminUser; blocked: boolean }
  | null;

function Avatar({ u, size = 'h-9 w-9 text-sm' }: { u: Pick<AdminUser, 'name' | 'profileImage'>; size?: string }) {
  return u.profileImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={u.profileImage} alt={u.name} className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <div className={`${size} grid shrink-0 place-items-center rounded-full bg-brand-100 font-bold uppercase text-brand-700`}>
      {u.name?.charAt(0) || '?'}
    </div>
  );
}

export default function UsersPage() {
  // ===== ফিল্টার =====
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // টাইপ থামার ৪০০ms পর সার্চ (প্রতিটি অক্ষরে API কল না করতে)
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ===== API =====
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminUsersQuery({
    search: search || undefined,
    role: role || undefined,
    status: status || undefined,
    page,
    limit,
  });
  const { data: stats } = useGetAdminUserStatsQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [setBlocked] = useSetUserBlockedMutation();

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  // নিজের আইডি (নিজের role/ব্লক বাটন বন্ধ রাখতে)
  const [myId, setMyId] = useState('');
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMyId(u.id || u._id || '');
    } catch {
      /* ignore */
    }
  }, []);

  // ===== বিস্তারিত ড্রয়ার =====
  const [viewId, setViewId] = useState<string | null>(null);
  const { data: detail, isFetching: loadingDetail } = useGetAdminUserDetailQuery(viewId as string, { skip: !viewId });

  // ===== নিশ্চিতকরণ =====
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [busy, setBusy] = useState(false);

  const runConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      const res =
        confirm.type === 'role'
          ? await updateRole({ id: confirm.user._id, role: confirm.role }).unwrap()
          : await setBlocked({ id: confirm.user._id, blocked: confirm.blocked }).unwrap();
      toast.success(res?.msg || 'পরিবর্তন হয়েছে');
      setConfirm(null);
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.msg || 'পরিবর্তন করা যায়নি');
    } finally {
      setBusy(false);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setRole('');
    setStatus('');
    setPage(1);
  };
  const hasFilter = !!(search || role || status);

  // অ্যাকশন বাটন (টেবিল ও ড্রয়ার দুই জায়গায়)
  const renderActions = (u: AdminUser, full = false) => {
    const isMe = u._id === myId;
    const btn = `flex items-center gap-1.5 rounded-lg text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
      full ? 'px-3 py-2' : 'p-2'
    }`;
    return (
      <div className={`flex items-center ${full ? 'flex-wrap gap-2' : 'justify-end gap-1'}`}>
        {!full && (
          <button onClick={() => setViewId(u._id)} title="বিস্তারিত" className={`${btn} text-slate-600 hover:bg-slate-100`}>
            <Eye className="h-4 w-4" />
          </button>
        )}
        <button
          disabled={isMe}
          onClick={() => setConfirm({ type: 'role', user: u, role: u.role === 'admin' ? 'user' : 'admin' })}
          title={isMe ? 'নিজের role বদলানো যাবে না' : u.role === 'admin' ? 'সাধারণ ইউজার বানান' : 'অ্যাডমিন বানান'}
          className={`${btn} ${full ? 'border border-slate-200' : ''} text-brand-700 hover:bg-brand-50`}
        >
          {u.role === 'admin' ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          {full && (u.role === 'admin' ? 'সাধারণ ইউজার বানান' : 'অ্যাডমিন বানান')}
        </button>
        <button
          disabled={isMe || (u.role === 'admin' && !u.isBlocked)}
          onClick={() => setConfirm({ type: 'block', user: u, blocked: !u.isBlocked })}
          title={
            isMe ? 'নিজেকে ব্লক করা যাবে না' : u.role === 'admin' && !u.isBlocked ? 'অ্যাডমিনকে ব্লক করা যায় না' : u.isBlocked ? 'আনব্লক' : 'ব্লক'
          }
          className={`${btn} ${full ? 'border border-slate-200' : ''} ${
            u.isBlocked ? 'text-emerald-700 hover:bg-emerald-50' : 'text-rose-600 hover:bg-rose-50'
          }`}
        >
          {u.isBlocked ? <Unlock className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
          {full && (u.isBlocked ? 'আনব্লক করুন' : 'ব্লক করুন')}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ইউজার ম্যানেজমেন্ট</h1>
          <p className="text-sm text-slate-500">সব নিবন্ধিত ইউজার দেখুন, role বদলান বা প্রয়োজনে ব্লক করুন।</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          রিফ্রেশ
        </button>
      </div>

      {/* ===== পরিসংখ্যান ===== */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'মোট ইউজার', value: stats?.total, icon: Users, cls: 'bg-brand-50 text-brand-600' },
          { label: 'এই মাসে নতুন', value: stats?.newThisMonth, icon: UserPlus, cls: 'bg-emerald-50 text-emerald-600' },
          { label: 'অ্যাডমিন', value: stats?.admins, icon: ShieldCheck, cls: 'bg-violet-50 text-violet-600' },
          { label: 'ব্লক করা', value: stats?.blocked, icon: Ban, cls: 'bg-rose-50 text-rose-600' },
        ].map((k) => (
          <div key={k.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${k.cls}`}>
              <k.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">{k.label}</div>
              <div className="text-xl font-bold text-slate-900">{k.value === undefined ? '—' : bnNum(k.value)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== টেবিল কার্ড ===== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* টুলবার */}
        <div className="flex flex-col gap-2 border-b border-slate-200 p-3 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-brand-400 focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="নাম, ইমেইল বা মোবাইল নম্বর"
              className="w-full bg-transparent text-sm outline-none"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="text-slate-400 hover:text-slate-600" aria-label="মুছুন">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <div className="flex gap-2">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 sm:flex-none"
            >
              <option value="">সব role</option>
              <option value="user">ইউজার</option>
              <option value="admin">অ্যাডমিন</option>
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 sm:flex-none"
            >
              <option value="">সব অবস্থা</option>
              <option value="active">সক্রিয়</option>
              <option value="blocked">ব্লক করা</option>
            </select>
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                রিসেট
              </button>
            )}
          </div>
        </div>

        {/* টেবিল */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : isError ? (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            ইউজার তালিকা লোড করা যায়নি। অ্যাডমিন হিসেবে লগইন আছেন কিনা দেখুন, তারপর রিফ্রেশ করুন।
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="mb-3 h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-600">{hasFilter ? 'এই ফিল্টারে কোনো ইউজার নেই' : 'এখনো কোনো ইউজার নেই'}</p>
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-215 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">ইউজার</th>
                  <th className="px-4 py-3">মোবাইল</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">আবেদন</th>
                  <th className="px-4 py-3">যোগদান</th>
                  <th className="px-4 py-3">অবস্থা</th>
                  <th className="px-4 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className={`transition hover:bg-slate-50/70 ${u.isBlocked ? 'bg-rose-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewId(u._id)} className="flex items-center gap-3 text-left">
                        <Avatar u={u} />
                        <div className="min-w-0 max-w-55">
                          <div className="truncate font-semibold text-slate-900 hover:text-brand-700">
                            {u.name}
                            {u._id === myId && <span className="ml-1.5 text-xs font-normal text-slate-400">(আপনি)</span>}
                          </div>
                          <div className="truncate text-xs text-slate-500">{u.email}</div>
                        </div>
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">
                          <ShieldCheck className="h-3.5 w-3.5" /> অ্যাডমিন
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">ইউজার</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">{bnNum(u.applicationCount)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {u.isBlocked ? (
                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">ব্লক</span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">সক্রিয়</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{renderActions(u)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm sm:flex-row">
            <span className="text-xs text-slate-500">
              মোট {bnNum(total)} জনের মধ্যে {bnNum((page - 1) * limit + 1)}–{bnNum(Math.min(page * limit, total))}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                aria-label="আগের পাতা"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-17.5 text-center text-xs font-semibold text-slate-600">
                পাতা {bnNum(page)} / {bnNum(pages)}
              </span>
              <button
                disabled={page >= pages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                aria-label="পরের পাতা"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== বিস্তারিত ড্রয়ার ===== */}
      {viewId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={() => setViewId(null)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">ইউজারের বিস্তারিত</h2>
              <button onClick={() => setViewId(null)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100" aria-label="বন্ধ করুন">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {loadingDetail || !detail ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              </div>
            ) : (
              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                {/* পরিচয় */}
                <div className="flex items-center gap-4">
                  <Avatar u={detail.user} size="h-16 w-16 text-2xl" />
                  <div className="min-w-0">
                    <div className="truncate text-lg font-bold text-slate-900">{detail.user.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          detail.user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {detail.user.role === 'admin' ? 'অ্যাডমিন' : 'ইউজার'}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          detail.user.isBlocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {detail.user.isBlocked ? 'ব্লক' : 'সক্রিয়'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* অ্যাকশন */}
                {renderActions({ ...detail.user, applicationCount: detail.applications.length }, true)}

                {/* যোগাযোগ ও ব্যক্তিগত তথ্য */}
                <section className="space-y-2.5 rounded-xl border border-slate-200 p-4 text-sm">
                  {[
                    { icon: Mail, label: 'ইমেইল', value: detail.user.email },
                    { icon: Phone, label: 'মোবাইল', value: detail.user.phone },
                    { icon: CalendarDays, label: 'যোগদান', value: fmtDate(detail.user.createdAt) },
                    { icon: CalendarDays, label: 'জন্মতারিখ', value: fmtDate(detail.user.dob) },
                    { icon: IdCard, label: 'NID', value: detail.user.nid },
                    { icon: MapPin, label: 'ঠিকানা', value: detail.user.address },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span className="w-20 shrink-0 text-slate-500">{row.label}</span>
                      <span className="min-w-0 wrap-break-word font-medium text-slate-800">{row.value || '—'}</span>
                    </div>
                  ))}
                  {(detail.user.fatherName || detail.user.motherName) && (
                    <div className="border-t border-slate-100 pt-2.5 text-slate-600">
                      পিতা: <span className="font-medium text-slate-800">{detail.user.fatherName || '—'}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      মাতা: <span className="font-medium text-slate-800">{detail.user.motherName || '—'}</span>
                    </div>
                  )}
                </section>

                {/* শিক্ষাগত যোগ্যতা */}
                {!!detail.user.educationDetails?.length && (
                  <section>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">শিক্ষাগত যোগ্যতা</h3>
                    <div className="space-y-2">
                      {detail.user.educationDetails.map((e, i) => (
                        <div key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                          <div className="font-semibold text-slate-800">{e.degree || '—'}</div>
                          <div className="text-xs text-slate-500">
                            {[e.institution, e.year, e.result].filter(Boolean).join(' · ') || '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* আবেদন */}
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    সাম্প্রতিক আবেদন ({bnNum(detail.applications.length)})
                  </h3>
                  {detail.applications.length === 0 ? (
                    <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">কোনো আবেদন নেই</p>
                  ) : (
                    <div className="space-y-2">
                      {detail.applications.map((a) => {
                        const st = APP_STATUS[a.status] || { label: a.status, cls: 'bg-slate-100 text-slate-600' };
                        return (
                          <Link
                            key={a._id}
                            href={`/dashboard/applications/${a.applicationId}`}
                            className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5 transition hover:border-brand-300 hover:bg-brand-50/40"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-700">
                                <FileText className="h-3.5 w-3.5 text-slate-400" />
                                {a.applicationId}
                              </div>
                              <div className="mt-0.5 truncate text-sm text-slate-800">
                                {a.posts?.map((p) => p.name).join(', ') || a.circularOrg || '—'}
                              </div>
                              <div className="text-xs text-slate-400">
                                {fmtDate(a.createdAt)}
                                {a.amount ? ` · ৳${bnNum(a.amount)}` : ''}
                              </div>
                            </div>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${st.cls}`}>{st.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ===== নিশ্চিতকরণ popup ===== */}
      {confirm && (
        <div className="fixed inset-0 z-60 grid place-items-center bg-slate-900/50 p-4" onClick={() => !busy && setConfirm(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            {(() => {
              const isBlock = confirm.type === 'block';
              const danger = (isBlock && confirm.blocked) || (!isBlock && confirm.role === 'admin');
              const title = isBlock
                ? confirm.blocked
                  ? 'ইউজার ব্লক করবেন?'
                  : 'ইউজার আনব্লক করবেন?'
                : confirm.role === 'admin'
                  ? 'অ্যাডমিন বানাবেন?'
                  : 'সাধারণ ইউজার বানাবেন?';
              const desc = isBlock
                ? confirm.blocked
                  ? 'ব্লক করলে এই ইউজার লগইন বা কোনো আবেদন করতে পারবেন না। আগের আবেদনগুলো থেকে যাবে।'
                  : 'আনব্লক করলে ইউজার আবার লগইন ও আবেদন করতে পারবেন।'
                : confirm.role === 'admin'
                  ? 'অ্যাডমিন হলে এই ইউজার সব আবেদন, পেমেন্ট, ইউজারের তথ্য ও সেটিংস দেখতে ও বদলাতে পারবেন। শুধু বিশ্বস্ত ব্যক্তিকে দিন।'
                  : 'এই ব্যক্তি আর অ্যাডমিন প্যানেল ব্যবহার করতে পারবেন না।';
              return (
                <>
                  <div
                    className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${danger ? 'bg-rose-100 text-rose-600' : 'bg-brand-100 text-brand-600'}`}
                  >
                    {isBlock ? (confirm.blocked ? <Ban className="h-6 w-6" /> : <Unlock className="h-6 w-6" />) : <ShieldCheck className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-4 text-center text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-center text-sm font-semibold text-slate-700">{confirm.user.name}</p>
                  <p className="mt-2 text-center text-sm text-slate-500">{desc}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setConfirm(null)}
                      disabled={busy}
                      className="rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={runConfirm}
                      disabled={busy}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-70 ${
                        danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand-600 hover:bg-brand-700'
                      }`}
                    >
                      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                      নিশ্চিত করুন
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
