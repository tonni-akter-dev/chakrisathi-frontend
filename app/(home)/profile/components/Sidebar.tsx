'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, User, Heart, Briefcase, 
  Receipt, Lock, LogOut
} from 'lucide-react';
import Cookies from 'js-cookie';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/profile/dashboard', icon: LayoutDashboard },
  { id: 'my-profile', label: 'My profile', href: '/profile/my-profile', icon: User },
  { id: 'applied-jobs', label: 'Applied jobs', href: '/profile/applied-jobs', icon: Briefcase, hasArrow: true },
  { id: 'wishlist', label: 'My wishlist', href: '/profile/wishlist', icon: Heart, hasArrow: true },
  { id: 'billing', label: 'Transaction & billing', href: '/profile/billing', icon: Receipt },
  { id: 'change-password', label: 'Change password', href: '/profile/change-password', icon: Lock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className="w-full md:w-64 shrink-0 bg-brand-50/30 border-r border-slate-200 min-h-screen py-6">
      <nav className="space-y-1 px-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-brand-100/50 hover:text-brand-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </div>
            
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-brand-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}