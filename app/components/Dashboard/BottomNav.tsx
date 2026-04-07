"use client";

// BottomNav — mobile navigation bar, fixed at bottom of screen
// Visible only on mobile/tablet (hidden at lg+)
// Reads from the same sidebarLinks config as desktop sidebar

import { usePathname } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import Loader from "@/app/components/Loader";
import { sidebarLinks } from "../config/sidebarLinks";

export default function BottomNav() {
  const pathname = usePathname();
  const { navigate, loading } = useNavigate();

  return (
    <>
      {/* Loader shown during navigation — unmounts when new page renders */}
      {loading && <Loader variant="page" />}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30
        bg-white border-t border-[#D2DCB6]
        flex items-center justify-around
        h-16 px-2 safe-area-inset-bottom"
      >
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              className={`flex flex-col items-center justify-center gap-1
                flex-1 h-full rounded-xl transition-all duration-150
                ${isActive ? "text-[#2d3328]" : "text-[#a1bc98]"}`}
              aria-label={link.label}
            >
              <div className="relative">
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2
                    w-1 h-1 rounded-full bg-[#778873]" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>

              <span className={`text-[10px] font-medium tracking-wide
                ${isActive ? "text-[#2d3328]" : "text-[#a1bc98]"}`}
              >
                {link.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}