/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CloudOff,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useGetMyProfileQuery } from "@/app/redux/features/apis/auth-api";
import { useGetSingleCircularQuery } from "@/app/redux/features/apis/circular-api";
import {
  ApiError,
  EMPTY_DOCS,
  EMPTY_FORM,
  apiJson,
  formatDate,
  type ApplicantForm,
  type ApplicationDocuments,
  type Fees,
} from "@/utils/applications";
import { DocumentFields, PersonalFields } from "../components/ApplicationFields";

const STEPS = ["পদ বাছাই", "ব্যক্তিগত তথ্য", "কাগজপত্র", "জমা দিন"];

const HEADERS = [
  { title: "কোন পদে আবেদন করতে চান?", sub: "একাধিক পদ বাছাই করলে সার্ভিস চার্জে ছাড় পাবেন।" },
  { title: "ব্যক্তিগত তথ্য", sub: "প্রোফাইলের তথ্য বসানো আছে। প্রয়োজনে বদলান, না থাকলে পরেও দিতে পারবেন।" },
  { title: "কাগজপত্র", sub: "এখন না থাকলে এগিয়ে যান। পরে প্রোফাইল থেকে দিতে পারবেন।" },
  { title: "আবেদন জমা দিন", sub: "এখন টাকা দিতে হবে না। জমার পরে যখন সুবিধা, তখন পেমেন্ট করবেন।" },
];

type SaveState = "idle" | "saving" | "saved" | "offline";

const storageKey = (userId: string, circularId: string) => `applyDraft:${userId}:${circularId}`;

// সার্ভারে সেভ হওয়ার আগের তথ্য এই ট্যাবেই থাকে; রিফ্রেশ বা নেট চলে গেলেও হারায় না
const readSession = (key: string) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeSession = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* storage বন্ধ থাকলে শুধু সার্ভারের সেভ চলবে */
  }
};
const clearSession = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* কিছু করার নেই */
  }
};

const profileToForm = (profile: any): ApplicantForm => ({
  ...EMPTY_FORM,
  name: profile?.name || "",
  father: profile?.fatherName || "",
  mother: profile?.motherName || "",
  dob: profile?.dob ? String(profile.dob).split("T")[0] : "",
  nid: profile?.nid || "",
  mobile: profile?.phone || "",
  email: profile?.email || "",
  address: profile?.address || "",
});

const hasValue = (value: string) => value.trim().length > 0;

export default function ApplyContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { data: circular, isLoading: isCircularLoading, isError } = useGetSingleCircularQuery(jobId, { skip: !jobId });
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useGetMyProfileQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [hydrated, setHydrated] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [step, setStep] = useState(0);
  const [postNames, setPostNames] = useState<string[]>([]);
  const [form, setForm] = useState<ApplicantForm>(EMPTY_FORM);
  const [documents, setDocuments] = useState<ApplicationDocuments>(EMPTY_DOCS);
  const [appliedNames, setAppliedNames] = useState<string[]>([]);
  const [fees, setFees] = useState<Fees | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [created, setCreated] = useState<any>(null);

  const circularId: string = circular?._id || "";
  const key = profile?._id && circularId ? storageKey(profile._id, circularId) : "";

  const lastSaved = useRef("");
  const latest = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const stopped = useRef(false);

  const snapshot = useMemo(
    () => JSON.stringify({ step, postNames, form, documents }),
    [step, postNames, form, documents],
  );

  // লগইন ছাড়া আবেদন করা যায় না
  useEffect(() => {
    const loggedIn = Boolean(Cookies.get("token"));
    setIsLoggedIn(loggedIn);
    if (!loggedIn) router.replace(`/login?next=${encodeURIComponent(`/apply/${jobId}`)}`);
    try {
      // আগে পুরো ফর্ম (NID সহ) এখানে থাকত, সাইবার ক্যাফেতে পরের জন দেখতে পেত
      localStorage.removeItem("applyProgress");
    } catch {
      /* কিছু করার নেই */
    }
  }, [jobId, router]);

  useEffect(() => {
    if (isProfileError) router.replace(`/login?next=${encodeURIComponent(`/apply/${jobId}`)}`);
  }, [isProfileError, jobId, router]);

  // এই সার্কুলারের ড্রাফট ফিরিয়ে আনা; না থাকলে প্রথম ধাপ থেকে শুরু
  useEffect(() => {
    if (!key) return;
    let cancelled = false;

    (async () => {
      setLoadFailed(false);
      const local = readSession(key);
      let server: any = null;
      let applied: string[] = [];

      try {
        const [draftResult, mine] = await Promise.all([
          apiJson<any>(`/application-drafts/${circularId}`).catch((error) => {
            if (error instanceof ApiError && error.status === 404) return null;
            throw error;
          }),
          apiJson<any[]>("/applications/my"),
        ]);
        server = draftResult;
        applied = mine
          .filter((a) => [circular._id, circular.id].includes(a.circularId) && a.status !== "rejected")
          .flatMap((a) => (a.posts || []).map((p: any) => p.name));
      } catch {
        if (!local) {
          if (!cancelled) setLoadFailed(true);
          return;
        }
      }
      if (cancelled) return;

      const source = local || server;
      const allowed = new Set((circular.posts || []).map((p: any) => p.n));
      const names: string[] = (source?.postNames || []).filter(
        (n: string) => allowed.has(n) && !applied.includes(n),
      );
      const nextStep = names.length ? Math.min(Math.max(Number(source?.step) || 0, 0), 3) : 0;
      const nextForm: ApplicantForm = source
        ? { ...EMPTY_FORM, ...source.form }
        : profileToForm(profile);
      const nextDocs: ApplicationDocuments = source ? { ...EMPTY_DOCS, ...source.documents } : EMPTY_DOCS;

      setAppliedNames(applied);
      setPostNames(names);
      setStep(nextStep);
      setForm(nextForm);
      setDocuments(nextDocs);
      setRestored(names.length > 0);
      setExpiresAt(server?.expiresAt || null);
      setSaveState(server && !local ? "saved" : "idle");

      const initial = JSON.stringify({ step: nextStep, postNames: names, form: nextForm, documents: nextDocs });
      lastSaved.current = !local && server ? initial : "";
      latest.current = initial;
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reloadKey]);

  // সার্ভারে সেভ; একটার পর একটা চলে, যাতে পুরোনো সেভ নতুনটাকে মুছে না দেয়
  const flush = useCallback(() => {
    queue.current = queue.current.then(async () => {
      const body = latest.current;
      if (stopped.current || !body || body === lastSaved.current) return;
      const parsed = JSON.parse(body);
      if (!parsed.postNames.length) return;
      try {
        const result = await apiJson<{ expiresAt: string }>(`/application-drafts/${circularId}`, "PUT", parsed);
        lastSaved.current = body;
        setExpiresAt(result.expiresAt);
        if (latest.current === body) {
          clearSession(key);
          setSaveState("saved");
        }
      } catch {
        setSaveState("offline");
      }
    });
    return queue.current;
  }, [circularId, key]);

  useEffect(() => {
    if (!hydrated || !key || stopped.current) return;
    latest.current = snapshot;
    if (snapshot === lastSaved.current || postNames.length === 0) return;

    writeSession(key, snapshot);
    setSaveState("saving");
    timer.current = setTimeout(flush, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [snapshot, hydrated, key, postNames.length, flush]);

  // নেট ফিরে এলে বা পেজ ছাড়ার সময় বাকি সেভ পাঠানো
  useEffect(() => {
    if (!key) return;
    const send = () => flush();
    window.addEventListener("online", send);
    return () => {
      window.removeEventListener("online", send);
      if (!stopped.current && latest.current !== lastSaved.current) flush();
    };
  }, [flush, key]);

  // ফি শুধু সার্ভার থেকে আসে
  useEffect(() => {
    if (!circularId || postNames.length === 0) {
      setFees(null);
      return;
    }
    let cancelled = false;
    apiJson<Fees>("/applications/quote", "POST", { circularId, postNames })
      .then((result) => !cancelled && setFees(result))
      .catch(() => !cancelled && setFees(null));
    return () => {
      cancelled = true;
    };
  }, [circularId, postNames]);

  const selectedPosts = useMemo(
    () => (circular?.posts || []).filter((p: any) => postNames.includes(p.n)),
    [circular, postNames],
  );

  const missing = useMemo(() => {
    const items: [boolean, string, number][] = [
      [hasValue(form.father), "পিতার নাম", 1],
      [hasValue(form.mother), "মাতার নাম", 1],
      [hasValue(form.dob), "জন্ম তারিখ", 1],
      [hasValue(form.nid), "NID নম্বর", 1],
      [hasValue(form.address), "ঠিকানা", 1],
      [Boolean(documents.photo), "ছবি", 2],
      [Boolean(documents.signature), "স্বাক্ষর", 2],
    ];
    return items.filter(([ok]) => !ok);
  }, [form, documents]);

  const goTo = (target: number) => {
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePost = (name: string) =>
    setPostNames((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const startOver = async () => {
    if (!window.confirm("এই আবেদনের সেভ করা তথ্য মুছে নতুন করে শুরু করবেন?")) return;
    if (timer.current) clearTimeout(timer.current);
    await queue.current;
    try {
      await apiJson(`/application-drafts/${circularId}`, "DELETE");
    } catch (error) {
      toast.error((error as Error).message);
      return;
    }
    clearSession(key);
    const nextForm = profileToForm(profile);
    setPostNames([]);
    setStep(0);
    setForm(nextForm);
    setDocuments(EMPTY_DOCS);
    setRestored(false);
    setExpiresAt(null);
    setSaveState("idle");
    lastSaved.current = "";
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // জমার পরে কোনো পুরোনো সেভ যেন ড্রাফট আবার তৈরি না করে
    if (timer.current) clearTimeout(timer.current);
    await queue.current;
    stopped.current = true;

    try {
      const application = await apiJson<any>("/applications", "POST", {
        circularId,
        postNames,
        name: form.name,
        phone: form.mobile,
        fatherName: form.father,
        motherName: form.mother,
        dob: form.dob,
        nid: form.nid,
        address: form.address,
        education: form.education,
        documents,
      });
      clearSession(key);
      setCreated(application);
      window.scrollTo({ top: 0 });
    } catch (error) {
      stopped.current = false;
      toast.error((error as Error).message);
      if (error instanceof ApiError && error.status === 409) setReloadKey((n) => n + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 0 && postNames.length === 0) {
      toast.info("অন্তত একটি পদ বাছাই করুন");
      return;
    }
    if (step === 3) handleSubmit();
    else goTo(step + 1);
  };

  if (loadFailed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <CloudOff className="h-10 w-10 text-slate-400" />
        <p className="text-slate-600">সেভ করা তথ্য আনা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।</p>
        <button
          onClick={() => setReloadKey((n) => n + 1)}
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (!isCircularLoading && (isError || !circular)) {
    return <div className="py-20 text-center">সার্কুলার পাওয়া যায়নি!</div>;
  }

  if (isCircularLoading || isProfileLoading || !hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (created) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 font-hind">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-11 w-11" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">আবেদন জমা হয়েছে</h1>
          <p className="mt-2 text-sm text-slate-500">
            আবেদন আইডি: <span className="font-bold text-slate-800">{created.applicationId}</span>
          </p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-sm font-bold text-amber-800">পেমেন্ট বাকি</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">৳{created.amount}</div>
            <p className="mt-2 text-sm text-amber-800">
              পেমেন্ট যাচাই হলে আমরা আপনার আবেদনের কাজ শুরু করব। এখন না দিলে পরে প্রোফাইল থেকে দিতে পারবেন।
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/profile/applied-jobs/${created.applicationId}#payment`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-bold text-white shadow-md hover:bg-brand-700"
            >
              এখনই পেমেন্ট করুন <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/profile/applied-jobs"
              className="flex flex-1 items-center justify-center rounded-full border border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
            >
              পরে করব
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allApplied =
    (circular.posts?.length ?? 0) > 0 && circular.posts.every((p: any) => appliedNames.includes(p.n));

  const saveLabel =
    saveState === "saving"
      ? "সেভ হচ্ছে..."
      : saveState === "offline"
        ? "ইন্টারনেট নেই। এই ট্যাবে রাখা আছে, সংযোগ এলে সেভ হবে।"
        : saveState === "saved" && expiresAt
          ? `সেভ হয়েছে। ${formatDate(expiresAt)} পর্যন্ত রাখা হবে।`
          : "";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 font-hind">
      <main className="container-site pt-6 sm:pt-8">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{circular.title || circular.org}</h1>
          <p className="text-sm text-slate-500">{circular.org}</p>
        </div>

        {/* অগ্রগতি */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm font-bold sm:hidden">
            <span className="text-brand-900">{STEPS[step]}</span>
            <span className="text-slate-500">ধাপ {(step + 1).toLocaleString("bn-BD")}/{STEPS.length.toLocaleString("bn-BD")}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 sm:hidden">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>

          <ol className="hidden items-center sm:flex">
            {STEPS.map((label, i) => (
              <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => goTo(i)}
                  className="flex items-center gap-2 disabled:cursor-default"
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${i <= step ? "bg-brand-600 text-white" : "border-2 border-slate-200 bg-white text-slate-400"}`}>
                    {i < step ? <Check className="h-5 w-5" /> : (i + 1).toLocaleString("bn-BD")}
                  </span>
                  <span className={`whitespace-nowrap text-sm font-bold ${i <= step ? "text-brand-900" : "text-slate-400"}`}>{label}</span>
                </button>
                {i < STEPS.length - 1 && <span className={`mx-3 h-0.5 flex-1 ${i < step ? "bg-brand-600" : "bg-slate-200"}`} />}
              </li>
            ))}
          </ol>
        </div>

        {restored && (
          <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 sm:flex-row sm:items-center sm:justify-between">
            <span>আপনি আগে যেখানে থেমেছিলেন সেখান থেকে শুরু হয়েছে।</span>
            <button type="button" onClick={startOver} className="flex items-center gap-1.5 self-start font-bold text-blue-700 hover:underline">
              <RotateCcw className="h-4 w-4" /> নতুন করে শুরু করুন
            </button>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold text-slate-900 sm:text-2xl">{HEADERS[step].title}</h2>
              <p className="mb-6 text-sm text-slate-500">{HEADERS[step].sub}</p>

              {step === 0 && (
                <div className="space-y-3">
                  {allApplied && (
                    <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                      এই সার্কুলারের সব পদে আপনার আবেদন আছে।{" "}
                      <Link href="/profile/applied-jobs" className="font-bold underline">আমার আবেদন দেখুন</Link>
                    </div>
                  )}
                  {circular.posts?.map((post: any) => {
                    const isApplied = appliedNames.includes(post.n);
                    const isSelected = postNames.includes(post.n);
                    return (
                      <button
                        type="button"
                        key={post._id || post.n}
                        disabled={isApplied}
                        aria-pressed={isSelected}
                        onClick={() => togglePost(post.n)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition sm:gap-4 sm:p-5 ${
                          isApplied
                            ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
                            : isSelected
                              ? "border-brand-500 bg-brand-50/30 shadow-sm"
                              : "border-slate-200 bg-white hover:border-brand-300"
                        }`}
                      >
                        <span className={`mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-md border-2 ${isSelected ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"}`}>
                          {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-bold text-slate-900">{post.n}</span>
                          <span className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                            {post.g && <span className="rounded-md bg-[#f3e8ff] px-2 py-1 text-[#7c3aed]">{post.g}তম গ্রেড</span>}
                            {post.sal && <span className="rounded-md bg-[#ccfbf1] px-2 py-1 text-[#0f766e]">৳{post.sal}</span>}
                            {post.v && <span className="rounded-md bg-[#f3e8ff] px-2 py-1 text-[#7c3aed]">{post.v} টি পদ</span>}
                            {isApplied && <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">আগেই আবেদন করেছেন</span>}
                          </span>
                          {post.q && <span className="mt-2 block text-sm leading-relaxed text-slate-500">{post.q}</span>}
                        </span>
                        <span className="flex-none text-right">
                          <span className="block text-xs font-medium text-slate-500">সরকারি ফি</span>
                          <span className="block text-base font-bold text-slate-900">৳{post.fee || 112}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <PersonalFields form={form} onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))} />
              )}

              {step === 2 && (
                <DocumentFields documents={documents} onChange={setDocuments} onBusyChange={setIsUploading} />
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="text-sm font-bold text-slate-500">আবেদনকারী</div>
                    <div className="mt-1 font-bold text-slate-900">{form.name || profile?.name}</div>
                    <div className="text-sm text-slate-600">{form.mobile || profile?.phone}</div>
                    <div className="text-sm text-slate-600">{profile?.email}</div>
                  </div>

                  {missing.length > 0 ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <AlertCircle className="h-5 w-5 flex-none" /> এই তথ্যগুলো এখনো দেওয়া হয়নি
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {missing.map(([, label, target]) => (
                          <button
                            type="button"
                            key={label}
                            onClick={() => goTo(target)}
                            className="rounded-full border border-amber-300 bg-white px-3 py-1 text-sm font-medium text-amber-900 hover:bg-amber-100"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-amber-800">
                        তবুও জমা দিতে পারবেন। টেলিটকে আবেদনের আগে এগুলো লাগবে, তাই পরে প্রোফাইল থেকে যোগ করে দেবেন।
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 font-medium text-emerald-800">
                      <CheckCircle2 className="h-5 w-5 flex-none" /> সব প্রয়োজনীয় তথ্য দেওয়া হয়েছে।
                    </div>
                  )}
                </div>
              )}

              {saveLabel && (
                <p className={`mt-5 text-xs font-medium ${saveState === "offline" ? "text-amber-700" : "text-slate-500"}`}>{saveLabel}</p>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-b-3xl border-t border-slate-100 bg-white/95 p-4 backdrop-blur sm:px-8">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-2 py-2 font-bold text-slate-600 ${step === 0 ? "invisible" : ""}`}
              >
                <ArrowLeft className="h-4 w-4" /> পেছনে
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || isUploading}
                className="flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-700 disabled:opacity-70"
              >
                {(isSubmitting || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "জমা হচ্ছে..." : isUploading ? "আপলোড হচ্ছে..." : step === 3 ? "আবেদন জমা দিন" : "পরবর্তী"}
                {!isSubmitting && !isUploading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h3 className="mb-3 text-lg font-bold text-slate-900">আপনার আবেদন</h3>
            {selectedPosts.length > 0 ? (
              <ul className="space-y-1.5">
                {selectedPosts.map((post: any) => (
                  <li key={post._id || post.n} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-500" /> {post.n}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">কোনো পদ বাছাই করা হয়নি</p>
            )}
            {fees && (
              <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">সরকারি ফি</dt><dd className="font-semibold">৳{fees.govt}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">SMS খরচ</dt><dd className="font-semibold">৳{fees.sms}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">সার্ভিস চার্জ</dt><dd className="font-semibold">৳{fees.service}</dd></div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold">
                  <dt>মোট ফি</dt><dd className="text-brand-600">৳{fees.total}</dd>
                </div>
              </dl>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
