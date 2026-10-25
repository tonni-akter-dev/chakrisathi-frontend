'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, LogIn, Menu, X } from 'lucide-react';
import { bn } from '@/utils/helpers';
import { useApp } from '@/utils/AppContext';

const links = [
  { href: '#jobs', label: 'জব বোর্ড' },
  { href: '#how', label: 'কীভাবে কাজ করে' },
  { href: '#pricing', label: 'খরচ' },
  { href: '/track', label: 'ট্র্যাক' },
];

export default function Header() {
  const { state } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600">
            <span className="text-lg font-bold text-white">চ</span>
          </div>
          <div className="text-[17px] font-semibold tracking-tight text-slate-900">
            চাকরি<span className="text-brand-600">সাথী</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-600 transition hover:text-brand-600">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Saved Heart Icon */}
          <button className="relative hidden h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-500 sm:grid">
            <Heart className="h-4 w-4" />
            {state.saved.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {bn(state.saved.length)}
              </span>
            )}
          </button>

          {/* Login Button (New) */}
          <Link href="/login" className="hidden items-center gap-1.5 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 md:inline-flex">
            <LogIn className="h-3.5 w-3.5" />
            লগইন
          </Link>
          {/* Primary CTA */}
          <Link href="/apply" className="hidden rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 md:inline-flex">
            আবেদন করুন
          </Link>

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

          {/* Mobile Login Button */}
          <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              লগইন করুন
            </Link>
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