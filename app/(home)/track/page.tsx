// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import { useState } from 'react';
// import Link from 'next/link';
// import {
//     Search, ArrowRight, ShieldCheck, Clock,
//     CheckCircle2, AlertCircle, FileText, ChevronRight
// } from 'lucide-react';

// import { toast } from 'react-toastify';

// // --- Mock Data for Demo ---
// const MOCK_APPLICATIONS = [
//     {
//         id: 'CS261023-AB12',
//         phone: '01637013748',
//         status: 'processing', // pending, processing, review, completed
//         circular: 'উৎসে কর ব্যবস্থাপনা ইউনিট',
//         posts: ['কম্পিউটার অপারেটর'],
//         date: '২৩ অক্টোবর, ২০২৬',
//         amount: '২২৭'
//     },
//     {
//         id: 'CS261022-CD34',
//         phone: '01637013748',
//         status: 'completed',
//         circular: 'হাউজিং অ্যান্ড বিল্ডিং রিসার্চ ইনস্টিটিউট (HBRI)',
//         posts: ['অফিস সহায়ক'],
//         date: '২২ অক্টোবর, ২০২৬',
//         amount: '১৭১'
//     }
// ];

// const STATUS_MAP: Record<string, { label: string, color: string, bg: string, icon: any }> = {
//     pending: { label: 'পেন্ডিং', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
//     processing: { label: 'প্রসেসিং', color: 'text-brand-700', bg: 'bg-brand-100', icon: Clock },
//     review: { label: 'রিভিউতে', color: 'text-pink-700', bg: 'bg-pink-100', icon: AlertCircle },
//     completed: { label: 'সম্পন্ন', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle2 },
// };

// export default function TrackPage() {
//     const [query, setQuery] = useState('');
//     const [searched, setSearched] = useState(false);
//     const [results, setResults] = useState<typeof MOCK_APPLICATIONS>([]);

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!query.trim()) return toast.error('আবেদন আইডি বা মোবাইল নম্বর দিন');

//         // Filter Logic
//         const found = MOCK_APPLICATIONS.filter(
//             app => app.id.toLowerCase() === query.toLowerCase() || app.phone === query
//         );

//         setResults(found);
//         setSearched(true);
//     };

//     return (
//         <div className="min-h-screen bg-[#FBF8F4] font-hind pb-20">
//             <main className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
//                 {/* ================= Search Banner ================= */}
//                 <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#5B3DF5] to-[#8A3FF0] px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16">
//                     {/* Background Blobs */}
//                     <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
//                     <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-500/20 blur-[80px]" />

//                     <div className="relative z-10 mx-auto max-w-2xl">
//                         <h1 className="text-3xl font-extrabold text-white sm:text-4xl">আপনার আবেদনের অবস্থা</h1>
//                         <p className="mt-3 text-sm text-purple-100">
//                             আবেদন আইডি (demo: 01637013748) অথবা আবেদনের সময় দেওয়া মোবাইল নম্বর দিয়ে খুঁজুন।
//                         </p>

//                         <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3">
//                             <div className="relative flex-1">
//                                 <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
//                                 <input
//                                     type="text"
//                                     value={query}
//                                     onChange={(e) => setQuery(e.target.value)}
//                                     placeholder="আইডি বা মোবাইল নম্বর দিন..."
//                                     className="h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none ring-2 ring-transparent transition focus:ring-white/50"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:bg-[#EA580C] hover:scale-[1.02]"
//                             >
//                                 খুঁজুন <ArrowRight className="h-4 w-4" />
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* ================= Results Area ================= */}
//                 {searched && (
//                     <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500">

//                         {/* Empty State */}
//                         {results.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-sm">
//                                 <div className="text-5xl mb-4">🥺</div>
//                                 <h3 className="text-xl font-bold text-slate-900">এই তথ্যে কোনো আবেদন পাওয়া যায়নি।</h3>
//                                 <p className="mt-2 text-sm text-slate-500">আইডি বা মোবাইল নম্বরটি সঠিকভাবে লিখেছেন কিনা চেক করুন।</p>
//                                 <div className="mt-6 rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//                                     সাহায্যের জন্য কল করুন <span className="font-bold text-slate-900">০১৭০০-০০০০০০</span>
//                                 </div>
//                             </div>
//                         ) : (
//                             /* Result Found State */
//                             <div className="space-y-4">
//                                 <h2 className="text-lg font-bold text-slate-900 px-2">আপনার আবেদনসমূহ ({results.length})</h2>

//                                 {results.map((app) => {
//                                     const st = STATUS_MAP[app.status];
//                                     return (
//                                         <div key={app.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
//                                             <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 gap-4">
//                                                 <div className="flex items-center gap-4">
//                                                     <div className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400">
//                                                         <FileText className="h-6 w-6" />
//                                                     </div>
//                                                     <div>
//                                                         <div className="text-sm font-bold text-slate-900">{app.id}</div>
//                                                         <div className="text-xs text-slate-500">{app.date}</div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center gap-2">
//                                                     <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${st.bg} ${st.color}`}>
//                                                         <st.icon className="h-3.5 w-3.5" /> {st.label}
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             <div className="p-6">
//                                                 <div className="grid gap-6 sm:grid-cols-2">
//                                                     <div>
//                                                         <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">প্রতিষ্ঠান</div>
//                                                         <div className="font-bold text-slate-900">{app.circular}</div>
//                                                     </div>
//                                                     <div>
//                                                         <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">পদ</div>
//                                                         <div className="font-medium text-slate-700">{app.posts.join(', ')}</div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
//                                                     <div className="text-sm text-slate-500">
//                                                         মোট পরিশোধিত: <span className="font-bold text-slate-900">৳{app.amount}</span>
//                                                     </div>
//                                                     <Link
//                                                         href={`/track/${app.id}`}
//                                                         className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700"
//                                                     >
//                                                         বিস্তারিত দেখুন <ChevronRight className="h-4 w-4" />
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* ================= Trust / Help Section ================= */}
//                 <div className="mt-12 grid gap-4 sm:grid-cols-2">
//                     <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
//                         <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-emerald-50 text-emerald-600">
//                             <ShieldCheck className="h-5 w-5" />
//                         </div>
//                         <div>
//                             <h4 className="font-bold text-slate-900">১০০% নিরাপদ</h4>
//                             <p className="mt-1 text-sm text-slate-500 leading-relaxed">আপনার ব্যক্তিগত তথ্য এবং ডকুমেন্ট সম্পূর্ণ এনক্রিপ্টেড থাকে।</p>
//                         </div>
//                     </div>
//                     <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
//                         <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-blue-50 text-blue-600">
//                             <Clock className="h-5 w-5" />
//                         </div>
//                         <div>
//                             <h4 className="font-bold text-slate-900">দ্রুত আপডেট</h4>
//                             <p className="mt-1 text-sm text-slate-500 leading-relaxed">আবেদনের প্রতিটি ধাপ (পেন্ডিং থেকে সম্পন্ন) রিয়েল-টাইমে আপডেট হয়।</p>
//                         </div>
//                     </div>
//                 </div>

//             </main>
//         </div>
//     );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ShieldCheck, Clock, CheckCircle2, AlertCircle, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const STATUS_MAP: Record<string, { label: string, color: string, bg: string, icon: any }> = {
    pending: { label: 'পেন্ডিং', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
    processing: { label: 'প্রসেসিং', color: 'text-brand-700', bg: 'bg-brand-100', icon: Clock },
    review: { label: 'রিভিউতে', color: 'text-pink-700', bg: 'bg-pink-100', icon: AlertCircle },
    completed: { label: 'সম্পন্ন', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle2 },
};

export default function TrackPage() {
    const [query, setQuery] = useState('');
    const [searched, setSearched] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return toast.error('আবেদন আইডি বা মোবাইল নম্বর দিন');

        setIsLoading(true);
        setSearched(false);
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/track?query=${query}`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'সার্চ ব্যর্থ হয়েছে');
            
            setResults(data);
        } catch (error: any) {
            toast.error(error.message);
            setResults([]);
        } finally {
            setIsLoading(false);
            setSearched(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF8F4] font-hind pb-20">
            <main className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
                {/* Search Banner */}
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#5B3DF5] to-[#8A3FF0] px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16">
                    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-500/20 blur-[80px]" />

                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">আপনার আবেদনের অবস্থা</h1>
                        <p className="mt-3 text-sm text-purple-100">
                            আবেদন আইডি অথবা আবেদনের সময় দেওয়া মোবাইল নম্বর দিয়ে খুঁজুন।
                        </p>

                        <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="আইডি বা মোবাইল নম্বর দিন..."
                                    className="h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none ring-2 ring-transparent transition focus:ring-white/50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:bg-[#EA580C] hover:scale-[1.02] disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'খুঁজুন'} <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Area */}
                {searched && (
                    <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                                <div className="text-5xl mb-4">🥺</div>
                                <h3 className="text-xl font-bold text-slate-900">এই তথ্যে কোনো আবেদন পাওয়া যায়নি।</h3>
                                <p className="mt-2 text-sm text-slate-500">আইডি বা মোবাইল নম্বরটি সঠিকভাবে লিখেছেন কিনা চেক করুন।</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-slate-900 px-2">আপনার আবেদনসমূহ ({results.length})</h2>

                                {results.map((app) => {
                                    const st = STATUS_MAP[app.status] || STATUS_MAP.pending;
                                    return (
                                        <div key={app._id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400">
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{app.applicationId}</div>
                                                        <div className="text-xs text-slate-500">{new Date(app.createdAt).toLocaleDateString('bn-BD')}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${st.bg} ${st.color}`}>
                                                        <st.icon className="h-3.5 w-3.5" /> {st.label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="grid gap-6 sm:grid-cols-2">
                                                    <div>
                                                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">প্রতিষ্ঠান</div>
                                                        <div className="font-bold text-slate-900">{app.circularOrg || 'N/A'}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">পদ</div>
                                                        <div className="font-medium text-slate-700">
                                                            {app.posts?.map((p: any) => p.name).join(', ')}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                                    <div className="text-sm text-slate-500">
                                                        মোট পরিশোধিত: <span className="font-bold text-slate-900">৳{app.amount}</span>
                                                    </div>
                                                    <Link href={`/track/${app.applicationId}`} className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700">
                                                        বিস্তারিত দেখুন <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}