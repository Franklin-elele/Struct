// StatsCard — updated to show system-level streak
// System streak = min(all structure streaks)
// A day only counts if ALL structures met their threshold — not just one

import { Flame, CheckSquare, TrendingUp } from "lucide-react";
import { Stats } from "../config/mockData";
import { Structure } from "../config/mockData";

type StatsCardProps = {
  stats: Stats;
  structures: Structure[]; // needed to compute system streak
};

function StatCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-9 h-9 rounded-xl bg-[#F1F3E0] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-lg font-bold text-[#2d3328] leading-none">{value}</span>
      <span className="text-[10px] text-[#778873] font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function StatsCard({ stats, structures }: StatsCardProps) {
  const { completedToday, totalToday, overallPercent } = stats;

  // system streak = the weakest link across all active structures
  // if any structure breaks its streak, the whole system resets
  const systemStreak =
    structures.length > 0
      ? Math.min(...structures.map((s) => s.currentStreak))
      : 0;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (overallPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-5">

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
          Today's Progress
        </p>
        <h3 className="text-base font-bold text-[#2d3328]">Overview</h3>
      </div>

      {/* ── Circular progress ring ── */}
      <div className="flex items-center justify-center">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="#F1F3E0" strokeWidth="6" />
            <circle
              cx="36" cy="36" r={radius}
              fill="none" stroke="#A1BC98" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold text-[#2d3328]">{overallPercent}%</span>
          </div>
        </div>
      </div>

      {/* ── Stat cells ── */}
      <div className="flex items-start gap-2 pt-1 border-t border-[#F1F3E0]">

        {/* System streak — min of all structure streaks, not the best one */}
        <StatCell
          icon={<Flame size={16} className="text-[#778873]" />}
          value={`${systemStreak}d`}
          label="System streak"
        />

        <div className="w-px self-stretch bg-[#F1F3E0]" />

        <StatCell
          icon={<CheckSquare size={16} className="text-[#A1BC98]" />}
          value={`${completedToday}/${totalToday}`}
          label="Done today"
        />

        <div className="w-px self-stretch bg-[#F1F3E0]" />

        <StatCell
          icon={<TrendingUp size={16} className="text-[#778873]" />}
          value={`${overallPercent}%`}
          label="Completion"
        />

      </div>
    </div>
  );
}