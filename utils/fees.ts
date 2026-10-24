import type { Circular, Settings } from './types';

export interface Pricing {
  govt: number;
  sms: number;
  service: number;
  total: number;
  saved: number;
}

export function serviceFee(n: number, s: Settings): number {
  if (n <= 1) return s.tiers[0];
  if (n === 2) return s.tiers[1];
  return s.tiers[2] + (n - 3) * 20;
}

export function calcFees(
  posts: { n: string; fee?: number }[],
  c: Circular | null,
  s: Settings
): Pricing {
  const govt = posts.reduce(
    (sum, p) => sum + (p.fee ?? c?.posts.find((x) => x.n === p.n)?.fee ?? 112),
    0
  );
  const sms = posts.length * s.smsFee;
  const service = serviceFee(posts.length, s);
  const total = govt + sms + service;
  const baseline = posts.length * s.tiers[0];
  const saved = Math.max(0, baseline - service);
  return { govt, sms, service, total, saved };
}