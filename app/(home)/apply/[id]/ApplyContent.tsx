/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, CheckCircle2, Upload, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useGetMyProfileQuery } from "@/app/redux/features/apis/auth-api";
import { useGetSingleCircularQuery } from "@/app/redux/features/apis/circular-api";

const STEPS = ["পদ বাছাই", "ব্যক্তিগত তথ্য", "কাগজপত্র", "পেমেন্ট", "সম্পন্ন"];

const HEADERS = [
  { title: "কোন পদে আবেদন করতে চান?", sub: "একাধিক পদ বাছাই করলে সার্ভিস চার্জে ছাড় পাবেন।" },
  { title: "ব্যক্তিগত তথ্য", sub: "আপনার প্রোফাইল থেকে তথ্য আনা হয়েছে। প্রয়োজনে এডিট করুন।" },
  { title: "কাগজপত্র আপলোড", sub: "স্পষ্ট ছবি আপলোড করুন। শিক্ষাগত যোগ্যতা অনুযায়ী সার্টিফিকেট দিন।" },
  { title: "পেমেন্ট", sub: "পেমেন্ট সম্পন্ন করে ট্রানজেকশন আইডি দিন।" },
  { title: "", sub: "" },
];

type FormData = { name: string; father: string; mother: string; dob: string; nid: string; mobile: string; email: string; address: string; education: string; };
type FileUrlsData = { photo: string; signature: string; nidPhoto: string[]; ssc: string[]; hsc: string[]; graduation: string[]; masters: string[]; diploma: string[]; };

const EMPTY_FORM: FormData = { name: "", father: "", mother: "", dob: "", nid: "", mobile: "", email: "", address: "", education: "" };

export default function ApplyContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const { data: circular, isLoading: isCircularLoading, isError } = useGetSingleCircularQuery(jobId, { skip: !jobId });
  const { data: userProfile, isLoading: isProfileLoading } = useGetMyProfileQuery(undefined);

  const [step, setStep] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // 💡 ডাইনামিক পেমেন্ট মেথড রাখার স্টেট
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  
  const [fileUrls, setFileUrls] = useState<FileUrlsData>({ 
    photo: "", signature: "", nidPhoto: [], ssc: [], hsc: [], graduation: [], masters: [], diploma: [] 
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [agree, setAgree] = useState(false);

  // 💡 ১. সেটিংস API থেকে পেমেন্ট নাম্বার লোড করা
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/settings`);
        if (res.ok) {
          const data = await res.json();
          // active: true আছে এমন মেথডগুলো ফিল্টার করে রাখা
          const activeMethods = data.methods?.filter((m: any) => m.active) || [];
          setPaymentMethods(activeMethods);
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };
    fetchSettings();
  }, []);

  // 💡 ২. লোকাল স্টোরেজ থেকে ডাটা লোড
  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem("applyProgress");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.step !== undefined && parsed.step < 4) setStep(parsed.step);
      if (parsed.selectedPosts) setSelectedPosts(parsed.selectedPosts);
      if (parsed.formData) setFormData(parsed.formData);
      if (parsed.fileUrls) setFileUrls(parsed.fileUrls);
      if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
      if (parsed.senderNumber) setSenderNumber(parsed.senderNumber);
      if (parsed.trxId) setTrxId(parsed.trxId);
    }
  }, []);

  // 💡 ৩. লোকাল স্টোরেজে সেভ
  useEffect(() => {
    if (isClient && step < 4) {
      localStorage.setItem("applyProgress", JSON.stringify({
        step, selectedPosts, formData, fileUrls, paymentMethod, senderNumber, trxId
      }));
    }
  }, [step, selectedPosts, formData, fileUrls, paymentMethod, senderNumber, trxId, isClient]);

  // 💡 ৪. ইউজার প্রোফাইল ডাটা ফর্মে সেট করা
  useEffect(() => {
    if (userProfile && isClient) {
      const savedData = localStorage.getItem("applyProgress");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.formData && parsed.formData.name) return;
      }
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || "",
        father: userProfile.fatherName || "",
        mother: userProfile.motherName || "",
        dob: userProfile.dob ? userProfile.dob.split("T")[0] : "",
        nid: userProfile.nid || "",
        mobile: userProfile.phone || "",
        email: userProfile.email || "",
        address: userProfile.address || "",
        education: userProfile.education || "",
      }));
    }
  }, [userProfile, isClient]);

  const togglePost = (post: any) => {
    setSelectedPosts((prev) =>
      prev.some((p) => p.n === post.n) ? prev.filter((p) => p.n !== post.n) : [...prev, post]
    );
  };

  const setField = (key: keyof FormData, value: string) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("আপলোড ব্যর্থ");
      const data = await res.json();
      return data.url;
    } catch (error) {
      toast.error(`ফাইল আপলোড করতে সমস্যা হয়েছে: ${file.name}`);
      return null;
    }
  };

  const handleFileChange = async (fieldKey: keyof FileUrlsData, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList);
    setUploading((prev) => ({ ...prev, [fieldKey]: true }));

    if (fieldKey === "photo" || fieldKey === "signature") {
      const url = await uploadToCloudinary(newFiles[0]);
      if (url) setFileUrls((prev) => ({ ...prev, [fieldKey]: url }));
    } else {
      const urls = await Promise.all(newFiles.map((file) => uploadToCloudinary(file)));
      const validUrls = urls.filter((url) => url !== null) as string[];
      setFileUrls((prev) => ({ ...prev, [fieldKey]: [...(prev[fieldKey] as string[]), ...validUrls] }));
    }
    setUploading((prev) => ({ ...prev, [fieldKey]: false }));
  };

  const removeUploadedFile = (fieldKey: keyof FileUrlsData, index?: number) => {
    if (fieldKey === "photo" || fieldKey === "signature") {
      setFileUrls((prev) => ({ ...prev, [fieldKey]: "" }));
    } else {
      setFileUrls((prev) => ({
        ...prev,
        [fieldKey]: (prev[fieldKey] as string[]).filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!fileUrls.photo || !fileUrls.signature) return toast.error("ছবি এবং স্বাক্ষর আপলোড করুন।");
    const hasCertificate = ["ssc", "hsc", "graduation", "masters", "diploma"].some(
      (key) => (fileUrls[key as keyof FileUrlsData] as string[])?.length > 0
    );
    if (!hasCertificate) return toast.error("অন্তত একটি শিক্ষাগত সার্টিফিকেট আপলোড করুন।");
    if (!paymentMethod) return toast.error("পেমেন্ট মাধ্যম বাছাই করুন।");
    if (!senderNumber) return toast.error("যে নাম্বার থেকে পেমেন্ট করেছেন তা দিন।");
    if (!trxId) return toast.error("ট্রানজেকশন আইডি দিন।");
    if (!agree) return toast.error("শর্তাবলীতে সম্মতি দিন।");

    setIsSubmitting(true);
    
    try {
      const payload = {
        circularId: circular._id || circular.id,
        circularOrg: circular.org,
        name: formData.name,
        phone: formData.mobile,
        fatherName: formData.father,
        motherName: formData.mother,
        dob: formData.dob,
        nid: formData.nid,
        address: formData.address,
        education: formData.education,
        posts: selectedPosts.map((p) => ({
          postId: p._id || null,
          name: p.n,
          fee: p.fee || 112,
          grade: p.g || "",
        })),
        amount: total,
        paymentMethod,
        senderNumber,
        trxId,
        documents: fileUrls,
      };

      const token = Cookies.get("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("আবেদন সাবমিট করতে সমস্যা হয়েছে!");
      
      localStorage.removeItem("applyProgress");
      setFormData(EMPTY_FORM);
      setSelectedPosts([]);
      setFileUrls({ photo: "", signature: "", nidPhoto: [], ssc: [], hsc: [], graduation: [], masters: [], diploma: [] });
      setPaymentMethod("");
      setSenderNumber("");
      setTrxId("");
      setAgree(false);
      
      toast.success("আবেদন সফলভাবে জমা হয়েছে!");
      setStep(4); 
      
    } catch (error: any) {
      toast.error(error.message || "সার্ভার এরর!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 0 && selectedPosts.length === 0) return toast.error("অন্তত একটি পদ বাছাই করুন।");
    
    if (step === 1) {
      const requiredFields = [
        { key: "name", label: "পূর্ণ নাম" }, { key: "father", label: "পিতার নাম" },
        { key: "mother", label: "মাতার নাম" }, { key: "dob", label: "জন্ম তারিখ" },
        { key: "nid", label: "NID" }, { key: "mobile", label: "মোবাইল" },
      ];
      const missing = requiredFields.find((f) => !formData[f.key as keyof FormData].trim());
      if (missing) return toast.error(`"${missing.label}" পূরণ করুন।`);
      if (!/^01[3-9]\d{8}$/.test(formData.mobile)) return toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।");
    }

    if (step === 2) {
      if (!fileUrls.photo || !fileUrls.signature) return toast.error("ছবি এবং স্বাক্ষর আপলোড করুন।");
      const hasCertificate = ["ssc", "hsc", "graduation", "masters", "diploma"].some(
        (key) => (fileUrls[key as keyof FileUrlsData] as string[])?.length > 0
      );
      if (!hasCertificate) return toast.error("অন্তত একটি শিক্ষাগত সার্টিফিকেট আপলোড করুন।");
    }

    if (step === 3) {
      handleSubmit();
      return;
    }

    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const inputCls = "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50";
  const labelCls = "mb-1.5 block text-xs font-bold text-slate-600";

  if (isCircularLoading || isProfileLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>;
  if (isError || !circular) return <div className="text-center py-20">সার্কুলার পাওয়া যায়নি!</div>;

  // ফি ক্যালকুলেশন
  const govtFee = selectedPosts.reduce((sum, post) => sum + (post?.fee ? Number(post.fee) : 112), 0);
  const smsFee = selectedPosts.length * 15;
  const serviceFee = selectedPosts.length > 0 ? 100 : 0;
  const total = govtFee + smsFee + serviceFee;

  // সিলেক্ট করা পেমেন্ট মেথডের ডিটেইলস বের করা
  const selectedPaymentDetails = paymentMethods.find(m => m.id === paymentMethod);

  const UploadBtn = ({ label, hint, fieldKey, multiple = false }: { label: string; hint: string; fieldKey: keyof FileUrlsData; multiple?: boolean; }) => {
    const isUploaded = multiple ? (fileUrls[fieldKey] as string[])?.length > 0 : !!fileUrls[fieldKey];
    const isUploading = uploading[fieldKey];

    return (
      <div className="flex flex-col gap-2">
        <label className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-dashed p-4 transition ${isUploaded ? "border-emerald-400 bg-emerald-50/40" : "border-slate-200 bg-white hover:border-brand-400"}`}>
          <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 flex-none place-items-center rounded-lg ${isUploaded ? "bg-emerald-100 text-emerald-600" : "bg-brand-50 text-brand-600"}`}>
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : isUploaded ? <Check className="h-5 w-5" strokeWidth={3} /> : <Upload className="h-5 w-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{label}</div>
              <div className="text-[11px] text-slate-500">
                {isUploading ? "আপলোড হচ্ছে..." : isUploaded ? `✅ ${multiple ? `${(fileUrls[fieldKey] as string[]).length}টি ফাইল` : "আপলোড সম্পন্ন"}` : hint}
              </div>
            </div>
          </div>
          <span className={`flex-none rounded-full px-3 py-1 text-[10px] font-bold ${isUploaded ? "bg-emerald-100 text-emerald-700" : "bg-brand-100 text-brand-700"}`}>
            {isUploaded ? "যোগ করুন" : "আপলোড"}
          </span>
          <input
            type="file"
            accept="image/*,.pdf"
            multiple={multiple}
            className="hidden"
            disabled={isUploading}
            onChange={(e) => handleFileChange(fieldKey, e.target.files)}
          />
        </label>

        {isUploaded && (
          <div className="flex flex-wrap gap-2">
            {multiple ? (
              (fileUrls[fieldKey] as string[]).map((url, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs">
                  <span className="text-slate-600 truncate max-w-25">ফাইল {idx + 1}</span>
                  <button type="button" onClick={() => removeUploadedFile(fieldKey, idx)} className="text-rose-500 hover:bg-rose-50 rounded p-0.5"><X className="h-3 w-3" /></button>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs">
                <a href={fileUrls[fieldKey] as string} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">ফাইল দেখুন</a>
                <button type="button" onClick={() => removeUploadedFile(fieldKey)} className="text-rose-500 hover:bg-rose-50 rounded p-0.5 ml-2"><X className="h-3 w-3" /></button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-hind pb-20">
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        
        {/* Stepper */}
        <div className="relative mx-auto mb-10 hidden max-w-4xl px-4 sm:block">
          <div className="absolute left-10 right-10 top-5 -z-10 h-0.5 bg-slate-200"></div>
          <div className="flex justify-between">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${i <= step ? "bg-brand-600 text-white" : "bg-white text-slate-400 border-2 border-slate-200"}`}>
                  {i < step ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <span className={`text-xs font-bold ${i <= step ? "text-brand-900" : "text-slate-400"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          
          {/* Main Form */}
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex-1 p-6 sm:p-8">
              {step < 4 && (
                <>
                  <h2 className="mb-1 text-2xl font-bold text-slate-900">{HEADERS[step].title}</h2>
                  <p className="mb-6 text-sm text-slate-500">{HEADERS[step].sub}</p>
                </>
              )}

              {/* Step 0: Post Selection */}
              {step === 0 && (
                <div className="space-y-4">
                  {circular.posts?.map((post: any, idx: number) => {
                    const isSelected = selectedPosts.some((p) => p.n === post.n);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => togglePost(post)}
                        className={`flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-all duration-200 ${
                          isSelected ? "border-brand-500 bg-brand-50/20 shadow-sm" : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
                        }`}
                      >
                        <div className={`mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-md border-2 transition-colors ${isSelected ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"}`}>
                          {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex flex-1 flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-slate-900">{post.n}</h3>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                              {post.g && <span className="rounded-md bg-[#f3e8ff] px-2 py-1 text-[#7c3aed]">{post.g}তম গ্রেড</span>}
                              {post.sal && <span className="rounded-md bg-[#ccfbf1] px-2 py-1 text-[#0f766e]">৳{post.sal}</span>}
                              {post.v && <span className="rounded-md bg-[#f3e8ff] px-2 py-1 text-[#7c3aed]">{post.v} টি পদ</span>}
                              <span className="rounded-md bg-[#f3e8ff] px-2 py-1 text-[#7c3aed]">ন্যূনতম: স্নাতক</span>
                            </div>
                            {post.q && <p className="mt-2 text-sm text-slate-500 leading-relaxed">{post.q}</p>}
                          </div>
                          <div className="flex flex-col items-start sm:items-end justify-center min-w-25 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <span className="text-xs font-medium text-slate-500">সরকারি ফি</span>
                            <span className="text-lg font-bold text-slate-900">৳{post.fee || 112}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>পূর্ণ নাম *</label>
                    <input className={inputCls} value={formData.name} onChange={(e) => setField("name", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>পিতার নাম *</label>
                    <input className={inputCls} value={formData.father} onChange={(e) => setField("father", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>মাতার নাম *</label>
                    <input className={inputCls} value={formData.mother} onChange={(e) => setField("mother", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>জন্ম তারিখ *</label>
                    <input type="date" className={inputCls} value={formData.dob} onChange={(e) => setField("dob", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>NID নম্বর *</label>
                    <input className={inputCls} value={formData.nid} onChange={(e) => setField("nid", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>মোবাইল নম্বর *</label>
                    <input className={inputCls} value={formData.mobile} onChange={(e) => setField("mobile", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>ঠিকানা</label>
                    <textarea className={inputCls} value={formData.address} onChange={(e) => setField("address", e.target.value)} />
                  </div>
                </div>
              )}

              {/* Step 2: Documents */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <UploadBtn label="পাসপোর্ট সাইজ ছবি" hint="JPG/PNG" fieldKey="photo" />
                    <UploadBtn label="স্বাক্ষর" hint="JPG/PNG" fieldKey="signature" />
                    <UploadBtn label="NID এর ছবি (একাধিক)" hint="JPG/PNG/PDF" fieldKey="nidPhoto" multiple />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">শিক্ষাগত সার্টিফিকেট (একাধিক আপলোড করা যাবে)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <UploadBtn label="SSC সার্টিফিকেট" hint="PDF/JPG" fieldKey="ssc" multiple />
                      <UploadBtn label="HSC সার্টিফিকেট" hint="PDF/JPG" fieldKey="hsc" multiple />
                      <UploadBtn label="স্নাতক (Honors)" hint="PDF/JPG" fieldKey="graduation" multiple />
                      <UploadBtn label="স্নাতকোত্তর (Masters)" hint="PDF/JPG" fieldKey="masters" multiple />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between font-bold text-lg mb-2">
                      <span>মোট ফি</span>
                      <span className="text-brand-600">৳{total}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className={labelCls}>পেমেন্ট মাধ্যম বাছাই করুন</div>
                    {/* 💡 ডাইনামিক পেমেন্ট মেথড লিস্ট */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {paymentMethods.length === 0 && <p className="text-sm text-slate-500 col-span-full">কোনো পেমেন্ট মাধ্যম চালু নেই।</p>}
                      {paymentMethods.map((m) => (
                        <button 
                          type="button" 
                          key={m.id} 
                          onClick={() => setPaymentMethod(m.id)} 
                          className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${paymentMethod === m.id ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 💡 ডাইনামিক পেমেন্ট নাম্বার ডিসপ্লে */}
                  {paymentMethod && selectedPaymentDetails && (
                    <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs text-amber-700 font-bold mb-1">অনুগ্রহ করে এই নাম্বারে ৳{total} পাঠান:</p>
                      <div className="text-xl font-bold text-slate-900 tracking-wider">{selectedPaymentDetails.number}</div>
                      <p className="text-[11px] text-amber-600 mt-1">({selectedPaymentDetails.type} - {selectedPaymentDetails.name})</p>
                      <p className="text-[11px] text-amber-600 mt-2 font-semibold">সেন্ড মানি করার পর নিচে তথ্য দিন।</p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>আপনার পাঠানো নাম্বার *</label>
                      <input className={inputCls} value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX" />
                    </div>
                    <div>
                      <label className={labelCls}>Transaction ID (TrxID) *</label>
                      <input className={inputCls} value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="যেমন: 9F7A2B1C" />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-600" />
                    <span className="text-xs text-slate-600">আমি নিশ্চিত করছি যে প্রদত্ত পেমেন্ট তথ্য সঠিক এবং আমি শর্তাবলীতে সম্মত।</span>
                  </label>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-11 w-11" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-slate-900">আবেদন সম্পন্ন হয়েছে!</h2>
                  <p className="mt-2 text-sm text-slate-500">আপনার পেমেন্ট যাচাই করে আবেদনটি প্রসেস করা হবে। সম্পূর্ণ হলে Applicant&apos;s Copy পাবেন।</p>
                  <button onClick={() => router.push("/profile/dashboard")} className="mt-6 rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow-md">ড্যাশবোর্ডে যান</button>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            {step < 4 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-5 px-6">
                <button onClick={handleBack} disabled={isSubmitting} className={`flex items-center gap-2 font-bold ${step === 0 ? "invisible" : "text-slate-600"}`}>
                  <ArrowLeft className="h-4 w-4" /> পেছনে
                </button>
                <button onClick={handleNext} disabled={isSubmitting || Object.values(uploading).some(Boolean)} className="flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow-md disabled:opacity-70">
                  {isSubmitting || Object.values(uploading).some(Boolean) ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "সাবমিট হচ্ছে..." : step === 3 ? "সাবমিট করুন" : "পরবর্তী"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">আপনার আবেদন</h3>
              {selectedPosts.length > 0 ? (
                <ul className="mb-3 space-y-1.5">
                  {selectedPosts.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-500" /> {p.n}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">কোনো পদ সিলেক্ট করা হয়নি</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-base font-bold text-slate-900 block mb-1">মোট ফি</span>
                <span className="text-2xl font-bold text-brand-600">৳{total}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}