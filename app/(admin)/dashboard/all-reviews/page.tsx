/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Loader2,
  Star,
  CheckCircle2,
  EyeOff,
  Trash2,
  MessageSquareQuote,
  Search,
  RotateCcw,
  Hourglass,
  X,
  Eye,
} from 'lucide-react';
import {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
  type Review,
} from '@/app/redux/features/apis/review-apis';

type Status = 'pending' | 'approved' | 'hidden';
type Tab = Status | 'all';

const TABS: { k: Tab; label: string }[] = [
  { k: 'pending', label: 'অপেক্ষমাণ' },
  { k: 'approved', label: 'প্রকাশিত' },
  { k: 'hidden', label: 'লুকানো' },
  { k: 'all', label: 'সব' },
];

const BADGE: Record<Status, { label: string; cls: string }> = {
  pending: { label: 'অপেক্ষমাণ', cls: 'bg-amber-100 text-amber-700' },
  approved: { label: 'প্রকাশিত', cls: 'bg-emerald-100 text-emerald-700' },
  hidden: { label: 'লুকানো', cls: 'bg-slate-200 text-slate-600' },
};

const bnNum = (n: number | string) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });

function Stars({ value, size = 'h-3.5 w-3.5' }: { value: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );
}

function Avatar({ r, size = 'h-9 w-9 text-sm' }: { r: Review; size?: string }) {
  return r.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={r.image} alt={r.name} className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <div className={`${size} grid shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-700`}>
      {r.name?.charAt(0) || '?'}
    </div>
  );
}

export default function AllReviewsPage() {
  // 💡 সব রিভিউ একবারে আনা — ট্যাব, গণনা ও সার্চ ব্রাউজারেই হবে
  const { data: reviews = [], isLoading, isError, refetch, isFetching } = useGetAdminReviewsQuery({ status: 'all' });
  const [updateStatus] = useUpdateReviewStatusMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [tab, setTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState(0); // 0 = সব রেটিং
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Review | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null);

  // ===== পরিসংখ্যান =====
  const stats = useMemo(() => {
    const count: Record<Status, number> = { pending: 0, approved: 0, hidden: 0 };
    let sum = 0;
    reviews.forEach((r) => {
      count[(r.status || 'pending') as Status]++;
      sum += r.rating;
    });
    return { ...count, total: reviews.length, avg: reviews.length ? sum / reviews.length : 0 };
  }, [reviews]);

  // ===== ফিল্টার =====
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (tab !== 'all' && (r.status || 'pending') !== tab) return false;
      if (rating && r.rating !== rating) return false;
      if (!q) return true;
      return [r.name, r.text, r.role, r.applicationId].some((v) => v?.toLowerCase().includes(q));
    });
  }, [reviews, tab, search, rating]);

  // ===== অ্যাকশন =====
  const changeStatus = async (r: Review, status: Status) => {
    setBusyId(r._id);
    try {
      const updated = await updateStatus({ id: r._id, status }).unwrap();
      toast.success(
        status === 'approved' ? 'রিভিউ প্রকাশ করা হয়েছে' : status === 'hidden' ? 'রিভিউ লুকানো হয়েছে' : 'অপেক্ষমাণে ফেরত নেওয়া হয়েছে'
      );
      // বিস্তারিত popup খোলা থাকলে সেখানেও নতুন স্ট্যাটাস দেখাবে
      setViewing((v) => (v && v._id === r._id ? { ...v, status: updated?.status ?? status } : v));
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.msg || 'পরিবর্তন করা যায়নি');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const r = confirmDelete;
    setBusyId(r._id);
    try {
      await deleteReview(r._id).unwrap();
      toast.success('রিভিউ মুছে ফেলা হয়েছে');
      setConfirmDelete(null);
      setViewing((v) => (v && v._id === r._id ? null : v));
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.msg || 'মোছা যায়নি');
    } finally {
      setBusyId(null);
    }
  };

  const tabCount = (k: Tab) => (k === 'all' ? stats.total : stats[k]);

  // অ্যাকশন বাটনগুলো (টেবিল ও popup দুই জায়গায় ব্যবহার)
  const renderActions = (r: Review, compact = false) => {
    const st = (r.status || 'pending') as Status;
    const busy = busyId === r._id;
    const base = `flex items-center gap-1.5 rounded-lg text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
      compact ? 'p-2' : 'px-3 py-2'
    }`;
    return (
      <div className={`flex items-center ${compact ? 'justify-end gap-1' : 'flex-wrap gap-2'}`}>
        {st !== 'approved' && (
          <button
            disabled={busy}
            onClick={() => changeStatus(r, 'approved')}
            title="প্রকাশ করুন"
            className={`${base} bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {!compact && 'প্রকাশ করুন'}
          </button>
        )}
        {st !== 'hidden' && (
          <button
            disabled={busy}
            onClick={() => changeStatus(r, 'hidden')}
            title="লুকান"
            className={`${base} border border-slate-200 text-slate-700 hover:bg-slate-100`}
          >
            <EyeOff className="h-4 w-4" />
            {!compact && 'লুকান'}
          </button>
        )}
        {st !== 'pending' && (
          <button
            disabled={busy}
            onClick={() => changeStatus(r, 'pending')}
            title="আবার অপেক্ষমাণে নিন"
            className={`${base} text-slate-500 hover:bg-slate-100`}
          >
            <RotateCcw className="h-4 w-4" />
            {!compact && 'অপেক্ষমাণ'}
          </button>
        )}
        <button
          disabled={busy}
          onClick={() => setConfirmDelete(r)}
          title="মুছুন"
          className={`${base} text-rose-600 hover:bg-rose-50 ${compact ? '' : 'ml-auto'}`}
        >
          <Trash2 className="h-4 w-4" />
          {!compact && 'মুছুন'}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">রিভিউ ব্যবস্থাপনা</h1>
          <p className="text-sm text-slate-500">
            ইউজারদের রিভিউ যাচাই করে প্রকাশ করুন। শুধু &quot;প্রকাশিত&quot; রিভিউ হোমপেজে দেখাবে।
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          রিফ্রেশ
        </button>
      </div>

      {/* ===== পরিসংখ্যান কার্ড ===== */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'মোট রিভিউ', value: bnNum(stats.total), icon: MessageSquareQuote, cls: 'bg-brand-50 text-brand-600' },
          { label: 'অপেক্ষমাণ', value: bnNum(stats.pending), icon: Hourglass, cls: 'bg-amber-50 text-amber-600' },
          { label: 'প্রকাশিত', value: bnNum(stats.approved), icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-600' },
          { label: 'গড় রেটিং', value: stats.total ? bnNum(stats.avg.toFixed(1)) : '—', icon: Star, cls: 'bg-orange-50 text-orange-500' },
        ].map((k) => (
          <div key={k.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${k.cls}`}>
              <k.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500">{k.label}</div>
              <div className="text-xl font-bold text-slate-900">{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== টেবিল কার্ড ===== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* ট্যাব + সার্চ + রেটিং ফিল্টার */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  tab === t.k ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    tab === t.k ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {bnNum(tabCount(t.k))}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-brand-400 focus-within:bg-white sm:w-64">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম, লেখা বা আবেদন ID"
                className="w-full bg-transparent text-sm outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600" aria-label="মুছুন">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
            >
              <option value={0}>সব রেটিং</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {bnNum(n)} স্টার
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* টেবিল */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : isError ? (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            রিভিউ লোড করা যায়নি। অ্যাডমিন হিসেবে লগইন আছেন কিনা দেখুন, তারপর রিফ্রেশ করুন।
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquareQuote className="mb-3 h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-600">
              {search || rating ? 'এই ফিল্টারে কোনো রিভিউ পাওয়া যায়নি' : 'এই তালিকায় কোনো রিভিউ নেই'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">রিভিউদাতা</th>
                  <th className="px-4 py-3">রেটিং</th>
                  <th className="px-4 py-3">রিভিউ</th>
                  <th className="px-4 py-3">আবেদন ID</th>
                  <th className="px-4 py-3">তারিখ</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                  <th className="px-4 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => {
                  const st = (r.status || 'pending') as Status;
                  return (
                    <tr
                      key={r._id}
                      className={`align-top transition hover:bg-slate-50/70 ${busyId === r._id ? 'opacity-60' : ''} ${
                        st === 'pending' ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* রিভিউদাতা */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar r={r} />
                          <div className="min-w-0 max-w-[180px]">
                            <div className="truncate font-semibold text-slate-900">{r.name}</div>
                            <div className="truncate text-xs text-slate-500" title={r.role}>
                              {r.role || '—'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* রেটিং */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <Stars value={r.rating} />
                        <div className="mt-1 text-xs text-slate-400">{bnNum(r.rating)}/৫</div>
                      </td>

                      {/* রিভিউ (ছোট করে, ক্লিকে পুরোটা) */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewing(r)}
                          className="group max-w-[320px] text-left"
                          title="পুরো রিভিউ দেখুন"
                        >
                          <p className="line-clamp-2 text-slate-700 group-hover:text-slate-900">{r.text}</p>
                          {r.text.length > 90 && (
                            <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                              <Eye className="h-3 w-3" /> পুরোটা দেখুন
                            </span>
                          )}
                        </button>
                      </td>

                      {/* আবেদন ID */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">
                        {r.applicationId || '—'}
                      </td>

                      {/* তারিখ */}
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{fmtDate(r.createdAt)}</td>

                      {/* স্ট্যাটাস */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${BADGE[st].cls}`}>
                          {BADGE[st].label}
                        </span>
                      </td>

                      {/* অ্যাকশন */}
                      <td className="whitespace-nowrap px-4 py-3">{renderActions(r, true)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ফুটার */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            মোট {bnNum(stats.total)}টির মধ্যে {bnNum(filtered.length)}টি দেখানো হচ্ছে
          </div>
        )}
      </div>

      {/* ===== বিস্তারিত popup ===== */}
      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={() => setViewing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar r={viewing} size="h-12 w-12 text-lg" />
                <div className="min-w-0">
                  <div className="truncate text-lg font-bold text-slate-900">{viewing.name}</div>
                  <div className="text-sm text-slate-500">{viewing.role || '—'}</div>
                </div>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-slate-100"
                aria-label="বন্ধ করুন"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Stars value={viewing.rating} size="h-5 w-5" />
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${BADGE[(viewing.status || 'pending') as Status].cls}`}
              >
                {BADGE[(viewing.status || 'pending') as Status].label}
              </span>
            </div>

            <p className="mt-3 max-h-64 overflow-y-auto whitespace-pre-line break-words rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {viewing.text}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>তারিখ: {fmtDate(viewing.createdAt)}</span>
              {viewing.applicationId && <span>আবেদন: {viewing.applicationId}</span>}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">{renderActions(viewing)}</div>
          </div>
        </div>
      )}

      {/* ===== মুছে ফেলার নিশ্চিতকরণ ===== */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-4"
          onClick={() => busyId !== confirmDelete._id && setConfirmDelete(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-100">
              <Trash2 className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="mt-4 text-center text-lg font-bold text-slate-900">রিভিউ মুছে ফেলবেন?</h3>
            <p className="mt-1 text-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{confirmDelete.name}</span> এর রিভিউ স্থায়ীভাবে মুছে যাবে।
              ইউজার এই আবেদনে আবার রিভিউ দিতে পারবেন।
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={busyId === confirmDelete._id}
                className="rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                onClick={handleDelete}
                disabled={busyId === confirmDelete._id}
                className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-70"
              >
                {busyId === confirmDelete._id && <Loader2 className="h-4 w-4 animate-spin" />}
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}