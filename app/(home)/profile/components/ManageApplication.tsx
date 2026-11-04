/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Copy, Loader2, Save, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {
  APP_STATUS,
  ApiError,
  EMPTY_DOCS,
  EMPTY_FORM,
  PAY_STATE,
  apiJson,
  missingInfo,
  payState,
  phoneError,
  type ApplicantForm,
  type ApplicationDocuments,
  type PaymentMethod,
} from '@/utils/applications';
import { DocumentFields, PersonalFields } from '../../apply/components/ApplicationFields';

const inputCls =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50';

const appToForm = (app: any): ApplicantForm => ({
  ...EMPTY_FORM,
  name: app.name || '',
  father: app.fatherName || '',
  mother: app.motherName || '',
  dob: app.dob ? String(app.dob).split('T')[0] : '',
  nid: app.nid || '',
  mobile: app.phone || '',
  email: app.email || '',
  address: app.address || '',
  education: app.education || '',
});

function PaymentForm({ app, onPaid }: { app: any; onPaid: (updated: any) => void }) {
  const [methods, setMethods] = useState<PaymentMethod[] | null>(null);
  const [methodId, setMethodId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiJson<{ methods?: PaymentMethod[] }>('/settings')
      .then((settings) => setMethods((settings.methods || []).filter((m) => m.active)))
      .catch(() => setMethods([]));
  }, []);

  const method = methods?.find((m) => m.id === methodId);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(method?.number || '');
      toast.success('নম্বর কপি হয়েছে');
    } catch {
      toast.info('নম্বরটি হাতে লিখে নিন');
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!method) return toast.error('পেমেন্ট মাধ্যম বাছাই করুন');
    const numberProblem = phoneError(senderNumber);
    if (!senderNumber || numberProblem) return toast.error(numberProblem || 'যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি দিন');
    if (!trxId.trim()) return toast.error('Transaction ID দিন');

    setIsSaving(true);
    try {
      const updated = await apiJson(`/applications/my/${app.applicationId}/payment`, 'PUT', {
        paymentMethod: method.id,
        senderNumber,
        trxId,
      });
      toast.success('পেমেন্টের তথ্য জমা হয়েছে');
      onPaid(updated);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (methods === null) return <Loader2 className="h-6 w-6 animate-spin text-brand-600" />;
  if (methods.length === 0) {
    return <p className="text-sm text-slate-600">এখন কোনো পেমেন্ট মাধ্যম চালু নেই। কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <div className="mb-1.5 text-sm font-bold text-slate-700">১. পেমেন্ট মাধ্যম বাছাই করুন</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {methods.map((m) => (
            <button
              type="button"
              key={m.id}
              aria-pressed={methodId === m.id}
              onClick={() => setMethodId(m.id)}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${
                methodId === m.id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {method && (
        <>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-800">২. এই নম্বরে ৳{app.amount} Send Money করুন</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xl font-bold tracking-wider text-slate-900">{method.number}</span>
              <button type="button" onClick={copyNumber} aria-label="নম্বর কপি করুন" className="rounded-lg border border-amber-300 bg-white p-2 text-amber-800 hover:bg-amber-100">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-amber-700">{method.name} ({method.type})</p>
          </div>

          <div>
            <div className="mb-3 text-sm font-bold text-slate-700">৩. টাকা পাঠানোর পরে তথ্য দিন</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sender" className="mb-1.5 block text-sm font-bold text-slate-700">যে নম্বর থেকে পাঠিয়েছেন</label>
                <input id="sender" inputMode="tel" className={inputCls} placeholder="01XXXXXXXXX" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} />
              </div>
              <div>
                <label htmlFor="trx" className="mb-1.5 block text-sm font-bold text-slate-700">Transaction ID</label>
                <input id="trx" autoCapitalize="characters" autoComplete="off" className={inputCls} placeholder="যেমন: 9F7A2B1C" value={trxId} onChange={(e) => setTrxId(e.target.value)} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-bold text-white shadow-md hover:bg-brand-700 disabled:opacity-70 sm:w-auto">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} পেমেন্টের তথ্য জমা দিন
          </button>
        </>
      )}
    </form>
  );
}

export default function ManageApplication() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<ApplicantForm>(EMPTY_FORM);
  const [documents, setDocuments] = useState<ApplicationDocuments>(EMPTY_DOCS);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const applyLoaded = (loaded: any) => {
    setApp(loaded);
    setForm(appToForm(loaded));
    setDocuments({ ...EMPTY_DOCS, ...loaded.documents });
  };

  useEffect(() => {
    const next = encodeURIComponent(`/profile/applied-jobs/${id}`);
    if (!Cookies.get('token')) {
      router.replace(`/login?next=${next}`);
      return;
    }
    apiJson<any>(`/applications/${id}`)
      .then((loaded) => {
        // অন্যের আবেদন হলে শুধু সীমিত তথ্য আসে; এই পেজ তার জন্য নয়
        if (loaded.publicView) setApp(null);
        else applyLoaded(loaded);
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) router.replace(`/login?next=${next}`);
        setApp(null);
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  // Pay Now থেকে এলে সরাসরি পেমেন্ট অংশে যাওয়া
  useEffect(() => {
    if (app && window.location.hash === '#payment') {
      document.getElementById('payment')?.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?._id]);

  const saveInfo = async () => {
    setIsSaving(true);
    try {
      const updated = await apiJson(`/applications/my/${id}/info`, 'PUT', {
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
      applyLoaded(updated);
      toast.success('তথ্য সেভ হয়েছে');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="py-20 text-center">
        <p className="font-bold text-slate-800">আবেদনটি পাওয়া যায়নি</p>
        <Link href="/profile/applied-jobs" className="mt-3 inline-block font-semibold text-brand-600 hover:underline">আমার আবেদনে ফিরুন</Link>
      </div>
    );
  }

  const pay = payState(app);
  const canPay = (pay === 'unpaid' || pay === 'rejected') && app.status !== 'rejected';
  const canEdit = app.status === 'pending';
  const missing = missingInfo(app);
  const status = APP_STATUS[app.status] || APP_STATUS.pending;

  return (
    <div className="mx-auto my-6 w-full max-w-4xl space-y-6 font-hind">
      <Link href="/profile/applied-jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> আমার আবেদন
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="text-xs font-bold text-brand-700">{app.applicationId}</div>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{app.posts?.map((p: any) => p.name).join(', ')}</h1>
        <p className="text-sm font-medium text-slate-500">{app.circularOrg}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${PAY_STATE[pay].cls}`}>{PAY_STATE[pay].label}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>{status.label}</span>
        </div>
        <Link href={`/track/${app.applicationId}`} className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline">
          আবেদনের অগ্রগতি দেখুন
        </Link>
      </section>

      <section id="payment" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">পেমেন্ট</h2>
          <span className="text-2xl font-bold text-brand-600">৳{app.amount}</span>
        </div>

        {pay === 'rejected' && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">
            <XCircle className="mt-0.5 h-5 w-5 flex-none" />
            আগের পেমেন্টের তথ্য যাচাই করা যায়নি। সঠিক তথ্য দিয়ে আবার জমা দিন।
          </div>
        )}
        {canPay && <PaymentForm app={app} onPaid={applyLoaded} />}
        {pay === 'waiting' && (
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            <Clock className="mt-0.5 h-5 w-5 flex-none" />
            <div>
              আপনার পেমেন্টের তথ্য পেয়েছি। অ্যাডমিন অনুমোদন করলে আবেদনের কাজ শুরু হবে।
              <div className="mt-1 font-semibold">TrxID: {app.trxId}</div>
            </div>
          </div>
        )}
        {pay === 'verified' && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-5 w-5 flex-none" /> আপনার পেমেন্ট যাচাই হয়েছে।
          </div>
        )}
      </section>

      {canEdit ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">তথ্য ও কাগজপত্র</h2>
          {missing.length > 0 ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
              <div>টেলিটকে আবেদনের জন্য এগুলো লাগবে: <span className="font-semibold">{missing.join(', ')}</span></div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-500">কাজ শুরু হওয়ার আগে পর্যন্ত বদলাতে পারবেন।</p>
          )}

          <div className="mt-5"><PersonalFields form={form} onChange={(key, value) => setForm((f) => ({ ...f, [key]: value }))} /></div>
          <div className="mt-6 border-t border-slate-100 pt-6">
            <DocumentFields documents={documents} onChange={setDocuments} onBusyChange={setIsUploading} />
          </div>

          <button
            type="button"
            onClick={saveInfo}
            disabled={isSaving || isUploading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-70 sm:w-auto"
          >
            {isSaving || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isUploading ? 'আপলোড হচ্ছে...' : 'তথ্য সেভ করুন'}
          </button>
        </section>
      ) : (
        <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">আবেদনের কাজ শুরু হয়ে গেছে, তাই তথ্য আর বদলানো যাবে না। কিছু ঠিক করতে হলে সাপোর্টে যোগাযোগ করুন।</p>
      )}
    </div>
  );
}
