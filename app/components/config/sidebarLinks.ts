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
};

export const sidebarLinks: SidebarLink[] = [
  { 
    label: "Home",
    href: "/dashboard/home",
    icon: LayoutDashboard
},

  { 
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare
},

  { 
    label: "Structure",
    href: "/dashboard/structure",
    icon: Layers
},

  { 
    label: "Statistics",
    href: "/dashboard/statistics",
    icon: BarChart2
},

  {
    label: "Profile", 
    href: "/dashboard/profile",
    icon: User
},

 {
   label: "History",    
   href: "/dashboard/history",      
   icon: History        
   },
];