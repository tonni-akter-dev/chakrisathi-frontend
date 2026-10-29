/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Plus, BookOpen, Calendar, Edit, X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdateMyProfileMutation, useGetMyProfileQuery } from '@/app/redux/features/apis/auth-api';

export default function EducationTab() {
  const { data: profile, isLoading } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();

  const [isAdding, setIsAdding] = useState(false);
  
  // 💡 ১. কোন আইটেমটি এডিট হচ্ছে তা ট্র্যাক করার স্টেট
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ degree: '', institution: '', year: '', result: '' });

  const educations = profile?.educationDetails || [];

  // 💡 ২. এডিট বাটনে ক্লিক করলে ফর্মে আগের ডাটা লোড হবে
  const handleEditClick = (index: number, edu: any) => {
    setEditingIndex(index);
    setFormData({
      degree: edu.degree || '',
      institution: edu.institution || '',
      year: edu.year || '',
      result: edu.result || ''
    });
    setIsAdding(true); 
  };

  // 💡 ৩. ফর্ম ক্যানসেল বা ক্লোজ করলে সব রিসেট হবে
  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ degree: '', institution: '', year: '', result: '' });
  };

  // 💡 ৪. ফর্ম সাবমিট (নতুন অ্যাড অথবা এডিট সেভ)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let updatedEducations;
      
      if (editingIndex !== null) {
        // যদি এডিট মোডে থাকে, তবে ওই ইনডেক্সের ডাটা রিপ্লেস হবে
        updatedEducations = [...educations];
        updatedEducations[editingIndex] = formData;
      } else {
        // যদি নতুন হয়, তবে অ্যারের শেষে যোগ হবে
        updatedEducations = [...educations, formData];
      }

      await updateProfile({ educationDetails: updatedEducations }).unwrap();
      
      toast.success(editingIndex !== null ? 'তথ্য আপডেট হয়েছে!' : 'শিক্ষাগত তথ্য যোগ হয়েছে!');
      handleCancel(); // কাজ শেষে ফর্ম ক্লোজ

    } catch (error) {
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন!');
    }
  };



  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Educational Qualifications</h2>
        <button 
          onClick={() => { handleCancel(); setIsAdding(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Education
        </button>
      </div>

      {/* 💡 এডুকেশন যোগ বা এডিট করার ফর্ম */}
      {isAdding && (
        <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-5 mb-4 relative animate-in slide-in-from-top-2">
          <button onClick={handleCancel} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5"/>
          </button>
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            {editingIndex !== null ? 'তথ্য পরিবর্তন করুন' : 'নতুন শিক্ষাগত তথ্য যোগ করুন'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="ডিগ্রির নাম" required 
              value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} 
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 outline-none" 
            />
            <input 
              type="text" placeholder="প্রতিষ্ঠানের নাম" required 
              value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} 
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 outline-none" 
            />
            <input 
              type="text" placeholder="সময়কাল" required 
              value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} 
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 outline-none" 
            />
            <input 
              type="text" placeholder="ফলাফল" required 
              value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} 
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 outline-none" 
            />
            
            <button 
              type="submit" disabled={isUpdating}
              className="md:col-span-2 flex justify-center items-center rounded-lg bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700 transition disabled:opacity-70"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingIndex !== null ? 'আপডেট করুন' : 'সেভ করুন')}
            </button>
          </form>
        </div>
      )}

      {/* লিস্ট ভিউ */}
      <div className="space-y-3">
        {educations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            কোনো শিক্ষাগত তথ্য যোগ করা হয়নি।
          </div>
        ) : (
          educations.map((edu: any, index: number) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 flex justify-between items-start hover:shadow-sm transition">
              <div className="flex gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 flex-none">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-sm font-medium text-slate-600">{edu.institution}</p>
                  <div className="mt-1 flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> {edu.year}</span>
                    <span className="font-semibold text-brand-600">{edu.result}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {/* 💡 ৫. এখানে onClick ফাংশন যুক্ত করা হলো */}
                <button 
                  onClick={() => handleEditClick(index, edu)} 
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
             
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}