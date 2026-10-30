/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight, ArrowLeft, Check, HelpCircle, MapPin,
  CheckCircle2, Upload, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  useGetMyProfileQuery 
} from '@/app/redux/features/apis/auth-api'; 
import { useGetSingleCircularQuery } from '@/app/redux/features/apis/circular-api';

const STEPS = ['পদ বাছাই', 'ব্যক্তিগত তথ্য', 'কাগজপত্র', 'পেমেন্ট', 'সম্পন্ন'];

const HEADERS = [
  { title: 'কোন পদে আবেদন করতে চান?', sub: 'একাধিক পদ বাছাই করলে সার্ভিস চার্জে ছাড় পাবেন। প্রতিটি পদের জন্য টেলিটকে আলাদা আবেদন হবে।' },
  { title: 'ব্যক্তিগত তথ্য', sub: 'আপনার প্রোফাইল থেকে তথ্য আনা হয়েছে। প্রয়োজনে এডিট করে ঠিক করে নিন।' },
  { title: 'কাগজপত্র আপলোড', sub: 'স্পষ্ট ছবি আপলোড করুন (JPG/PNG, সর্বোচ্চ ৩০০KB)।' },
  { title: 'পেমেন্ট', sub: 'পেমেন্ট মাধ্যম বাছাই করে আবেদন নিশ্চিত করুন।' },
  { title: '', sub: '' },
];

type FormData = {
  name: string; father: string; mother: string; dob: string;
  nid: string; mobile: string; email: string; address: string; education: string;
};

type FilesData = { photo: File | null; signature: File | null; certificate: File | null };

const EMPTY_FORM: FormData = {
  name: '', father: '', mother: '', dob: '',
  nid: '', mobile: '', email: '', address: '', education: '',
};

export default function ApplyContent () {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  // 💡 সার্কুলার এবং ইউজার প্রোফাইল দুটোরই ডাটা লোড করা
  const { data: circular, isLoading: isCircularLoading, isError } = useGetSingleCircularQuery(jobId, {
    skip: !jobId,
  });

  // 💡 ইউজারের প্রোফাইল ডাটা আনা
  const { data: userProfile, isLoading: isProfileLoading } = useGetMyProfileQuery(undefined);

  const [step, setStep] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [files, setFiles] = useState<FilesData>({ photo: null, signature: null, certificate: null });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [agree, setAgree] = useState(false);

  // 💡 ইউজার প্রোফাইল ডাটা আসলে ফর্মে অটোমেটিক্যালি সেট করে দেওয়া
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || '',
        father: userProfile.fatherName || '',
        mother: userProfile.motherName || '',
        // ডাটাবেসে dob Date ফরম্যাটে থাকে, তাই ইনপুটের জন্য YYYY-MM-DD ফরম্যাটে কাটা হলো
        dob: userProfile.dob ? userProfile.dob.split('T')[0] : '',
        nid: userProfile.nid || '',
        mobile: userProfile.phone || '',
        email: userProfile.email || '',
        address: userProfile.address || '',
        education: userProfile.education || '',
      }));
    }
  }, [userProfile]);

  const togglePost = (postName: string) => {
    setSelectedPosts(prev =>
      prev.includes(postName)
        ? prev.filter(p => p !== postName)
        : [...prev, postName]
    );
  };

  const setField = (key: keyof FormData, value: string) =>
    setFormData(f => ({ ...f, [key]: value }));

  const handleNext = () => {
    if (step === 0 && selectedPosts.length === 0) {
      return toast.error('অন্তত একটি পদ বাছাই করুন।');
    }

    if (step === 1) {
      const requiredFields: { key: keyof FormData; label: string }[] = [
        { key: 'name', label: 'পূর্ণ নাম' },
        { key: 'father', label: 'পিতার নাম' },
        { key: 'mother', label: 'মাতার নাম' },
        { key: 'dob', label: 'জন্ম তারিখ' },
        { key: 'nid', label: 'জাতীয় পরিচয়পত্র নম্বর' },
        { key: 'mobile', label: 'মোবাইল নম্বর' },
      ];
      const missing = requiredFields.find(f => !formData[f.key].trim());
      if (missing) return toast.error(`"${missing.label}" পূরণ করুন।`);
      if (!/^01[3-9]\d{8}$/.test(formData.mobile)) {
        return toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      }
      if (formData.nid.trim().length < 10) {
        return toast.error('সঠিক NID নম্বর দিন।');
      }
    }

    if (step === 2) {
      if (!files.photo || !files.signature || !files.certificate) {
        return toast.error('সব কাগজপত্র আপলোড করুন।');
      }
    }

    if (step === 3) {
      if (!paymentMethod) return toast.error('পেমেন্ট মাধ্যম বাছাই করুন।');
      if (!agree) return toast.error('শর্তাবলীতে সম্মতি দিন।');
      
      toast.success('আবেদন সফলভাবে জমা হয়েছে!');
    }

    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const inputCls = 'w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50';
  const labelCls = 'mb-1.5 block text-xs font-bold text-slate-600';

  // 💡 লোডিং স্টেট (সার্কুলার এবং প্রোফাইল দুটোই চেক করা হচ্ছে)
  if (isCircularLoading || isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (isError || !circular) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-800">সার্কুলার পাওয়া যায়নি!</h1>
        <button onClick={() => router.push('/jobs')} className="mt-4 rounded-lg bg-brand-600 px-6 py-2 text-white font-semibold">
          জব বোর্ডে ফিরে যান
        </button>
      </div>
    );
  }

  const govtFee = selectedPosts.reduce((sum, postName) => {
    const post = circular?.posts?.find((p: any) => p.n === postName);
    const fee = post?.fee ? Number(post.fee) : 112;
    return sum + fee;
  }, 0);

  const smsFee = selectedPosts.length * 15;
  const serviceFee = selectedPosts.length > 0 ? 100 : 0;
  const total = govtFee + smsFee + serviceFee;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-hind pb-20">
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        
        {/* হেডার (ডাইনামিক) */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-600 to-brand-800 text-white shadow-lg">
          <div className="relative flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-5">
              <div className="grid h-14 w-16 flex-none place-items-center rounded-xl border border-white/30 bg-white/10 font-bold tracking-widest text-white backdrop-blur-sm">
                {circular.ab || 'JOB'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{circular.title || circular.org}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {circular.loc}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{circular.posts?.length || 0}টি পদ</span>
                </div>
              </div>
            </div>

            <div className="flex-none text-left sm:text-right">
              <div className="text-sm text-white/80">আবেদনের শেষ</div>
              <div className="text-xl font-bold">{new Date(circular.end).toLocaleDateString('bn-BD')}</div>
            </div>
          </div>
        </div>

        {/* Stepper (Desktop) */}
        <div className="relative mx-auto mb-10 mt-10 hidden max-w-4xl px-4 sm:block">
          <div className="absolute left-10 right-10 top-5 -z-10 h-0.5 bg-slate-200"></div>
          <div className="flex justify-between">
            {STEPS.map((label, i) => {
              const isDone = i < step;
              const isCurrent = i === step;
              return (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition-all duration-300 ${isDone ? 'bg-brand-600 text-white shadow-md shadow-brand-200' :
                    isCurrent ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-md shadow-brand-200' :
                      'bg-white text-slate-400 border-2 border-slate-200'
                    }`}>
                    {isDone ? <Check className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${isDone || isCurrent ? 'text-brand-900' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stepper (Mobile) */}
        <div className="mt-6 mb-6 sm:hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="text-brand-700">ধাপ {step + 1} / {STEPS.length}: {STEPS[step]}</span>
            <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-linear-to-r from-brand-500 to-brand-700 transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex-1 p-6 sm:p-8">
              {step < 4 && (
                <>
                  <h2 className="mb-1 text-2xl font-bold text-slate-900">{HEADERS[step].title}</h2>
                  <p className="mb-6 text-sm text-slate-500">{HEADERS[step].sub}</p>
                </>
              )}

              {/* STEP 0 : Post selection (Dynamic API Data) */}
              {step === 0 && (
                <div className="space-y-4">
                  {circular.posts?.map((post: any) => {
                    const isSelected = selectedPosts.includes(post.n);
                    return (
                      <button
                        type="button"
                        key={post.n}
                        onClick={() => togglePost(post.n)}
                        className={`flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${isSelected ? 'border-brand-500 bg-brand-50/30 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'
                          }`}
                      >
                        <div className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border-2 transition-colors ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
                          }`}>
                          {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-base font-bold text-slate-900">{post.n}</h3>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                            <span className="rounded-md bg-brand-50 px-2 py-1 text-brand-700">{post.g} গ্রেড</span>
                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">৳{post.sal}</span>
                            <span className="rounded-md bg-brand-50 px-2 py-1 text-brand-700">{post.v} টি পদ</span>
                            {post.q && <span className="rounded-md bg-brand-50 px-2 py-1 text-brand-700">{post.q}</span>}
                          </div>
                        </div>

                        <div className="flex-none text-right">
                          <div className="text-xs font-medium text-slate-500">সরকারি ফি</div>
                          <div className="text-lg font-bold text-slate-900">৳{post.fee || 112}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 1 : Personal info (Auto-filled from API) */}
              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span></label>
                    <input className={inputCls} value={formData.name} onChange={e => setField('name', e.target.value)} placeholder="যেমন: মোঃ রফিকুল ইসলাম" />
                  </div>
                  <div>
                    <label className={labelCls}>পিতার নাম <span className="text-rose-500">*</span></label>
                    <input className={inputCls} value={formData.father} onChange={e => setField('father', e.target.value)} placeholder="পিতার নাম" />
                  </div>
                  <div>
                    <label className={labelCls}>মাতার নাম <span className="text-rose-500">*</span></label>
                    <input className={inputCls} value={formData.mother} onChange={e => setField('mother', e.target.value)} placeholder="মাতার নাম" />
                  </div>
                  <div>
                    <label className={labelCls}>জন্ম তারিখ <span className="text-rose-500">*</span></label>
                    <input type="date" className={inputCls} value={formData.dob} onChange={e => setField('dob', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>জাতীয় পরিচয়পত্র নম্বর <span className="text-rose-500">*</span></label>
                    <input className={inputCls} value={formData.nid} onChange={e => setField('nid', e.target.value)} placeholder="১৭ ডিজিট" inputMode="numeric" />
                  </div>
                  <div>
                    <label className={labelCls}>মোবাইল নম্বর <span className="text-rose-500">*</span></label>
                    <input className={inputCls} value={formData.mobile} onChange={e => setField('mobile', e.target.value)} placeholder="01XXXXXXXXX" inputMode="numeric" maxLength={11} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>স্থায়ী ঠিকানা</label>
                    <textarea rows={3} className={inputCls} value={formData.address} onChange={e => setField('address', e.target.value)} placeholder="গ্রাম/বাসা, ডাকঘর, উপজেলা, জেলা" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>সর্বোচ্চ শিক্ষাগত যোগ্যতা</label>
                    <select className={inputCls} value={formData.education} onChange={e => setField('education', e.target.value)}>
                      <option value="">বাছাই করুন</option>
                      <option value="SSC">এসএসসি</option>
                      <option value="HSC">এইচএসসি</option>
                      <option value="Graduation">স্নাতক</option>
                      <option value="Post Graduation">স্নাতকোত্তর</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2 : Documents (File Object Updated) */}
              {step === 2 && (
                <div className="space-y-4">
                  {([
                    { key: 'photo' as const, label: 'সাম্প্রতিক পাসপোর্ট সাইজ ছবি', hint: 'JPG/PNG • সর্বোচ্চ ৩০০KB' },
                    { key: 'signature' as const, label: 'স্বাক্ষর', hint: 'JPG/PNG • সর্বোচ্চ ৩০০KB' },
                    { key: 'certificate' as const, label: 'শিক্ষাগত সনদ', hint: 'PDF/JPG • সর্বোচ্চ ১MB' },
                  ]).map(item => {
                    const uploaded = files[item.key];
                    return (
                      <label key={item.key} className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed p-4 transition ${uploaded ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200 hover:border-brand-400'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`grid h-10 w-10 flex-none place-items-center rounded-xl ${uploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-50 text-brand-600'}`}>
                            {uploaded ? <Check className="h-5 w-5" strokeWidth={3} /> : <Upload className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{item.label}</div>
                            <div className="text-xs text-slate-500">{uploaded ? `✅ ${uploaded.name}` : item.hint}</div>
                          </div>
                        </div>
                        <span className={`flex-none rounded-full px-4 py-1.5 text-xs font-bold ${uploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'}`}>
                          {uploaded ? 'পরিবর্তন' : 'আপলোড'}
                        </span>
                        <input type="file" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setFiles(prev => ({ ...prev, [item.key]: f }));
                        }} />
                      </label>
                    );
                  })}
                </div>
              )}

              {/* STEP 3 : Payment */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between py-1"><span className="text-slate-600">সরকারি ফি</span><span className="font-bold text-slate-900">৳{govtFee}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-600">SMS চার্জ</span><span className="font-bold text-slate-900">৳{smsFee}</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-600">সার্ভিস চার্জ</span><span className="font-bold text-slate-900">৳{serviceFee}</span></div>
                    <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base">
                      <span className="font-bold text-slate-900">মোট</span>
                      <span className="font-bold text-brand-600">৳{total}</span>
                    </div>
                  </div>
                  <div>
                    <div className={labelCls}>পেমেন্ট মাধ্যম বাছাই করুন</div>
                    <div className="grid grid-cols-2 gap-3">
                      {['bkash', 'nagad', 'rocket', 'card'].map(m => (
                        <button type="button" key={m} onClick={() => setPaymentMethod(m)} className={`rounded-xl border-2 px-4 py-3 text-sm font-bold capitalize transition ${paymentMethod === m ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-600" />
                    <span className="text-xs leading-relaxed text-slate-600">আমি ঘোষণা করছি যে প্রদত্ত সকল তথ্য সত্য ও সঠিক।</span>
                  </label>
                </div>
              )}

              {/* STEP 4 : Success */}
              {step === 4 && (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-11 w-11" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-slate-900">আবেদন সম্পন্ন হয়েছে!</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                    আপনার আবেদন সফলভাবে জমা হয়েছে। নিচের আবেদন নম্বরটি সংরক্ষণ করুন।
                  </p>
                  <div className="mt-5 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-6 py-3">
                    <div className="text-xs font-bold text-brand-500">আবেদন নম্বর</div>
                    <div className="text-xl font-bold tracking-wider text-brand-800">WTMU-2024-887931</div>
                  </div>
                  <button onClick={() => router.push('/profile/dashboard')} className="mt-6 rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02]">
                    ড্যাশবোর্ডে যান
                  </button>
                </div>
              )}
            </div>

            {/* Footer Nav */}
            {step < 4 && (
              <div className="flex items-center justify-between rounded-b-3xl border-t border-slate-100 bg-slate-50/50 p-5 px-6 sm:px-8">
                <button onClick={handleBack} className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition ${step === 0 ? 'invisible' : 'text-slate-600 hover:bg-slate-200'}`}>
                  <ArrowLeft className="h-4 w-4" /> পেছনে
                </button>
                <button onClick={handleNext} className="flex items-center gap-2 rounded-full bg-linear-to-r from-orange-400 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg">
                  {step === 3 ? 'পেমেন্ট করুন' : 'পরবর্তী'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Summary Panel */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">আপনার আবেদন</h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                  {selectedPosts.length}টি পদ
                </span>
              </div>

              {selectedPosts.length > 0 && (
                <ul className="mb-3 space-y-1.5">
                  {selectedPosts.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-500" strokeWidth={3} />
                      {p}
                    </li>
                  ))}
                </ul>
              )}

              <div className="space-y-3 border-t border-slate-100 pt-3 text-sm font-medium text-slate-600">
                {selectedPosts.length === 0 && (
                  <p className="py-4 text-center text-slate-400">এখনো কোনো পদ বাছাই করেননি</p>
                )}
                <div className="flex justify-between"><span>সরকারি ফি</span><span className="text-slate-900">৳{govtFee}</span></div>
                <div className="flex justify-between"><span>SMS চার্জ</span><span className="text-slate-900">৳{smsFee}</span></div>
                <div className="flex justify-between"><span>সার্ভিস চার্জ</span><span className="text-slate-900">৳{serviceFee}</span></div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-base font-bold text-slate-900">মোট</span>
                <span className="text-2xl font-bold text-brand-600">৳{total}</span>
              </div>
            </div>

            <div className="rounded-3xl bg-linear-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-brand-200">
                <HelpCircle className="h-4 w-4" /> সাহায্য দরকার? কল করুন
              </div>
              <div className="mt-2 text-2xl font-bold tracking-wide">০১৭০০-০০০০০০</div>
              <div className="mt-1 text-sm text-brand-200">সকাল ৯টা – রাত ৯টা</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}