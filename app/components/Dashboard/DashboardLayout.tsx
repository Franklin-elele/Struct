// DashboardLayout — wraps all dashboard pages
// Desktop: Sidebar (left) + Header + content
// Mobile:  Header (top) + content + BottomNav (fixed bottom)

"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/app/components/Loader";


type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);


  useEffect(() => {   
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data) {
          setIsAuthorized(true);
        } else {
          router.push("/Auth/login");
        }
        setIsChecking(false);
      } catch (error) {
        console.error("Auth check error: ", error);
        router.push("/Auth/login");
      } finally {
        setIsChecking(false);
      }
    }
    checkAuth();
  }, [router, pathname])

  return (
    <div className="flex h-screen bg-[#F1F3E0] overflow-hidden">

      {/* ── Desktop sidebar — hidden on mobile via Sidebar's own className ── */}
      <Sidebar />

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        <Header />

        {/* Page content — extra bottom padding on mobile so content
            doesn't hide behind the fixed BottomNav (h-16 = 64px) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-6">
          {isChecking ? <Loader /> : isAuthorized ? children : null}
        </main>

      </div>

      {/* ── Mobile bottom nav — hidden on desktop via BottomNav's own className ── */}
      <BottomNav />

    </div>
  );
}