// ProgressHeader — top section of the Tasks page
// Shows: date, completion fraction, progress bar, optional streak hint

import { Flame } from "lucide-react";

type ProgressHeaderProps = {
  completedCount: number;
  totalCount: number;
  systemStreak: number;
  yesterdayCompleted?: number; // optional yesterday stats
  yesterdayTotal?: number;
};

export default function ProgressHeader({
  completedCount,
  totalCount,
  systemStreak,
  yesterdayCompleted,
  yesterdayTotal,
}: ProgressHeaderProps) {
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">

      {/* ── Date + streak ── */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
            {today}
          </p>
          <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">
            {completedCount}/{totalCount} completed
          </h2>
        </div>

        {/* Streak hint — only shown if streak > 0 */}
        {systemStreak > 0 && (
          <div className="flex items-center gap-1.5 bg-[#F1F3E0] border border-[#D2DCB6]
            rounded-full px-3 py-1.5 flex-shrink-0">
            <Flame size={13} className="text-[#778873]" />
            <span className="text-xs font-semibold text-[#2d3328]">
              {systemStreak} day streak
            </span>
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div className="flex flex-col gap-1.5">
        <div className="w-full h-2 bg-[#F1F3E0] rounded-full overflow-hidden border border-[#D2DCB6]">
          <div
            className="h-full bg-[#A1BC98] rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-[#778873] font-medium">{percent}% done</p>
      </div>

      {/* ── Yesterday feedback — subtle, not dominant ── */}
      {yesterdayTotal !== undefined && yesterdayCompleted !== undefined && (
        <p className="text-xs text-[#a1bc98] border-t border-[#F1F3E0] pt-3">
          Yesterday:{" "}
          <span className="font-semibold text-[#778873]">
            {yesterdayCompleted}/{yesterdayTotal}
          </span>{" "}
          completed
        </p>
      )}
    </div>
  );
}