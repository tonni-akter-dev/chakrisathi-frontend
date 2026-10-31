/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  RefreshCw,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Cookies from "js-cookie";

export default function Topbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 💡 ১. লগইন করা ইউজারের ডাটা লোড করা (LocalStorage বা Cookies থেকে)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 💡 ২. ড্রপডাউনের বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 💡 ৩. লগআউট লজিক
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile Menu (Left) */}
      <button className="grid h-10 w-10 place-items-center rounded-lg lg:hidden hover:bg-slate-100">
        <Menu className="h-5 w-5 text-slate-600" />
      </button>

      {/* Search */}
      <div className="hidden flex-1 items-center gap-2 sm:flex">
        <label className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-brand-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="আইডি, নাম, মোবাইল বা TrxID…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Refresh Button */}
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
          <RefreshCw className="h-4 w-4" />
        </button>

        {/* Notification Bell */}
        <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* 💡 User Profile Dropdown */}
        {user && (
          <div
            className="relative ml-2 border-l border-slate-200 pl-3"
            ref={dropdownRef}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition"
            >
              {/* Avatar */}
              <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-brand-700 font-bold text-sm uppercase">
                {user.name ? user.name.charAt(0) : <User className="h-4 w-4" />}
              </div>

              {/* Name & Role (Desktop) */}
              <div className="hidden text-left md:block">
                <div className="text-sm font-bold text-slate-900 leading-tight truncate max-w-30">
                  {user.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {user.role === "admin" ? (
                    <>
                      <ShieldCheck className="h-3 w-3 text-emerald-500" /> Admin
                    </>
                  ) : (
                    "User"
                  )}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white py-2 shadow-lg animate-in fade-in slide-in-from-top-2">
                {/* Mobile User Info */}
                <div className="border-b border-slate-100 px-4 pb-3 mb-2 md:hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="px-4 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Role
                  </p>
                  <p className="text-sm font-semibold text-slate-900 capitalize flex items-center gap-1.5">
                    {user.role === "admin" ? (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />{" "}
                        Administrator
                      </>
                    ) : (
                      "General User"
                    )}
                  </p>
                </div>

                <div className="border-t border-slate-100 my-1"></div>

                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <User className="h-4 w-4 text-slate-400" />
                  My Profile
                </button>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <Settings className="h-4 w-4 text-slate-400" />
                  Account Settings
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
