/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, Loader2, Save, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function AdminApplicationDetails() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;

  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ১. ডাটা লোড করা
  useEffect(() => {
    const fetchApp = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/${appId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('আবেদন পাওয়া যায়নি');
        const data = await res.json();
        setApp(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApp();
  }, [appId]);

  // ২. স্ট্যাটাস চেঞ্জ হ্যান্ডলার
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApp({ ...app, status: e.target.value });
  };

  // ৩. টাইমলাইনের স্ট্যাটাস চেঞ্জ হ্যান্ডলার
  const handleTimelineChange = (index: number, field: string, value: string) => {
    const updatedTimeline = [...app.timeline];
    updatedTimeline[index] = { ...updatedTimeline[index], [field]: value };
    setApp({ ...app, timeline: updatedTimeline });
  };

  // ৪. সেভ বাটন
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/admin/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: app.status,
          paymentStatus: app.paymentStatus,
          timeline: app.timeline,
          teletalkUser: app.teletalkUser,
          teletalkPass: app.teletalkPass,
        })
      });

      if (!res.ok) throw new Error('আপডেট ব্যর্থ হয়েছে');
      
      toast.success('আবেদন সফলভাবে আপডেট হয়েছে!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>;
  if (!app) return <div className="text-center py-20">আবেদন পাওয়া যায়নি!</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* হেডার */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/applications" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">অ্যাপ্লিকেশন: {app.applicationId}</h1>
            <p className="text-sm text-slate-500">{app.name} • {app.phone}</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-700 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          সেভ করুন
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        {/* বাম দিক: টাইমলাইন */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">আবেদনের অগ্রগতি (এডিট করুন)</h2>
          
          <div className="relative ml-4 space-y-6 border-l-2 border-slate-100">
            {app.timeline?.map((step: any, index: number) => {
              const isDone = step.status === 'done';
              const isCurrent = step.status === 'current';

              return (
                <div key={index} className="relative pl-8">
                  {/* আইকন */}
                  <div className={`absolute -left-4.25 top-1 grid h-8 w-8 place-items-center rounded-full border-2 bg-white ${
                    isDone ? 'border-emerald-500 text-emerald-500' : 
                    isCurrent ? 'border-brand-600 text-brand-600 ring-4 ring-brand-100' : 
                    'border-slate-200 text-slate-300'
                  }`}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : isCurrent ? <Clock className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                  </div>

                  {/* এডিটেবল ফিল্ড */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-bold ${isDone ? 'text-slate-900' : isCurrent ? 'text-brand-700' : 'text-slate-400'}`}>
                        {step.title}
                      </h3>
                      {/* স্ট্যাটাস ড্রপডাউন */}
                      <select 
                        value={step.status} 
                        onChange={(e) => handleTimelineChange(index, 'status', e.target.value)}
                        className="text-xs border border-slate-200 rounded-md px-2 py-1 outline-none focus:border-brand-500"
                      >
                        <option value="done">Done (সবুজ)</option>
                        <option value="current">Current (চলমান)</option>
                        <option value="pending">Pending (অপেক্ষমাণ)</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={step.date} 
                        onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                        placeholder="তারিখ ও সময়" 
                        className="text-xs border border-slate-200 rounded-md px-2 py-1.5 outline-none focus:border-brand-500 w-full"
                      />
                      <input 
                        type="text" 
                        value={step.desc || ''} 
                        onChange={(e) => handleTimelineChange(index, 'desc', e.target.value)}
                        placeholder="বিবরণ (ঐচ্ছিক)" 
                        className="text-xs border border-slate-200 rounded-md px-2 py-1.5 outline-none focus:border-brand-500 w-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ডান দিক: স্ট্যাটাস ও পেমেন্ট */}
        <div className="space-y-6">
          
          {/* স্ট্যাটাস কন্ট্রোল */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 border-b pb-2">অ্যাপ্লিকেশন স্ট্যাটাস</h3>
            
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">মেইন স্ট্যাটাস</label>
              <select 
                value={app.status} 
                onChange={handleStatusChange}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm font-bold outline-none focus:border-brand-500"
              >
                <option value="pending">পেন্ডিং (Pending)</option>
                <option value="processing">প্রসেসিং (Processing)</option>
                <option value="review">রিভিউতে (Review)</option>
                <option value="completed">সম্পন্ন (Completed)</option>
                <option value="rejected">বাতিল (Rejected)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">পেমেন্ট স্ট্যাটাস</label>
              <select 
                value={app.paymentStatus} 
                onChange={(e) => setApp({ ...app, paymentStatus: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm font-bold outline-none focus:border-brand-500"
              >
                <option value="pending">পেন্ডিং (যাচাই বাকি)</option>
                <option value="verified">ভেরিফাইড (টাকা পেয়েছি)</option>
                <option value="rejected">বাতিল (ভুল পেমেন্ট)</option>
              </select>
            </div>
          </div>

          {/* ইউজারের আপলোড করা ডকুমেন্টস */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">ডকুমেন্টস চেক</h3>
            <div className="space-y-2">
              {app.documents?.photo && <a href={app.documents.photo} target="_blank" className="flex items-center gap-2 text-sm text-brand-600 hover:underline"><Download className="h-4 w-4"/> ছবি দেখুন</a>}
              {app.documents?.signature && <a href={app.documents.signature} target="_blank" className="flex items-center gap-2 text-sm text-brand-600 hover:underline"><Download className="h-4 w-4"/> স্বাক্ষর দেখুন</a>}
              {app.documents?.nidPhoto?.[0] && <a href={app.documents.nidPhoto[0]} target="_blank" className="flex items-center gap-2 text-sm text-brand-600 hover:underline"><Download className="h-4 w-4"/> NID দেখুন</a>}
              {app.documents?.ssc?.[0] && <a href={app.documents.ssc[0]} target="_blank" className="flex items-center gap-2 text-sm text-brand-600 hover:underline"><Download className="h-4 w-4"/> SSC সার্টিফিকেট</a>}
              {app.documents?.hsc?.[0] && <a href={app.documents.hsc[0]} target="_blank" className="flex items-center gap-2 text-sm text-brand-600 hover:underline"><Download className="h-4 w-4"/> HSC সার্টিফিকেট</a>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}