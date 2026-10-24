import type { Circular, CatItem, Settings } from './types';

export const SETTINGS: Settings = {
  smsFee: 15,
  tiers: [100, 150, 200], // [1 post, 2 posts, 3+ posts]
  helpline: '01700000000',
};

export const CIRCULARS: Circular[] = [
  {
    id: 'wtmu', ab: 'WTMU', color: '#6366f1', cat: 'tax', scope: 'national',
    org: 'উৎসে কর ব্যবস্থাপনা ইউনিট', orgEn: 'Withholding Tax Management Unit',
    loc: 'কাকরাইল, ঢাকা',
    start: '2026-10-15T10:00', end: '2026-11-04T17:00',
    link: 'https://wtmu.teletalk.com.bd/wtmu_2026/',
    sms: 'WTMU',
    age: { min: null, max: 32, note: 'সর্বোচ্চ ৩২ বছর' },
    district: 'সকল জেলা',
    posts: [
      { n: 'কম্পিউটার অপারেটর', v: 1, g: 13, sal: '২৪,০০০–৫৮,০০০', edu: 5, fee: 112, q: 'বিজ্ঞান বিভাগে স্নাতক' },
      { n: 'ব্যক্তিগত সহকারী', v: 4, g: 13, sal: '২৪,০০০–৫৮,০০০', edu: 5, fee: 112, q: 'স্নাতক; টাইপিং দক্ষতা' },
      { n: 'অফিস সহকারী কাম-কম্পিউটার মুদ্রাক্ষরিক', v: 5, g: 16, sal: '২১,৯০০–৫২,৯০০', edu: 3, fee: 112, q: 'এইচএসসি' },
      { n: 'অফিস সহায়ক', v: 3, g: 20, sal: '২০,০০০–৪৮,৪০০', edu: 2, fee: 56, q: 'এসএসসি' },
    ],
  },
  {
    id: 'hbri', ab: 'HBRI', color: '#ec4899', cat: 'research', scope: 'national',
    org: 'হাউজিং অ্যান্ড বিল্ডিং রিসার্চ ইনস্টিটিউট',
    orgEn: 'Housing & Building Research Institute', loc: 'মিরপুর, ঢাকা',
    start: '2026-10-14T09:00', end: '2026-11-15T17:00',
    link: 'http://hbri.teletalk.com.bd/', sms: 'HBRI',
    age: { min: 18, max: 32, note: '১৮–৩২ বছর' },
    district: 'সকল জেলা',
    posts: [
      { n: 'উপ-সহকারী প্রকৌশলী', v: 1, g: 10, sal: '৩২,০০০–৭৭,৩০০', edu: 4, fee: 223 },
      { n: 'কম্পিউটার মুদ্রাক্ষরিক', v: 1, g: 16, sal: '২১,৯০০–৫২,৯০০', edu: 3, fee: 168 },
      { n: 'ড্রাইভার', v: 1, g: 16, sal: '২১,৯০০–৫২,৯০০', edu: 1, fee: 112 },
      { n: 'অফিস সহায়ক', v: 7, g: 20, sal: '২০,০০০–৪৮,৪০০', edu: 2, fee: 56 },
    ],
  },
  {
    id: 'tz3ctg', ab: 'TZ-3', color: '#10b981', cat: 'tax', scope: 'national',
    org: 'কর অঞ্চল-৩, চট্টগ্রাম', orgEn: 'Taxes Zone-3, Chattogram', loc: 'চট্টগ্রাম',
    start: '2026-10-14T10:00', end: '2026-11-05T17:00',
    link: 'https://tz3ctg.teletalk.com.bd/', sms: 'TZ3CTG',
    age: null, district: 'জেলা কোটা প্রযোজ্য',
    note: 'এটি পুনঃবিজ্ঞপ্তি।',
    posts: [
      { n: 'উচ্চমান সহকারী', v: 5 },
      { n: 'সাঁট মুদ্রাক্ষরিক কাম কম্পিউটার অপারেটর', v: 8 },
      { n: 'অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক', v: 11 },
      { n: 'ড্রাইভার', v: 2 },
      { n: 'অফিস সহায়ক', v: 7 },
    ],
  },
  {
    id: 'dcsherpur', ab: 'DC', color: '#f59e0b', cat: 'dc', scope: 'district',
    org: 'জেলা প্রশাসকের কার্যালয়, শেরপুর', orgEn: 'DC Office Sherpur', loc: 'শেরপুর',
    start: '2026-10-14T00:01', end: '2026-11-04T17:00',
    link: 'http://dcsherpur.teletalk.com.bd/', sms: null, age: null,
    district: 'শেরপুর জেলা', total: 15,
    posts: [
      { n: 'কম্পিউটার অপারেটর' },
      { n: 'অফিস সহকারী কাম-কম্পিউটার মুদ্রাক্ষরিক' },
      { n: 'সার্টিফিকেট সহকারী' },
      { n: 'বেঞ্চ সহকারী' },
      { n: 'লাইব্রেরি সহকারী' },
      { n: 'নিরাপত্তা প্রহরী' },
    ],
  },
  {
    id: 'dcbogura', ab: 'DC', color: '#f97316', cat: 'dc', scope: 'district',
    org: 'জেলা প্রশাসকের কার্যালয়, বগুড়া', orgEn: 'DC Office Bogura', loc: 'বগুড়া',
    start: '2026-10-18T10:00', end: '2026-11-07T16:00',
    link: 'http://dcbogura.teletalk.com.bd/dcbogura6/', sms: null, age: null,
    district: 'বগুড়া জেলা', total: 2, cats: 2, posts: [],
  },
  {
    id: 'dcpatuakhali', ab: 'DC', color: '#8b5cf6', cat: 'dc', scope: 'district',
    org: 'জেলা প্রশাসকের কার্যালয়, পটুয়াখালী', orgEn: 'DC Office Patuakhali', loc: 'পটুয়াখালী',
    start: '2026-10-18T09:00', end: '2026-11-11T16:00',
    link: 'https://dcpatuakhali.teletalk.com.bd/', sms: null, age: null,
    district: 'পটুয়াখালী জেলা', total: 9, cats: 2, posts: [],
  },
];

export const CATS: CatItem[] = [
  { k: 'all', n: 'সব সার্কুলার', ic: 'layers', bg: 'bg-slate-100' },
  { k: 'dc', n: 'জেলা প্রশাসন', ic: 'building', bg: 'bg-amber-50' },
  { k: 'tax', n: 'রাজস্ব ও কর', ic: 'receipt', bg: 'bg-emerald-50' },
  { k: 'research', n: 'গবেষণা', ic: 'flask', bg: 'bg-pink-50' },
  { k: 'bank', n: 'ব্যাংক', ic: 'landmark', bg: 'bg-indigo-50' },
];

export const EDU = ['', 'অষ্টম শ্রেণি', 'এসএসসি', 'এইচএসসি', 'ডিপ্লোমা', 'স্নাতক'] as const;