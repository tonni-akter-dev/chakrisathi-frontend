import Cookies from 'js-cookie';

export type ApplicantForm = {
  name: string;
  father: string;
  mother: string;
  dob: string;
  nid: string;
  mobile: string;
  email: string;
  address: string;
  education: string;
};

export type ApplicationDocuments = {
  photo: string;
  signature: string;
  nidPhoto: string[];
  ssc: string[];
  hsc: string[];
  graduation: string[];
  masters: string[];
  diploma: string[];
};

export type Fees = { govt: number; sms: number; service: number; total: number };

export type PaymentMethod = { id: string; name: string; number: string; type: string; active?: boolean };

export const EMPTY_FORM: ApplicantForm = {
  name: '', father: '', mother: '', dob: '', nid: '', mobile: '', email: '', address: '', education: '',
};

export const EMPTY_DOCS: ApplicationDocuments = {
  photo: '', signature: '', nidPhoto: [], ssc: [], hsc: [], graduation: [], masters: [], diploma: [],
};

export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;
  constructor(message: string, status: number, data: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const baseUrl = () => `${(process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '')}/api/v1`;

const send = async <T,>(path: string, init: RequestInit, fallback: string): Promise<T> => {
  const token = Cookies.get('token');
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন', 0, {});
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || data.msg || fallback, res.status, data);
  return data as T;
};

export const apiJson = <T,>(path: string, method = 'GET', body?: unknown) =>
  send<T>(
    path,
    {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    'সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন',
  );

export const uploadFile = async (file: File) => {
  const body = new FormData();
  body.append('file', file);
  const data = await send<{ url: string }>('/upload', { method: 'POST', body }, 'ফাইল আপলোড করা যায়নি');
  return data.url;
};

// পেমেন্টের অবস্থা। পুরোনো আবেদনে TrxID ছাড়া "pending" থাকলে সেটাও পেমেন্ট বাকি।
export type PayState = 'unpaid' | 'waiting' | 'verified' | 'rejected';

export const payState = (app: { paymentStatus?: string; trxId?: string; publicView?: boolean }): PayState => {
  if (app.paymentStatus === 'verified') return 'verified';
  if (app.paymentStatus === 'rejected') return 'rejected';
  if (app.paymentStatus === 'unpaid') return 'unpaid';
  if (app.publicView) return 'waiting';
  return app.trxId ? 'waiting' : 'unpaid';
};

export const PAY_STATE: Record<PayState, { label: string; cls: string }> = {
  unpaid: { label: 'পেমেন্ট বাকি', cls: 'bg-amber-100 text-amber-800' },
  waiting: { label: 'অ্যাডমিন অনুমোদনের অপেক্ষায়', cls: 'bg-blue-100 text-blue-800' },
  verified: { label: 'পেমেন্ট যাচাই হয়েছে', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'পেমেন্ট বাতিল হয়েছে', cls: 'bg-rose-100 text-rose-700' },
};

export const APP_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'অপেক্ষমাণ', cls: 'bg-slate-100 text-slate-700' },
  processing: { label: 'কাজ চলছে', cls: 'bg-brand-100 text-brand-700' },
  review: { label: 'আপনার রিভিউর অপেক্ষায়', cls: 'bg-pink-100 text-pink-700' },
  completed: { label: 'সম্পন্ন', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'বাতিল', cls: 'bg-rose-100 text-rose-700' },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// টেলিটকে আবেদনের জন্য যে তথ্য লাগবে তার কোনটা এখনো নেই
export const missingInfo = (app: any): string[] => {
  const items: [unknown, string][] = [
    [app?.fatherName, 'পিতার নাম'],
    [app?.motherName, 'মাতার নাম'],
    [app?.dob, 'জন্ম তারিখ'],
    [app?.nid, 'NID নম্বর'],
    [app?.address, 'ঠিকানা'],
    [app?.documents?.photo, 'ছবি'],
    [app?.documents?.signature, 'স্বাক্ষর'],
  ];
  return items.filter(([value]) => !value).map(([, label]) => label);
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const formatDate = (value?: string | Date | null) =>
  value ? new Date(value).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export const phoneError = (value: string) =>
  value && !/^(\+?88)?01[3-9]\d{8}$/.test(value.replace(/[\s-]/g, '')) ? 'নম্বরটি 01XXXXXXXXX ফরম্যাটে দিন' : '';

export const nidError = (value: string) =>
  value && !/^(\d{10}|\d{13}|\d{17})$/.test(value.trim()) ? 'NID ১০, ১৩ বা ১৭ সংখ্যার হয়' : '';
