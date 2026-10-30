'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, User, Heart, Briefcase, 
  Receipt, Lock, LogOut, Menu, X
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
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* 💡 মোবাইলের জন্য টপ বার */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-30 shadow-sm">
        <span className="font-bold text-lg text-slate-800">My Profile</span>
        <button onClick={() => setIsOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 transition">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* 💡 মোবাইলে মেনু ওপেন হলে ব্যাকগ্রাউন্ড কালো হবে */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 💡 মেইন সাইডবার (ব্যাকগ্রাউন্ড সলিড করা হয়েছে) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 md:relative md:translate-x-0 md:min-h-[calc(100vh-64px)] flex flex-col ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* মোবাইলের জন্য সাইডবারের হেডার */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <span className="font-bold text-brand-600 text-lg">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-4 py-6 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-200">
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
    </>
  );
}