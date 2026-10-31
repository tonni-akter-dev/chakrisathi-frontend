/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { MapPin, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function WishlistTab() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (circularId: string, postName: string) => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/wishlist?circularId=${circularId}&postName=${postName}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        // লোকাল স্টেট থেকে রিমুভ করা
        setWishlist(wishlist.filter(item => !(item.circularId._id === circularId && item.postName === postName)));
        toast.success('উইশলিস্ট থেকে সরানো হয়েছে');
      }
    } catch (error) {
      toast.error('সমস্যা হয়েছে!');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300 my-10">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <Heart className="h-6 w-6 text-rose-500 fill-rose-500" /> My Wishlist
      </h2>
      
      {wishlist.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          আপনার উইশলিস্টে কোনো জব নেই।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlist.map((item, index) => {
            // item.circularId এ populate করা সার্কুলারের ডাটা আছে
            const job = item.circularId; 
            return (
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition">
                {/* পদের নাম */}
                <h3 className="text-lg font-bold text-slate-900">{item.postName}</h3>
                {/* প্রতিষ্ঠানের নাম */}
                <p className="text-sm font-medium text-brand-600">{job?.org || 'N/A'}</p>
                
                <div className="flex gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {job?.loc || 'N/A'}</span>
                  <span className="flex items-center gap-1">
                    শেষ: {job?.end ? new Date(job.end).toLocaleDateString('bn-BD') : 'N/A'}
                  </span>
                </div>
                
                <div className="mt-5 flex gap-2">
                  <Link 
                    href={`/apply/${job?._id || job?.id}`} 
                    className="flex-1 text-center rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
                  >
                    Apply Now
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(job?._id, item.postName)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-600 hover:bg-rose-100 transition"
                  >
                    <Heart className="h-5 w-5 fill-rose-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}