'use client';
import { Building2, FlaskConical, Landmark, Layers, Receipt } from 'lucide-react';
import { CATS, CIRCULARS } from '@/utils/data';
import { bn } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  building: Building2,
  receipt: Receipt,
  flask: FlaskConical,
  landmark: Landmark,
};

export default function Categories() {
  const { state, update } = useApp();

  const setCat = (k: typeof CATS[number]['k']) => {
    update({ cat: k });
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CATS.map((c) => {
          const Icon = iconMap[c.ic] ?? Layers;
          const count = c.k === 'all'
            ? CIRCULARS.length
            : CIRCULARS.filter((x) => x.cat === c.k).length;
          const active = state.cat === c.k;
          return (
            <button
              key={c.k}
              onClick={() => setCat(c.k)}
              className={`group flex flex-col items-start gap-3 rounded-2xl border bg-white p-4 text-left transition ${
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
                <div className="text-sm font-semibold text-slate-900">{c.n}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {count ? `${bn(count)}টি সার্কুলার` : 'শীঘ্রই'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}