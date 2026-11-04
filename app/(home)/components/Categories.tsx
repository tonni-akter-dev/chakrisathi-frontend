'use client';
import { Building2, FlaskConical, Landmark, Layers, Receipt } from 'lucide-react';
import { CATS } from '@/utils/data';
import { bn } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';
import { useGetAllCircularsQuery } from '@/app/redux/features/apis/circular-api';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  building: Building2,
  receipt: Receipt,
  flask: FlaskConical,
  landmark: Landmark,
};

export default function Categories() {
  const { state, update } = useApp();

  // 💡 API থেকে সব সার্কুলার (ফিল্টার ছাড়া) — প্রতিটি ক্যাটাগরির মোট সংখ্যা গোনার জন্য
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: circulars = [], isLoading } = useGetAllCircularsQuery({}) as { data?: any[]; isLoading: boolean };

  // 💡 ক্লিক করলে: ক্যাটাগরি সেট + নিচের সার্কুলার লিস্টে স্ক্রল
  const setCat = (k: typeof CATS[number]['k']) => {
    update({ cat: k });
    const el = document.getElementById('jobs');
    if (el) {
      const headerOffset = 80; // উপরের sticky হেডারের উচ্চতা, দরকার হলে বদলান
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="container-site py-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CATS.map((c) => {
          const Icon = iconMap[c.ic] ?? Layers;
          const count =
            c.k === 'all'
              ? circulars.length
              : circulars.filter((x) => x.cat === c.k).length;
          const active = state.cat === c.k;

          return (
            <button
              key={c.k}
              onClick={() => setCat(c.k)}
              className={`group flex flex-col items-start gap-3 rounded-2xl border bg-white p-5 text-left transition ${
                active
                  ? 'border-brand-600 ring-1 ring-brand-600/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div
                className={`grid h-10 w-10 place-items-center rounded-lg transition ${
                  active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-semibold text-slate-900">{c.n}</div>
                <div className="mt-0.5 text-base text-slate-500">
                  {isLoading
                    ? 'লোড হচ্ছে...'
                    : count
                      ? `${bn(count)}টি সার্কুলার`
                      : 'শীঘ্রই'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}