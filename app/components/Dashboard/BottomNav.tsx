"use client";

// BottomNav: mobile navigation, fixed at the bottom (hidden at lg+)
// Active tab = dark pill with icon + label, same look as the desktop sidebar

import { usePathname } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import Loader from "@/app/components/Loader";
import { sidebarLinks } from "../config/sidebarLinks";
import { useUser } from "./UserContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { navigate, loading } = useNavigate();
  const { user } = useUser();

  // History is hidden on mobile; it's reached from the Profile page
  const mobileLinks = sidebarLinks.filter((l) => l.showOnMobile !== false);

  // History pages count as part of the Profile tab
  const isActive = (href: string) => {
    const here = pathname.startsWith("/dashboard/history")
      ? "/dashboard/profile"
      : pathname;
    return here === href || here.startsWith(href + "/");
  };

  return (
    <>
      {loading && <Loader variant="page" />}

      <nav
  className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white
    border-t border-[#D2DCB6] flex items-center justify-around px-2 pt-2
    pb-[max(0.5rem,env(safe-area-inset-bottom))]"
>
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          const isProfile = link.href === "/dashboard/profile";

          return (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              aria-label={link.label}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-center gap-2 h-11 rounded-xl
                transition-all duration-200
                ${
                  active
                    ? "bg-[#2d3328] text-[#F1F3E0] px-3 shadow-[3px_3px_0px_0px_#a1bc98]"
                    : "w-11 text-[#a1bc98] hover:bg-[#F1F3E0]"
                }`}
            >
              {isProfile && user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              )}
              {active && (
                <span className="text-xs font-semibold">{link.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}