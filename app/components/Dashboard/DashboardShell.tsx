"use client";

// DashboardShell: sidebar + header + bottom nav, mounted once for all dashboard pages.
// Auth comes from UserContext, so there is no second /me call.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import Loader from "@/app/components/Loader";
import { useUser } from "./UserContext";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useUser();

  // Not logged in once loading is done: send to login
  useEffect(() => {
    if (!loading && !user) router.replace("/Auth/login");
  }, [loading, user, router]);

  return (
    <div className="flex h-full bg-[#F1F3E0] overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        {/* Mobile: room for the bottom nav plus the phone's safe area. Desktop: normal padding. */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-6">
          {loading ? <Loader /> : user ? children : null}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}