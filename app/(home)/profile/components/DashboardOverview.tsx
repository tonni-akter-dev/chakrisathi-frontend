'use client';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, Briefcase, Heart, Building, ArrowRight, 
  User, FileText, Eye, Star, Download 
} from 'lucide-react';

const stats = [
  { title: 'Total Applied Jobs', value: '3', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'Shortlisted Applications', value: '0', icon: CheckCircle2, color: 'text-pink-600', bg: 'bg-pink-100' },
  { title: 'Wishlisted Jobs', value: '2', icon: Heart, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  { title: 'Followed Companies', value: '0', icon: Building, color: 'text-emerald-500', bg: 'bg-emerald-100' },
];

export default function DashboardOverview() {
  const router = useRouter();

  const quickActions = [
    { title: 'Edit Profile', icon: FileText, bg: 'bg-blue-100', color: 'text-blue-600', path: '/profile/my-profile' },
    { title: 'View Applications', icon: Eye, bg: 'bg-emerald-100', color: 'text-emerald-600', path: '/profile/applied-jobs' },
    { title: 'My Wishlist', icon: Star, bg: 'bg-amber-100', color: 'text-amber-500', path: '/profile/wishlist' },
    { title: 'Download CV', icon: Download, bg: 'bg-purple-100', color: 'text-purple-600', path: '/profile/resume' },
  ];

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300 my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-brand-200">
            <div className="flex justify-between items-start mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              {/* 💡 hover:text-brand-500 */}
              <ArrowRight className="h-5 w-5 text-slate-300 opacity-0 transition group-hover:opacity-100 group-hover:text-brand-500 cursor-pointer" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.title}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-100">
              {/* 💡 bg-brand-500 */}
              <div className="h-full bg-brand-500 w-0 transition-all duration-500 group-hover:w-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* প্রোফাইল কমপ্লিশন */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Profile Completion</h3>
            {/* 💡 text-brand-600 */}
            <User className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-500">Progress</span>
              <span className="text-brand-600 font-bold">40%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              {/* 💡 bg-brand-500 */}
              <div className="h-full bg-brand-500 rounded-full w-[40%]" />
            </div>
            <button 
              onClick={() => router.push('/profile/my-profile')} 
              className="mt-4 flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              Complete Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* কুইক অ্যাকশনস */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <button 
                key={i} 
                onClick={() => router.push(action.path)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition hover:scale-[1.02] ${action.bg}`}
              >
                <action.icon className={`h-6 w-6 ${action.color}`} />
                <span className="text-xs font-bold text-slate-700 text-center">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}