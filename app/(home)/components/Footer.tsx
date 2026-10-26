import Link from 'next/link';
import {  Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-16 pb-6 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600">
                <span className="text-lg font-bold text-white">চ</span>
              </div>
              <div className="text-[17px] font-semibold tracking-tight">সোনার <span className="text-brand-400">হরিণ</span></div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              বাংলাদেশের তরুণদের সরকারি চাকরির বিশ্বস্ত সঙ্গী। সার্কুলার, আবেদন সহায়তা ও প্রস্তুতি — সব এক জায়গায়।
            </p>
            <div className="mt-5 flex gap-2">
              {/* <a href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-brand-600"><Facebook className="h-4 w-4" /></a> */}
              {/* <a href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-brand-600"><Youtube className="h-4 w-4" /></a> */}
              <a href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-brand-600"><Send className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">চাকরি</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#jobs" className="hover:text-white">জেলা প্রশাসন</Link></li>
              <li><Link href="#jobs" className="hover:text-white">রাজস্ব ও কর</Link></li>
              <li><Link href="#jobs" className="hover:text-white">গবেষণা প্রতিষ্ঠান</Link></li>
              <li><Link href="#jobs" className="hover:text-white">ব্যাংক</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">সেবা</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/apply" className="hover:text-white">আবেদন করুন</Link></li>
              <li><Link href="/track" className="hover:text-white">আবেদন ট্র্যাক</Link></li>
              <li><Link href="#pricing" className="hover:text-white">খরচ</Link></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">যোগাযোগ</h4>
            <p className="text-sm">সকাল ৯টা – রাত ৯টা</p>
            <p className="mt-2 text-sm">📞 01700000000</p>
            <p className="mt-1 text-sm">✉️ help@chakrisathi.com</p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 text-xs">
          <span>© ২০২৬ সোনার হরিণ। সর্বস্বত্ব সংরক্ষিত।</span>
          <span>আবেদনের আগে মূল বিজ্ঞপ্তি যাচাই করুন।</span>
        </div>
      </div>
    </footer>
  );
}