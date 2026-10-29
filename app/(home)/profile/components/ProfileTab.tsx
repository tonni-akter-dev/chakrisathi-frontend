'use client';
import { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { useGetMyProfileQuery } from '@/app/redux/features/apis/auth-api';
import Image from 'next/image';
import PersonalInfoTab from './PersonalInfoTab';
import EducationTab from './EducationTab';

export default function ProfileTab() {
  const [profileTab, setProfileTab] = useState('Personal Informations');
  const profileTabs = [ 'Personal Informations', 'Education'];

  const { data: profile, isLoading, isError } = useGetMyProfileQuery(undefined);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  if (isError) return <div className="p-6 text-center text-red-600">প্রোফাইল লোড করতে সমস্যা হয়েছে।</div>;

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300 my-10">
      
      {/* হেডার সেকশন */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-brand-100">
            {profile?.profileImage ? (
              <Image src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-12 w-12" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{profile?.name || 'User'}</h1>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 border border-brand-100">
              <User className="h-4 w-4" /> {profile?.role === 'admin' ? 'Admin' : 'General User'}
            </div>
          </div>
        </div>

        {/* ট্যাব মেনু */}
        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-slate-200 no-scrollbar">
          {profileTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setProfileTab(tab)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                profileTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ডাইনামিক কম্পোনেন্ট লোড */}
      {profileTab === 'Personal Informations' && <PersonalInfoTab profile={profile} />}
      {profileTab === 'Education' && <EducationTab />}
    </div>
  );
}