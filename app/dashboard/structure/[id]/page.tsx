"use client";

// app/dashboard/structure/[id]/page.tsx
// Shows full detail for a single structure
// Includes: structure info, habits list, stats, edit button

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Clock, ArrowLeft, CalendarDays, TrendingUp, Trophy, CheckSquare } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import StructureModal from "@/app/components/Dashboard/Structure/StructureModal";
import { mockStructures, Structure } from "@/app/components/config/structureData";

// ── Single stat cell ──
function StatCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 py-4">
      <div className="w-10 h-10 rounded-xl bg-[#F1F3E0] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-lg font-bold text-[#2d3328] leading-none">{value}</span>
      <span className="text-[10px] text-[#778873] font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function StructureDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // find structure by id from mock data — replace with API call later
  const [structure, setStructure] = useState<Structure | undefined>(
    mockStructures.find((s) => s.id === params.id)
  );

  const [showModal, setShowModal] = useState(false);

  // structure not found
  if (!structure) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-3xl">◈</p>
          <p className="text-sm font-semibold text-[#2d3328]">Structure not found.</p>
          <button
            onClick={() => router.push("/dashboard/structure")}
            className="flex items-center gap-2 text-xs font-semibold text-[#778873]
              hover:text-[#2d3328] transition-colors duration-150"
          >
            <ArrowLeft size={13} /> Back to structures
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const totalHabits = structure.habits.length;
  const completionPercent = totalHabits > 0
    ? Math.round((structure.todayCompleted / totalHabits) * 100)
    : 0;

  const handleSave = (data: Omit<Structure, "id" | "currentStreak" | "todayCompleted">) => {
    setStructure((prev) => prev ? { ...prev, ...data } : prev);
  };

  return (
    <DashboardLayout>

      {showModal && (
        <StructureModal
          initial={structure}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard/structure")}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#778873]
            hover:text-[#2d3328] transition-colors duration-150 self-start"
        >
          <ArrowLeft size={13} /> All structures
        </button>

        {/* ── Structure header card ── */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">

          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
                Structure
              </p>
              <h2 className="text-xl font-bold text-[#2d3328] leading-tight">
                {structure.title}
              </h2>
              {/* 90-day cycle */}
              <p className="text-[11px] text-[#a1bc98] font-medium mt-0.5">Day 1 of 90</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Streak badge */}
              {structure.currentStreak > 0 && (
                <div className="flex items-center gap-1 bg-[#F1F3E0] border border-[#D2DCB6]
                  rounded-full px-2.5 py-1">
                  <Flame size={12} className="text-[#778873]" />
                  <span className="text-xs font-semibold text-[#2d3328]">
                    {structure.currentStreak}d
                  </span>
                </div>
              )}

              {/* Edit button */}
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-1.5 rounded-xl border-2 border-[#D2DCB6] text-xs
                  font-semibold text-[#778873] hover:border-[#A1BC98] hover:text-[#2d3328]
                  hover:bg-[#F1F3E0] transition-all duration-150"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Today's execution bar */}
          <div className="flex items-center justify-between px-3 py-2.5
            bg-[#F1F3E0] rounded-xl border border-[#D2DCB6]">
            <span className="text-xs text-[#778873] font-medium">Today's execution</span>
            <span className={`text-sm font-bold ${
              structure.todayCompleted === totalHabits ? "text-[#A1BC98]" : "text-[#2d3328]"
            }`}>
              {structure.todayCompleted}/{totalHabits} done
            </span>
          </div>
        </div>

        {/* ── Stats card ── */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-3">

          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
            Performance
          </p>

          <div className="flex items-start divide-x divide-[#F1F3E0]">
            <StatCell
              icon={<Flame size={16} className="text-[#778873]" />}
              value={`${structure.currentStreak}d`}
              label="Current streak"
            />
            <StatCell
              icon={<Trophy size={16} className="text-[#778873]" />}
              value="14d"
              label="Best streak"
            />
            <StatCell
              icon={<TrendingUp size={16} className="text-[#A1BC98]" />}
              value={`${completionPercent}%`}
              label="Completion"
            />
            <StatCell
              icon={<CalendarDays size={16} className="text-[#778873]" />}
              value="89d"
              label="Days left"
            />
          </div>
        </div>

        {/* ── Habits card ── */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">

          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
            Habits
          </p>

          <ul className="flex flex-col gap-2">
            {structure.habits.map((habit) => (
              <li key={habit.id} className="flex items-center gap-2.5 p-3 rounded-xl
                bg-[#F1F3E0] border border-[#D2DCB6]">
                {/* dot — habits are definitions, not checkable */}
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1BC98] flex-shrink-0" />
                <span className="text-sm flex-1 text-[#4f5c49] font-medium">
                  {habit.title}
                </span>
                {habit.timeTarget && (
                  <span className="flex items-center gap-1 text-[10px] text-[#778873]
                    bg-white border border-[#D2DCB6] rounded-full px-1.5 py-0.5 flex-shrink-0">
                    <Clock size={9} />
                    {habit.timeTarget}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </DashboardLayout>
  );
}