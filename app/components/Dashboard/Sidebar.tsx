// Sidebar — desktop only (lg+)
// Mobile navigation is handled entirely by BottomNav
// Collapsible to icon-only mode on desktop

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { sidebarLinks } from "../config/sidebarLinks";

export default function Sidebar() {
  // collapsed = icon-only mode, desktop only
  const [collapsed, setCollapsed] = useState(false);

  return (
    // hidden on mobile/tablet — lg breakpoint and above only
    <aside
      className={`
        hidden lg:flex flex-col h-full bg-white border-r border-[#D2DCB6]
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-[68px]" : "w-[220px]"}
      `}
    >
      {/* ── Brand ── */}
      <div className={`flex items-center h-16 px-4 border-b border-[#D2DCB6] flex-shrink-0
        ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <span className="text-xl font-bold text-[#778873] tracking-tight">
            Struct.
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
            transition-all duration-150"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ── User profile ── */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-[#D2DCB6] flex-shrink-0
        ${collapsed ? "justify-center px-2" : ""}`}
      >
        <div className="w-9 h-9 rounded-xl bg-[#D2DCB6] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[#778873]">U</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2d3328] truncate">Username</p>
            <p className="text-xs text-[#a1bc98] truncate">Active</p>
          </div>
        )}
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {sidebarLinks.map((link) => (
          <SidebarItem key={link.href} {...link} collapsed={collapsed} />
        ))}
      </nav>

      {/* ── Version tag ── */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-[#D2DCB6] flex-shrink-0">
          <p className="text-[10px] text-[#D2DCB6] font-medium tracking-widest uppercase">
            V1 · MVP
          </p>
        </div>
      )}
    </aside>
  );
}