/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  Heart,
  ArrowRight,
  Loader2,
  FileText,
} from "lucide-react";
import {
  useGetSingleCircularQuery,
  useGetAllCircularsQuery,
} from "@/app/redux/features/apis/circular-api";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const {
    data: job,
    isLoading,
    isError,
  } = useGetSingleCircularQuery(jobId, { skip: !jobId });
  const { data: allJobs } = useGetAllCircularsQuery({});

  // ================= Wishlist State =================
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showPostPicker, setShowPostPicker] = useState(false);

  const otherJobs =
    allJobs?.filter((j: any) => (j._id || j.id) !== jobId).slice(0, 5) || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ------- wishlist fetch -------
  const fetchWishlist = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setWishlistItems([]);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        // শুধু এই circular-এর আইটেম রাখা
        const filtered = arr.filter((w: any) => {
          const cId =
            typeof w.circularId === "object"
              ? w.circularId?._id
              : w.circularId;
          return cId === jobId;
        });
        setWishlistItems(filtered);
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  useEffect(() => {
    if (jobId) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  // ------- helper -------
  const getPostName = (post: any): string =>
    post?.name || post?.title || post?.postName || "";

  const isPostWishlisted = (postName: string) =>
    wishlistItems.some((w) => w.postName === postName);

  // ------- toggle (add / remove) -------
const toggleWishlistPost = async (postName: string) => {
  if (!postName) {
    toast.error("পদের নাম পাওয়া যায়নি");
    return;
  }
  const token = Cookies.get("token");
  if (!token) {
    toast.error("অনুগ্রহ করে লগইন করুন");
    return;
  }
  setIsWishlistLoading(true);
  try {
    const isRemoving = isPostWishlisted(postName);

    const res = isRemoving
      ? await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist?circularId=${jobId}&postName=${encodeURIComponent(
            postName
          )}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        )
      : await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ circularId: jobId, postName }),
          }
        );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err?.message || "সমস্যা হয়েছে!");
      return;
    }

    // ✅ অপ্টিমিস্টিক আপডেট
    if (isRemoving) {
      setWishlistItems((prev) => prev.filter((w) => w.postName !== postName));
      toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
    } else {
      setWishlistItems((prev) => [...prev, { circularId: jobId, postName }]);
      toast.success("উইশলিস্টে যোগ হয়েছে");
    }

    // ✅ server থেকে re-sync (source of truth)
    await fetchWishlist();
  } catch (err) {
    toast.error("সমস্যা হয়েছে!");
  } finally {
    setIsWishlistLoading(false);
  }
};

  // ================= Render guards =================
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  if (isError || !job)
    return (
      <div className="text-center py-20 text-xl font-bold">
        সার্কুলার পাওয়া যায়নি!
      </div>
    );

  const isActive = new Date(job.end) > new Date();

  const posts: any[] = Array.isArray(job.posts) ? job.posts : [];
  const postNames = posts.map(getPostName).filter(Boolean);
  const fallbackPostName = job.title as string;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-brand-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/jobs" className="hover:text-brand-600">
            Jobs
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-800 font-semibold">{job.title}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============ Sidebar ============ */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              Related Jobs
            </h3>

            {otherJobs.map((j: any) => {
              const jId = j._id || j.id;
              return (
                <Link
                  key={jId}
                  href={`/jobs/${jId}`}
                  className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md"
                >
                  <div
                    className="grid h-12 w-12 flex-none place-items-center rounded-lg text-white font-bold"
                    style={{ background: j.color || "#ea580c" }}
                  >
                    {j.ab || "JOB"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-brand-600 line-clamp-2">
                      {j.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {j.org}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {j.loc}
                      </span>
                      <span>•</span>
                      <span>{j.posts?.length || 0} Vacancies</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            <Link
              href="/jobs"
              className="flex items-center justify-center gap-1 w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition mt-4"
            >
              সব জব দেখুন <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* ============ Main Content ============ */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex items-start gap-5">
                  <div
                    className="grid h-20 w-20 flex-none place-items-center rounded-2xl text-white font-bold text-2xl shadow-sm"
                    style={{ background: job.color || "#ea580c" }}
                  >
                    {job.ab || "JOB"}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                      {job.title}
                    </h1>
                    <p className="text-base font-medium text-slate-600 mt-1 flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> {job.org}
                    </p>

                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      ></span>
                      {isActive ? "Status: Live" : "Status: Closed"}
                    </div>
                  </div>
                </div>

                {/* ===== Action Buttons ===== */}
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  {/* ---- WISHLIST ---- */}
                  {postNames.length <= 1 ? (
                    // Single post toggle
                    (() => {
                      const pName = postNames[0] || fallbackPostName;
                      const wishlisted = isPostWishlisted(pName);
                      return (
                        <button
                          onClick={() => toggleWishlistPost(pName)}
                          disabled={isWishlistLoading}
                          className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition disabled:opacity-60 ${
                            wishlisted
                              ? "bg-rose-600 hover:bg-rose-700"
                              : "bg-amber-500 hover:bg-amber-600"
                          }`}
                        >
                          {isWishlistLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Heart
                              className={`h-4 w-4 ${
                                wishlisted ? "fill-current" : ""
                              }`}
                            />
                          )}
                          {wishlisted ? "Wishlisted" : "Wish list"}
                        </button>
                      );
                    })()
                  ) : (
                    // Multiple posts -> dropdown picker
                    <div className="relative">
                      <button
                        onClick={() => setShowPostPicker((s) => !s)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition ${
                          wishlistItems.length > 0
                            ? "bg-rose-600 hover:bg-rose-700"
                            : "bg-amber-500 hover:bg-amber-600"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            wishlistItems.length > 0 ? "fill-current" : ""
                          }`}
                        />
                        {wishlistItems.length > 0
                          ? `Wishlisted (${wishlistItems.length}/${postNames.length})`
                          : "Wish list"}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            showPostPicker ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showPostPicker && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowPostPicker(false)}
                          />
                          <div className="absolute right-0 z-20 mt-2 w-full min-w-65 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            <p className="px-2 py-1 text-xs font-bold text-slate-500 uppercase">
                              Select posts to wishlist
                            </p>
                            {postNames.map((name) => {
                              const wishlisted = isPostWishlisted(name);
                              return (
                                <button
                                  key={name}
                                  onClick={() => toggleWishlistPost(name)}
                                  disabled={isWishlistLoading}
                                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50 ${
                                    wishlisted
                                      ? "text-rose-600"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span className="line-clamp-1">{name}</span>
                                  <Heart
                                    className={`h-4 w-4 flex-none ${
                                      wishlisted ? "fill-current" : ""
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Apply now */}
                  {isActive && job.allowServiceApply !== false && (
                    <Link
                      href={`/apply/${jobId}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 transition"
                    >
                      Apply now
                    </Link>
                  )}
                </div>
              </div>

              {/* Dates & views */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-blue-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Start Date
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatDate(job.start)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-rose-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      End Date
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatDate(job.end)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Viewed By
                    </p>
                    <p className="text-sm font-bold text-slate-900">3439</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Viewer (unchanged) */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-100 w-full h-175 relative">
                {job.pdfUrl ? (
                  <>
                    <iframe
                      src={`${job.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full h-full border-0 absolute inset-0"
                      title="Circular PDF"
                    />
                    <div className="absolute top-0 right-0 w-32 h-10 bg-[#3c3c3c] z-10 cursor-default" />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                    <p>কোনো পিডিএফ যুক্ত করা হয়নি।</p>
                  </div>
                )}
              </div>
            </div>

            {/* Read Before Apply (unchanged) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Read Before Apply
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                আমাদের মাধ্যমে আবেদন করতে চাইলে নিচের "Apply Online" বাটনে ক্লিক
                করুন। আমাদের টিম আপনার আবেদনটি প্রসেস করবে। আবেদন করার আগে
                অবশ্যই মূল বিজ্ঞপ্তিটি (PDF) ভালোভাবে পড়ে নিন।
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-800 mb-6">
                <span>Deadline: {formatDate(job.end)}</span>
                <span className="text-rose-600">
                  Vacancies: {job.posts?.length || 0}
                </span>
              </div>

              {isActive && job.allowServiceApply !== false ? (
                <Link
                  href={`/apply/${jobId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <CheckCircle2 className="h-4 w-4" /> Apply Online
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-8 py-3 text-sm font-bold text-slate-400 cursor-not-allowed"
                >
                  Application Closed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}