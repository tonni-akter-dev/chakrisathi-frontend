import { MapPin, Heart } from 'lucide-react';

const mockWishlist = [
  { id: '1', title: 'সহকারী প্রকৌশলী', org: 'সড়ক ও জনপথ অধিদপ্তর', loc: 'সকল জেলা', deadline: '২৫ নভেম্বর' },
  { id: '2', title: 'অফিস সহকারী', org: 'বাংলাদেশ ব্যাংক', loc: 'ঢাকা', deadline: '৩০ নভেম্বর' },
];

export default function WishlistTab() {
  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300 my-10">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Heart className="h-6 w-6 text-rose-500" /> My Wishlist
      </h2>
      
      {/* ডাটা না থাকলে এই মেসেজটি দেখাবে */}
      {mockWishlist.length === 0 && (
        <p className="text-slate-500">আপনার উইশলিস্টে কোনো জব নেই।</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockWishlist.map((job) => (
          <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition">
            <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
            <p className="text-sm font-medium text-brand-600">{job.org}</p>
            <div className="flex gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {job.loc}</span>
              <span className="flex items-center gap-1">শেষ: {job.deadline}</span>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">
                Apply Now
              </button>
              <button className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-600 hover:bg-rose-100 transition">
                <Heart className="h-5 w-5 fill-rose-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}