/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Loader2, Star, MessageSquareQuote, Clock, PenLine } from 'lucide-react';
import { useGetMyReviewsQuery } from '@/app/redux/features/apis/review-apis';
import ReviewModal from '../components/ReviewModal';

const STATUS: Record<string, { label: string; cls: string; note: string }> = {
  pending: {
    label: 'অনুমোদনের অপেক্ষায়',
    cls: 'bg-amber-100 text-amber-700',
    note: 'অ্যাডমিন যাচাইয়ের পর ওয়েবসাইটে দেখাবে।',
  },
  approved: {
    label: 'প্রকাশিত',
    cls: 'bg-emerald-100 text-emerald-700',
    note: 'আপনার রিভিউ হোমপেজে দেখানো হচ্ছে।',
  },
  hidden: {
    label: 'প্রকাশিত নয়',
    cls: 'bg-slate-200 text-slate-600',
    note: 'এই রিভিউটি ওয়েবসাইটে দেখানো হচ্ছে না।',
  },
};

const postNames = (app: any) =>
  app.posts?.map((p: any) => p.name).filter(Boolean).join(', ') || app.circularOrg || 'আবেদন';

export default function MyReviewsTab() {
  // ===== আমার রিভিউ (RTK Query) =====
  const { data: reviews = [], isLoading: loadingReviews } = useGetMyReviewsQuery();

  // ===== আমার আবেদন (রিভিউ বাকি আছে কোনগুলো তা বের করতে) =====
  const [apps, setApps] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [reviewFor, setReviewFor] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setApps(await res.json());
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoadingApps(false);
      }
    };
    load();
  }, []);

  // সম্পন্ন আবেদন, যেগুলোতে এখনো রিভিউ দেওয়া হয়নি
  const reviewedIds = new Set(reviews.map((r) => r.application));
  const pendingApps = apps.filter((a) => a.status === 'completed' && !reviewedIds.has(a._id));

  if (loadingReviews || loadingApps) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 w-full max-w-6xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Reviews</h2>
        <p className="mt-1 text-sm text-slate-500">
          সম্পন্ন হওয়া আবেদনে আপনার অভিজ্ঞতা জানান। প্রতিটি আবেদনে একটি রিভিউ দেওয়া যাবে।
        </p>
      </div>

      {/* ===== রিভিউ দেওয়া বাকি ===== */}
      {pendingApps.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            রিভিউ দেওয়া বাকি ({pendingApps.length})
          </h3>
          <div className="space-y-3">
            {pendingApps.map((app) => (
              <div
                key={app._id}
                className="flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-900">{postNames(app)}</div>
                  <div className="text-sm text-slate-500">
                    {app.circularOrg || ''} · ID: {app.applicationId}
                  </div>
                </div>
                <button
                  onClick={() => setReviewFor({ id: app._id, title: postNames(app) })}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  <PenLine className="h-4 w-4" />
                  রিভিউ দিন
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== আমার দেওয়া রিভিউ ===== */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          আমার দেওয়া রিভিউ ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <MessageSquareQuote className="mb-3 h-10 w-10 text-slate-300" />
            <h4 className="font-bold text-slate-700">এখনো কোনো রিভিউ দেননি</h4>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {pendingApps.length > 0
                ? 'উপরের সম্পন্ন আবেদনগুলোতে রিভিউ দিতে পারেন।'
                : 'আপনার কোনো আবেদন সম্পন্ন হলে এখানে রিভিউ দিতে পারবেন।'}
            </p>
            {apps.length === 0 && (
              <Link
                href="/jobs"
                className="mt-4 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                জব বোর্ডে যান
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => {
              const st = STATUS[r.status || 'pending'];
              return (
                <div key={r._id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-bold text-slate-900">{r.role || 'আবেদন'}</div>
                      {r.applicationId && (
                        <div className="text-xs text-slate-400">ID: {r.applicationId}</div>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-4 w-4 ${n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{r.text}</p>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(r.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                    <span className="text-right">{st.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {reviewFor && (
        <ReviewModal applicationId={reviewFor.id} title={reviewFor.title} onClose={() => setReviewFor(null)} />
      )}
    </div>
  );
}