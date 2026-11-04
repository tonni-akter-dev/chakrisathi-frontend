/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Star, X, Loader2, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateReviewMutation } from '@/app/redux/features/apis/review-apis';

const LABELS = ['', 'খুব খারাপ', 'খারাপ', 'মোটামুটি', 'ভালো', 'অসাধারণ'];

type Props = {
  applicationId: string;      // আবেদনের _id
  title: string;              // পদের নাম (দেখানোর জন্য)
  onClose: () => void;
};

export default function ReviewModal({ applicationId, title, onClose }: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const shown = hover || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10) return toast.error('রিভিউ কমপক্ষে ১০ অক্ষরের লিখুন');
    try {
      await createReview({ applicationId, rating, text: text.trim() }).unwrap();
      toast.success('ধন্যবাদ! আপনার রিভিউ জমা হয়েছে। অনুমোদনের পর ওয়েবসাইটে দেখাবে।');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.msg || 'রিভিউ জমা দেওয়া যায়নি');
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">আপনার অভিজ্ঞতা জানান</h3>
            <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">{title}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* স্টার রেটিং */}
        <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 py-4">
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                className="p-0.5 transition hover:scale-110"
                aria-label={`${i} স্টার`}
              >
                <Star className={`h-8 w-8 ${i <= shown ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <span className="text-sm font-semibold text-slate-700">{LABELS[shown]}</span>
        </div>

        {/* লেখা */}
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">আপনার মতামত *</label>
          <textarea
            rows={4}
            maxLength={500}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="আমাদের সেবা কেমন লেগেছে? কোন বিষয়টি সবচেয়ে উপকারী ছিল?"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <div className="mt-1 text-right text-xs text-slate-400">{text.length}/৫০০</div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isLoading ? 'জমা হচ্ছে...' : 'রিভিউ জমা দিন'}
        </button>
      </form>
    </div>
  );
}
