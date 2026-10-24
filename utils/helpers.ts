import type { Circular, Fit, Post, User } from './types';

export const bn = (s: string | number): string =>
  String(s).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

const MONTHS = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'] as const;

export const fmtDate = (iso: string): string => {
  const d = new Date(iso);
  return `${bn(d.getDate())} ${MONTHS[d.getMonth()]}`;
};

export const fmtTime = (iso: string): string => {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const p = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${bn(h)}:${bn(String(m).padStart(2, '0'))} ${p}`;
};

export const totalPosts = (c: Circular): number =>
  c.total ?? c.posts.reduce((s, p) => s + (p.v ?? 0), 0);

export const catCount = (c: Circular): number => c.cats ?? c.posts.length;

export const timeLeft = (c: Circular): number => {
  if (typeof window === 'undefined') return 1; 
  return new Date(c.end).getTime() - Date.now();
};
export function leftText(ms: number): { t: string; cls: 'safe' | 'warn' | 'closed' } {
  if (ms <= 0) return { t: 'শেষ', cls: 'closed' };
  const d = Math.floor(ms / 864e5);
  const h = Math.floor((ms % 864e5) / 36e5);
  if (d >= 1) return { t: `${bn(d)} দিন`, cls: d <= 7 ? 'warn' : 'safe' };
  const m = Math.floor((ms % 36e5) / 6e4);
  return { t: `${bn(h)}ঘ ${bn(m)}মি`, cls: 'warn' };
}

export function progress(c: Circular): number {
  const s = new Date(c.start).getTime();
  const e = new Date(c.end).getTime();
  return Math.max(0, Math.min(100, ((Date.now() - s) / (e - s)) * 100));
}

export function postFit(c: Circular, p: Post, user: User | null): Fit {
  if (!user) return null;
  const ageOk = c.age
    ? (c.age.min === null || user.age >= c.age.min) && user.age <= c.age.max
    : null;
  const eduOk = p.edu ? user.edu >= p.edu : null;
  if (ageOk === false || eduOk === false) return 'no';
  if (ageOk && eduOk) return 'ok';
  return 'unk';
}