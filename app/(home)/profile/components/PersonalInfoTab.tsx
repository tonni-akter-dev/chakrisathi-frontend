/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdateMyProfileMutation } from '@/app/redux/features/apis/auth-api';

export default function PersonalInfoTab({ profile }: { profile: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();

  // 💡 ১. সব ফিল্ডের জন্য স্টেট তৈরি করা হলো
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    fatherName: '',
    motherName: '',
    nid: '',
    address: '',
    education: '',
  });

  // 💡 ২. ডাটা লোড হলে ফর্মে সেট করা
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        fatherName: profile.fatherName || '',
        motherName: profile.motherName || '',
        nid: profile.nid || '',
        address: profile.address || '',
        education: profile.education || '',
      });
    }
  }, [profile]);

  // 💡 ৩. সেভ বাটনে ক্লিক করলে সব ডাটা API-তে পাঠানো
  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        nid: formData.nid,
        address: formData.address,
        education: formData.education,
      }).unwrap(); 
      
      toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('আপডেট ব্যর্থ হয়েছে! আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in">
      
      {/* হেডার ও এডিট বাটন */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="rounded-lg border border-brand-600 px-4 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)} 
              className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={isUpdating} 
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-70"
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </button>
          </div>
        )}
      </div>

      {/* ফর্ম গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-slate-500">Full Name (English)</label>
          {isEditing ? (
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          ) : (
            <div className="mt-1 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 border border-slate-100">{profile?.name || 'N/A'}</div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-slate-500">Mobile Number</label>
          {isEditing ? (
            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          ) : (
            <div className="mt-1 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 border border-slate-100">{profile?.phone || 'N/A'}</div>
          )}
        </div>

        {/* Father's Name */}
        <div>
          <label className="text-sm font-medium text-slate-500">Father's Name</label>
          {isEditing ? (
            <input type="text" value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          ) : (
            <div className="mt-1 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 border border-slate-100">{profile?.fatherName || 'Not Added'}</div>
          )}
        </div>

        {/* Mother's Name */}
        <div>
          <label className="text-sm font-medium text-slate-500">Mother's Name</label>
          {isEditing ? (
            <input type="text" value={formData.motherName} onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          ) : (
            <div className="mt-1 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 border border-slate-100">{profile?.motherName || 'Not Added'}</div>
          )}
        </div>

        {/* NID */}
        <div>
          <label className="text-sm font-medium text-slate-500">NID Number</label>
          {isEditing ? (
            <input type="text" value={formData.nid} onChange={(e) => setFormData({ ...formData, nid: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          ) : (
            <div className="mt-1 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 border border-slate-100">{profile?.nid || 'Not Added'}</div>
          )}
        </div>

        {/* Education Dropdown */}
        <div>
          <label className="text-sm font-medium text-slate-500">Highest Education</label>
          {isEditing ? (
            <select value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 bg-white">
              <option value="">Select Education</option>
              <option value="SSC">SSC</option>
              <option value="HSC">HSC</option>
              <option value="Graduation">Graduation</option>
              <option value="Post Graduation">Post Graduation</option>
            </select>
          ) : (
            <div className="mt-1 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 border border-slate-100">{profile?.education || 'Not Added'}</div>
          )}
        </div>

        {/* Address (Full Width) */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-500">Present Address</label>
          {isEditing ? (
            <textarea rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"></textarea>
          ) : (
            <div className="mt-1 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 border border-slate-100">{profile?.address || 'Not Added'}</div>
          )}
        </div>

        {/* Email (Read-Only) */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-500">Email Address</label>
          <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3 border border-slate-200">
            <span className="text-sm font-medium text-slate-600">{profile?.email || 'N/A'}</span>
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded">Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
}