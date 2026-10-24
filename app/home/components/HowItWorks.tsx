import { FileText, Upload, Wallet, CheckCircle, Trophy } from 'lucide-react';

const steps = [
  { icon: FileText, t: 'পদ বাছাই', d: 'সার্কুলারে "আবেদন করুন" চেপে এক বা একাধিক পদ বেছে নিন।' },
  { icon: Upload, t: 'কাগজ আপলোড', d: 'ছবি, স্বাক্ষর, NID ও সনদের ছবি বা PDF পাঠান।' },
  { icon: Wallet, t: 'ফি পরিশোধ', d: 'বিকাশ/নগদ/রকেটে টাকা পাঠিয়ে নম্বর ও TrxID দিন।' },
  { icon: CheckCircle, t: 'আপনার রিভিউ', d: 'আমরা ফর্ম পূরণ করে দেখাবো — "ঠিক আছে" বললেই জমা।' },
  { icon: Trophy, t: 'সম্পন্ন', d: "Applicant's Copy ও টেলিটক User ID পেয়ে যাবেন।" },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="how">
      <div className="rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-12 text-white sm:px-10">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <div className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">মাত্র ৫ ধাপ</div>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">আমাদের মাধ্যমে যেভাবে আবেদন হয়</h2>
          <p className="mt-2 text-sm text-white/80">কম্পিউটার বা দোকানে যাওয়ার দরকার নেই। মোবাইল দিয়েই সব।</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-700">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-[11px] font-semibold uppercase opacity-60">ধাপ {String(i + 1).padStart(2, '0')}</div>
              <h3 className="mt-1 text-base font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-white/80">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}