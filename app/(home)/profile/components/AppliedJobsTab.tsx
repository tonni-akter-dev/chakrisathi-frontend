import { MapPin, Clock, ArrowRight } from 'lucide-react';

const mockJobs = [
  { id: '1', title: 'কম্পিউটার অপারেটর', org: 'উৎসে কর ব্যবস্থাপনা ইউনিট', loc: 'ঢাকা', deadline: '১০ নভেম্বর', status: 'processing' },
  { id: '2', title: 'অফিস সহায়ক', org: 'HBRI', loc: 'ঢাকা', deadline: '১৫ নভেম্বর', status: 'completed' },
  { id: '3', title: 'সহকারী শিক্ষক', org: 'প্রাথমিক শিক্ষা অধিদপ্তর', loc: 'সকল জেলা', deadline: '২০ নভেম্বর', status: 'pending' },
];

export default function AppliedJobsTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 my-10">
      <h2 className="text-2xl font-bold text-slate-900">Applied Jobs</h2>
      <div className="space-y-4">
        {mockJobs.map((job) => (
          <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
              {/* 💡 এখানে text-brand-600 করা হয়েছে */}
              <p className="text-sm font-medium text-brand-600">{job.org}</p>
              <div className="flex gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {job.loc}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> শেষ: {job.deadline}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                job.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                job.status === 'processing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {job.status}
              </span>
              {/* 💡 এখানে text-brand-600 করা হয়েছে */}
              <button className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition">
                বিস্তারিত দেখুন <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}