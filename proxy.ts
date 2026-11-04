import { NextResponse, type NextRequest } from "next/server";

/**
 * অ্যাডমিন রুট গার্ড — /dashboard এবং এর ভেতরের সব রুট
 * (যেমন /dashboard/all-users, /dashboard/circulars/add, /dashboard/settings)
 *
 * কীভাবে কাজ করে:
 * ১. কুকিতে token না থাকলে → /login
 * ২. token থাকলে ব্যাকএন্ডের /api/v1/auth/me থেকে আসল role যাচাই করা হয়
 *    (কুকি বা localStorage-এর role বিশ্বাস করা হয় না, কারণ ব্রাউজারে সেটা বদলানো যায়)
 * ৩. token অবৈধ/মেয়াদোত্তীর্ণ (401/403) → token মুছে /login
 * ৪. role "admin" না হলে → হোমপেজ (/)
 * ৫. ব্যাকএন্ড বন্ধ বা কোনো ভুল হলে → ঢুকতে দেওয়া হয় না (fail closed)
 *
 * মনে রাখবেন: এটা শুধু পেজ লুকানোর গার্ড। আসল নিরাপত্তা ব্যাকএন্ডের
 * প্রতিটি admin route-এ থাকা `protect` ও `admin` middleware।
 */

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/+$/, "");
const TOKEN_COOKIE = "token";
const VERIFY_TIMEOUT_MS = 8000;

function redirectTo(request: NextRequest, path: string, clearToken = false) {
  const response = NextResponse.redirect(new URL(path, request.url));
  if (clearToken) response.cookies.delete(TOKEN_COOKIE);
  return response;
}

// /auth/me এর রেসপন্স যে আকারেই আসুক, role বের করা
function extractRole(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const b = body as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  return b.role ?? b.user?.role ?? b.data?.role ?? b.data?.user?.role;
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // ১. লগইন করা নেই
  if (!token) return redirectTo(request, "/login");

  // env না থাকলে যাচাই করা সম্ভব না — নিরাপত্তার জন্য ঢুকতে দেব না
  if (!API_BASE) {
    console.error("[proxy] NEXT_PUBLIC_SERVER_URL সেট করা নেই — admin যাচাই সম্ভব নয়");
    return redirectTo(request, "/");
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });

    // ৩. token অবৈধ বা মেয়াদোত্তীর্ণ
    if (res.status === 401 || res.status === 403) {
      return redirectTo(request, "/login", true);
    }
    if (!res.ok) return redirectTo(request, "/");

    // ৪. অ্যাডমিন না
    const role = extractRole(await res.json());
    if (role !== "admin") return redirectTo(request, "/");

    // অ্যাডমিন — ঢুকতে দাও; পেজ যেন কোথাও ক্যাশ না হয়
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (err) {
    // ৫. ব্যাকএন্ডে পৌঁছানো যায়নি / টাইমআউট
    console.error("[proxy] admin যাচাই ব্যর্থ:", err instanceof Error ? err.message : err);
    return redirectTo(request, "/");
  }
}

export const config = {
  // /dashboard নিজে এবং এর ভেতরের সব রুট (/profile/dashboard এর আওতায় পড়ে না)
  matcher: ["/dashboard/:path*"],
};