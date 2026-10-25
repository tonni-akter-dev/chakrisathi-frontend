import { FileText, Upload, Wallet, FileSearch, Trophy } from 'lucide-react';

const steps = [
  { 
    icon: FileText, 
    color: 'text-orange-500', 
    bg: 'bg-orange-50',
    t: 'পদ বাছাই', 
    d: 'সার্কুলারে "আবেদন করুন" চেপে এক বা একাধিক পদ বেছে নিন।' 
  },
  { 
    icon: Upload, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50',
    t: 'কাগজ আপলোড', 
    d: 'ছবি, স্বাক্ষর, NID ও সনদের ছবি বা PDF পাঠান।' 
  },
  { 
    icon: Wallet, 
    color: 'text-rose-500', 
    bg: 'bg-rose-50',
    t: 'ফি পরিশোধ', 
    d: 'বিকাশ/নগদ/রকেটে টাকা পাঠিয়ে নম্বর ও TrxID দিন।' 
  },
  { 
    icon: FileSearch, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    t: 'আপনার রিভিউ', 
    d: 'আমরা ফর্ম পূরণ করে দেখাবো — "ঠিক আছে" বললেই জমা।' 
  },
  { 
    icon: Trophy, 
    color: 'text-amber-500', 
    bg: 'bg-amber-50',
    t: 'সম্পন্ন', 
    d: "Applicant's Copy ও টেলিটক User ID পেয়ে যাবেন।" 
  },
];

const bnNumbers = ['০১', '০২', '০৩', '০৪', '০৫'];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" id="how">
      {/* Main Purple Container */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#6246EA] px-6 py-16 sm:px-12 lg:px-16">
        
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 mx-auto mb-14 max-w-2xl text-center">
          <div className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur-sm">
            মাত্র ৫ ধাপ
          </div>
          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            আমাদের মাধ্যমে যেভাবে আবেদন হয়
          </h2>
          <p className="mt-3 text-[15px] text-purple-100/90 font-medium">
            কম্পিউটার বা দোকানে যাওয়ার দরকার নেই। মোবাইল দিয়েই সব।
          </p>
        </div>

        {/* Cards Grid */}
        <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {steps.map((s, i) => (
            <div 
              key={s.t} 
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:shadow-black/10"
            >
              {/* Background Watermark Number */}
              <div className="absolute -right-2 -top-2 text-6xl font-extrabold text-white/[0.04] select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                {bnNumbers[i]}
              </div>

              {/* Icon Box */}
              <div className={`relative mb-6 grid h-12 w-12 place-items-center rounded-[14px] bg-white shadow-sm ${s.color}`}>
                <s.icon className="h-6 w-6" strokeWidth={2} />
              </div>

              {/* Text Content */}
              <h3 className="relative text-[16px] font-bold text-white mb-2">
                {s.t}
              </h3>
              <p className="relative text-[13.5px] leading-relaxed text-purple-100/80">
                {s.d}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}