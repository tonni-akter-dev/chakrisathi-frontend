/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  LogIn,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { bn } from "@/utils/helpers";
import { useApp } from "@/utils/AppContext";

const links = [
  { href: "/jobs", label: "জব বোর্ড" },
  { href: "#how", label: "কীভাবে কাজ করে" },
  { href: "#pricing", label: "খরচ" },
  { href: "/track", label: "ট্র্যাক" },
];

export default function Header() {
  const { state } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("user");
    const token = Cookies.get("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
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

  // লগআউট হ্যান্ডলার
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("সফলভাবে লগআউট হয়েছে!");
    router.push("/login");
  };

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md h-16" />
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="text-[17px] font-semibold tracking-tight text-slate-900">
            সোনার <span className="text-brand-600">হরিণ</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Saved Heart Icon */}
          <Link
            href="/profile/wishlist"
            className="relative hidden h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-500 sm:grid"
          >
            <Heart className="h-4 w-4" />
            {state.saved.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {bn(state.saved.length)}
              </span>
            )}
          </Link>

          {/* Primary CTA */}
          <Link
            href="/apply"
            className="hidden rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 md:inline-flex"
          >
            আবেদন করুন
          </Link>

          {user ? (
            <div className="relative hidden  md:block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center cursor-pointer gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                {/* অ্যাভাটার */}
                <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-brand-700">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className="max-w-25 truncate">
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white py-2 shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-slate-100 px-4 pb-2 mb-2">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    ড্যাশবোর্ড
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    আমার প্রোফাইল
                  </Link>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      লগআউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 md:inline-flex"
            >
              <LogIn className="h-3.5 w-3.5" />
              লগইন
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
            {/* 💡 Mobile: লগইন বাটন অথবা ইউজার ইনফো + লগআউট */}
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-700 font-bold text-lg">
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  ড্যাশবোর্ড
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100"
                >
                  <LogOut className="h-4 w-4" />
                  লগআউট
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                লগইন করুন
              </Link>
            )}

            <Link
              href="/apply"
              className="flex w-full items-center justify-center rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              onClick={() => setOpen(false)}
            >
              আবেদন করুন
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
