/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { CIRCULARS } from '@/utils/data';
import { useApp } from '@/utils/AppContext';

interface Props {
  id : string | null;
  onClose: () => void;
}

export default function ApplySupportModal({ id , onClose }: Props) {
  const { showToast } = useApp();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (id ) {
      setIsSubmitted(false);
      setIsLoading(false);
    }
  }, [id ]);

  if (!id ) return null;

  const circular = CIRCULARS.find((c) => c.id === id );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('অনুরোধ সফলভাবে পাঠানো হয়েছে!');
    }, 1200);
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
                {circular?.org || 'সার্কুলার'} — আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="support-form" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Select Post */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">কোন পদে আবেদন করতে চাও?</label>
                  <select required className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
                    <option value="">এখনো ঠিক করিনি — পরামর্শ চাই</option>
                    {CIRCULARS.map((c) => (
                      <optgroup key={c.id} label={c.org}>
                        {c.posts.length > 0 ? (
                          c.posts.map((p) => (
                            <option key={p.n} value={p.n}>
                              {p.n} — {c.orgEn}
                            </option>
                          ))
                        ) : (
                          <option value="any">যেকোনো পদ — {c.orgEn}</option>
                        )}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">পূর্ণ নাম</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="যেমন: রাকিব হাসান" 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" 
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">মোবাইল নম্বর</label>
                  <input 
                    type="tel" 
                    required 
                    pattern="01[3-9][0-9]{8}" 
                    placeholder="01XXXXXXXXX" 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" 
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">বয়স</label>
                  <input 
                    type="number" 
                    required 
                    min="15" 
                    max="40" 
                    placeholder="১৫–৩২" 
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" 
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">শিক্ষাগত যোগ্যতা</label>
                  <select required defaultValue="" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
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
                    required 
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
                className="flex-[2] rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? 'অপেক্ষা করুন...' : 'অনুরোধ পাঠান'}
              </button>
            </div>
          </>
        ) : (
          /* Success View */
          <div className="p-8 text-center flex flex-col items-center justify-center">
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