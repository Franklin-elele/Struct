"use client";

// app/dashboard/page.tsx — Home v2
// Uses: StructureCard v2, TaskSection, StatsCard, StructureLimitBanner

import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import StructureCard from "@/app/components/Dashboard/StructureCard";
import TaskItem from "@/app/components/Dashboard/Task/TaskItem";
import StatsCard from "@/app/components/Dashboard/StatsCard";
import { Info } from "lucide-react";
import {
  mockStructures,
  mockTasks,
  mockStats,
  MAX_STRUCTURES,
} from "@/app/components/config/mockData";
import TaskSection from "@/app/components/Dashboard/Task/TaskSection";
import Loader from "@/app/components/Loader";
import { useState } from "react";

export default function HomePage() {
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const atLimit = mockStructures.length >= MAX_STRUCTURES;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">

        {/* ── Greeting ── */}
        <div>
          <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">
            Good morning 👋
          </h2>
          <p className="text-sm text-[#778873] mt-0.5">
            Here's what you have to execute today.
          </p>
        </div>

        {/* ── Limit banner — only shown when at max ── */}
        {atLimit && <div className="flex items-start gap-3 p-4 rounded-xl
      bg-[#F1F3E0] border border-[#D2DCB6]">
          <Info size={16} className="text-[#778873] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#4f5c49] leading-relaxed">
            <span className="font-semibold text-[#2d3328]">Struct is designed for focus.</span>
            {" "}You can only run 2 structures at a time.
          </p>
        </div>}

        {/* ── Top row: Structures + Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

          {/* Structures */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
              Your Structures
            </p>
            <div className={`grid gap-4 ${mockStructures.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2"
              }`}>
              {mockStructures.map((structure) => (
                <StructureCard
                  key={structure.id}
                  structure={structure}
                  onView={(id) => router.push(`/dashboard/structure/${id}`)}
                />
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
              Statistics
            </p>
            <StatsCard stats={mockStats} structures={mockStructures} />
          </section>

        </div>

        {/* ── Tasks ── */}
        {/* TaskSection manages its own state internally */}
        <TaskSection
          initialTasks={mockTasks}
          onViewAll={() => router.push("/dashboard/tasks")}
        />

      </div>
    </DashboardLayout>
  );
}