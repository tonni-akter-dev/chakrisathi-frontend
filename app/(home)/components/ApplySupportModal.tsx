/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
// 💡 আপনার তৈরি করা Application API হুক ইমপোর্ট করুন
// import { useAddApplicationMutation } from '@/app/redux/features/apis/application-api';

interface Props {
  // 💡 id এর বদলে পুরো circular অবজেক্ট নিন
  circular: any | null; 
  onClose: () => void;
}

export default function ApplySupportModal({ circular, onClose }: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // ফর্ম ডাটা ধরার জন্য স্টেট
  const [formData, setFormData] = useState({
    selectedPost: '',
    name: '',
    phone: '',
    age: '',
    education: '',
    district: ''
  });

  useEffect(() => {
    if (circular) {
      setIsSubmitted(false);
      setFormData({ selectedPost: '', name: '', phone: '', age: '', education: '', district: '' });
    }
  }, [circular]);

  if (!circular) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        circularId: circular._id || circular.id,
        circularOrg: circular.org,
        posts: [formData.selectedPost || 'any'],
        name: formData.name,
        phone: formData.phone,
        age: Number(formData.age),
        education: formData.education,
        address: formData.district, 
        amount: 112, 
        status: 'pending',
      };
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast.success('অনুরোধ সফলভাবে পাঠানো হয়েছে!');
    } catch (error) {
      console.error(error);
      toast.error('অনুরোধ পাঠাতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">আবেদনে সাহায্য নিন</h2>
              <p className="mt-1 text-sm text-slate-500">
                {circular.title || circular.org} — আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="support-form" onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">কোন পদে আবেদন করতে চাও?</label>
                  <select 
                    name="selectedPost"
                    required 
                    value={formData.selectedPost}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="">পদ বাছাই করুন</option>
                    {circular.posts?.map((p: any, index: number) => (
                      <option key={index} value={p.n}>
                        {p.n} ({p.v} টি পদ)
                      </option>
                    ))}
                    <option value="any">এখনো ঠিক করিনি — পরামর্শ চাই</option>
                  </select>
                </div>

                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">পূর্ণ নাম</label>
                  <input 
                    type="text" 
                    name="name"
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="যেমন: রাকিব হাসান" 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" 
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">মোবাইল নম্বর</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required 
                    pattern="01[3-9][0-9]{8}" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX" 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" 
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">বয়স</label>
                  <input 
                    type="number" 
                    name="age"
                    required 
                    min="15" 
                    max="40" 
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="১৫–৩২" 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" 
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">শিক্ষাগত যোগ্যতা</label>
                  <select 
                    name="education"
                    required 
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="" disabled>বেছে নিন</option>
                    <option value="1">অষ্টম শ্রেণি</option>
                    <option value="2">এসএসসি</option>
                    <option value="3">এইচএসসি</option>
                    <option value="4">ডিপ্লোমা</option>
                    <option value="5">স্নাতক / তার বেশি</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">স্থায়ী জেলা</label>
                  <input 
                    type="text" 
                    name="district"
                    required 
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="যেমন: ময়মনসিংহ" 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" 
                  />
                </div>

              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                form="support-form" 
                disabled={isLoading}
                className="flex-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'অপেক্ষা করুন...' : 'অনুরোধ পাঠান'}
              </button>
            </div>
          </>
        ) : (
          /* Success View */
          <div className="p-8 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">অনুরোধ পাঠানো হয়েছে!</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
              শীঘ্রই আমাদের টিম তোমাকে কল করবে। ছবি, স্বাক্ষর ও সনদের তথ্য হাতের কাছে রেখো।
            </p>
            <button 
              onClick={onClose} 
              className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              ঠিক আছে
            </button>
          </div>
        )}
      </div>
    </div>
  );
}