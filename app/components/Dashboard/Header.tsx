// Header — top bar of the main content area
// Contains: mobile menu toggle, page title, notification bell

"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "../config/sidebarLinks";
import { Bell } from "lucide-react";


type HeaderProps = {
  onMobileMenuOpen: () => void;
};

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();

  // notification state — wire to real data later
  // useState here because the bell is purely local UI interaction for now
  const [hasNotification, setHasNotification] = useState(true);

  // derive page title from current route by matching against sidebarLinks
  const currentLink = sidebarLinks.find((l) => pathname.startsWith(l.href));
  const pageTitle = currentLink?.label ?? "Dashboard";

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6
      bg-white border-b border-[#D2DCB6] flex-shrink-0">

      {/* Left — mobile hamburger + page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-[#2d3328] tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right — notification bell */}
      <div className="flex items-center gap-2">
       <button
  onClick={() => setHasNotification(false)}
  className="relative w-9 h-9 flex items-center justify-center rounded-xl
    text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
    transition-all duration-150"
  aria-label="Notifications"
>
  <Bell size={18} />  
  {hasNotification && (
    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#778873] border-2 border-white" />
  )}
</button>
      </div>
    </header>
  );
}