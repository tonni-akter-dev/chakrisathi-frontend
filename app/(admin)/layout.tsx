import { Suspense } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Suspense
        fallback={
          <div className="hidden lg:block w-64 bg-white border-r border-slate-200"></div>
        }
      >
        <Sidebar />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
