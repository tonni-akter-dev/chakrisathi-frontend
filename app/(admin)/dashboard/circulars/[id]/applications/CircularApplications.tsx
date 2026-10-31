/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // 💡 useRouter ইমপোর্ট করুন
import { ArrowLeft, Search, Loader2, FileText } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function CircularApplications() {
  const params = useParams();
  const router = useRouter(); // 💡 Router ইনিশিয়ালাইজ করুন
  const circularId = params.id as string;

  const [applications, setApplications] = useState<any[]>([]);
  const [circularInfo, setCircularInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        
        // ১. সার্কুলারের ইনফো আনা
        const circRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/circulars/${circularId}`);
        if (circRes.ok) {
          const circData = await circRes.json();
          setCircularInfo(circData);
        }

        // ২. এই সার্কুলারের সব আবেদন আনা
        const appRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications/admin/all?circularId=${circularId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (appRes.ok) {
          const appData = await appRes.json();
          setApplications(appData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [circularId]);

  // সার্চ ফিল্টার
  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) || 
    app.phone.includes(search) || 
    app.applicationId.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* হেডার */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/circulars" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {circularInfo ? circularInfo.org : 'সার্কুলার'} এর আবেদনসমূহ
          </h1>
          <p className="text-sm text-slate-500">মোট {applications.length} জন আবেদন করেছেন।</p>
        </div>
      </div>

      {/* সার্চ বার */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 max-w-md">
        <Search className="h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="আবেদনকারীর নাম, ফোন বা আইডি..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* আবেদনকারীদের টেবিল */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 border-b">
              <tr>
                <th className="px-5 py-4">আবেদন আইডি</th>
                <th className="px-5 py-4">আবেদনকারীর নাম</th>
                <th className="px-5 py-4">মোবাইল নম্বর</th>
                <th className="px-5 py-4">পদ</th>
                <th className="px-5 py-4">স্ট্যাটাস</th>
                <th className="px-5 py-4">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr 
                  key={app._id} 
                  onClick={() => router.push(`/dashboard/applications/${app.applicationId}`)} // 💡 ক্লিক ইভেন্ট যুক্ত করা হলো
                  className="cursor-pointer hover:bg-slate-50/80 transition-colors" // 💡 cursor-pointer যুক্ত করা হলো
                >
                  <td className="px-5 py-4 font-bold text-slate-900">{app.applicationId}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{app.name}</td>
                  <td className="px-5 py-4 text-slate-600">{app.phone}</td>
                  <td className="px-5 py-4 text-slate-600 text-xs">
                    {app.posts?.map((p: any) => p.name).join(', ')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      app.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {new Date(app.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500">এই সার্কুলারে এখনো কোনো আবেদন পড়েনি।</p>
          </div>
        )}
      </div>

    </div>
  );
}