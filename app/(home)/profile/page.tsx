/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import DashboardOverview from "./components/DashboardOverview";
import ProfileTab from "./components/ProfileTab";
import AppliedJobsTab from "./components/AppliedJobsTab";
import BillingTab from "./components/BillingTab";
import ChangePasswordTab from "./components/ChangePasswordTab";
import WishlistTab from "./components/WishlistTab";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row">
        <main className="flex-1 p-4 md:p-8 container mx-auto">
          {activeTab === "dashboard" && <DashboardOverview  />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "applied" && <AppliedJobsTab />}
          {activeTab === "wishlist" && <WishlistTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "password" && <ChangePasswordTab />}
        </main>
      </div>
    </div>
  );
}
