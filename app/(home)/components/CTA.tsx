import Link from 'next/link';

export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="grid items-center gap-6 rounded-3xl bg-linear-to-r from-amber-400 to-orange-500 px-6 py-10 text-amber-950 sm:px-10 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">আগে আবেদন করেছেন? অবস্থা দেখুন</h2>
          <p className="mt-1.5 text-sm font-medium">আবেদন আইডি বা মোবাইল নম্বর দিয়ে ট্র্যাক করুন।</p>
        </div>
        <Link href="/track" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          আবেদন ট্র্যাক করুন →
        </Link>
      </div>
    </section>
  );
}