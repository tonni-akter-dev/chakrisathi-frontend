export type Category = 'all' | 'dc' | 'tax' | 'research' | 'bank';
export type Scope = 'national' | 'district';
export type Fit = 'ok' | 'no' | 'unk' | null;

export interface Post {
  n: string;
  v?: number;
  g?: number;
  sal?: string;
  edu?: 1 | 2 | 3 | 4 | 5;
  fee?: number;
  q?: string;
}

export interface AgeLimit {
  min: number | null;
  max: number;
  note: string;
}

export interface Circular {
  _id?: string; // 💡 এখানে '?' যুক্ত করা হয়েছে
  id: string;
  ab: string;
  color: string;
  cat: Exclude<Category, 'all'>;
  scope: Scope;
  org: string;
  orgEn: string;
  loc: string;
  start: string;
  end: string;
  link: string;
  sms: string | null;
  age: AgeLimit | null;
  district: string;
  total?: number;
  cats?: number;
  note?: string;
  posts: Post[];
}

export interface CatItem {
  k: Category;
  n: string;
  ic: string;
  bg: string;
}

export interface User {
  age: number;
  edu: number;
}

export interface AppState {
  cat: Category;
  q: string;
  view: 'circ' | 'post';
  sort: 'dl' | 'posts' | 'new';
  user: User | null;
  saved: string[];
}

export interface PostRow {
  c: Circular;
  p: Post;
  fit: Fit;
}

export interface Settings {
  smsFee: number;
  tiers: number[];
  helpline: string;
}