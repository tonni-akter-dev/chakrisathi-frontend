'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Megaphone, Settings, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
  { href: '/dashboard/applications', icon: FileText, label: 'আবেদনসমূহ', badge: '১২' },
  { href: '/dashboard/circulars', icon: Megaphone, label: 'সার্কুলার' },
  { href: '/dashboard/settings', icon: Settings, label: 'সেটিংস' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">চাকরি সাথী</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Admin Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.label}
              </div>
              {item.badge && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-100 p-4 space-y-1">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <ExternalLink className="h-4 w-4 text-slate-400" />
          ওয়েবসাইট দেখুন
        </a>
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
          <LogOut className="h-4 w-4" />
          লগআউট
        </button>
      </div>
    </aside>
  );
}