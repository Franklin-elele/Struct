"use client";

// SidebarItem — single sidebar nav link
// Highlights as active when current route matches href

import { usePathname } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import Loader from "@/app/components/Loader";
import { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  label: string;
  href: string;
  icon: LucideIcon;
  collapsed: boolean;
};

export default function SidebarItem({
  label,
  href,
  icon: Icon,
  collapsed,
}: SidebarItemProps) {
  const pathname = usePathname();
  const { navigate, loading } = useNavigate();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Loader shown during navigation */}
      {loading && <Loader variant="page" />}

      <button
        onClick={() => navigate(href)}
        title={collapsed ? label : undefined}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
          text-sm font-medium transition-all duration-150 group
          ${isActive
            ? "bg-[#2d3328] text-[#F1F3E0] shadow-[3px_3px_0px_0px_#a1bc98]"
            : "text-[#778873] hover:bg-[#D2DCB6] hover:text-[#2d3328]"
          }
        `}
      >
        <Icon
          size={18}
          className={`flex-shrink-0 transition-colors duration-150 ${
            isActive
              ? "text-[#A1BC98]"
              : "text-[#778873] group-hover:text-[#2d3328]"
          }`}
        />
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
    </>
  );
}