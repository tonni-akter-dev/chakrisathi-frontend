import Image from 'next/image';

const items = [
  {
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'সাদিয়া আক্তার',
    role: 'অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক',
    text: 'গ্রামে কম্পিউটার নেই। মোবাইলে ছবি তুলে পাঠিয়েছি, ওরাই সব পূরণ করে আমাকে দেখিয়ে জমা দিয়েছে।',
  },
  {
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'রাকিব হাসান',
    role: 'কম্পিউটার অপারেটর',
    text: 'তিনটা পদে একসাথে আবেদন করে সার্ভিস চার্জে ৫০ টাকা বেঁচেছে। জমার আগে রিভিউ দেখতে পাওয়াটা দারুণ।',
  },
  {
    img: 'https://randomuser.me/api/portraits/men/75.jpg',
    name: 'মেহেদী রহমান',
    role: 'অফিস সহায়ক',
    text: "আবেদন আইডি দিয়ে যেকোনো সময় অবস্থা দেখা যায়। শেষে Applicant's Copy পেয়েছি।",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="stories">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <div className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">সাফল্যের গল্প</div>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">যারা আমাদের সাথে স্বপ্ন ছুঁয়েছে</h2>
        <p className="mt-2 text-sm text-slate-600">(ডেমো রিভিউ — আসল রিভিউ পেলে বদলে দেওয়া হবে)</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-amber-400">★★★★★</div>
            <p className="mb-5 text-sm text-slate-700">{t.text}</p>
            <div className="flex items-center gap-3">
              <Image src={t.img} alt={t.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-100" />
              <div>
                <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                <div className="text-xs font-medium text-emerald-600">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}