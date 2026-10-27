// sidebarLinks.ts — single source of truth for all sidebar navigation
// To add/remove/reorder links, ONLY edit this file. Nothing else changes.

import {
  LayoutDashboard,
  CheckSquare,
  Layers,
  BarChart2,
  History,
  User,
  LucideIcon,
} from "lucide-react";

export type SidebarLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  showOnMobile?: boolean;
};

export const sidebarLinks: SidebarLink[] = [
  { 
    label: "Home",
    href: "/dashboard/home",
    icon: LayoutDashboard
},

  { 
    label: "Structure",
    href: "/dashboard/structure",
    icon: Layers
},

  { 
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare
},

  { 
    label: "Statistics",
    href: "/dashboard/statistics",
    icon: BarChart2
},

{
   label: "History",    
   href: "/dashboard/history",      
   icon: History,
   showOnMobile: false,    
   },

  {
    label: "Profile", 
    href: "/dashboard/profile",
    icon: User
},
];