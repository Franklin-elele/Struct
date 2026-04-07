// StructureStatCard — long-term performance for a single structure
// Shows streak, longest streak, and overall completion rate
// NOT today's tasks — this is historical performance

import { Flame, Trophy, TrendingUp } from "lucide-react";
import { StructureStat } from "@/app/components/config/statsData";

type StructureStatCardProps = {
  stat: StructureStat;
};

export default function StructureStatCard({ stat }: StructureStatCardProps) {
  // completion rate = completed / created — rounded to whole %
  const rate = stat.totalTasksCreated > 0
    ? Math.round((stat.totalTasksCompleted / stat.totalTasksCreated) * 100)
    : 0;

  return (
    <div
      className="rounded-2xl p-5 border flex flex-col gap-4
        shadow-[3px_3px_0px_0px_var(--border)]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: "var(--text-faint)" }}
          >
            Structure
          </p>
          <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
            {stat.title}
          </h3>
        </div>

        {/* Completion rate badge */}
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: "var(--card-subtle)", color: "var(--text-muted)" }}
        >
          {rate}%
        </span>
      </div>

      {/* ── Three metrics ── */}
      <div
        className="grid grid-cols-3 gap-3 pt-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <MetricCell
          icon={Flame}
          value={`${stat.currentStreak}d`}
          label="Current streak"
        />
        <MetricCell
          icon={Trophy}
          value={`${stat.longestStreak}d`}
          label="Best streak"
        />
        <MetricCell
          icon={TrendingUp}
          value={`${stat.totalTasksCompleted}`}
          label="Done all time"
        />
      </div>

      {/* ── Completion rate bar ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-medium" style={{ color: "var(--text-faint)" }}>
            Overall completion
          </span>
          <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
            {stat.totalTasksCompleted}/{stat.totalTasksCreated} tasks
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--card-subtle)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${rate}%`,
              background: "var(--accent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// small metric cell used inside the card
function MetricCell({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon size={13} style={{ color: "var(--text-faint)" }} />
      <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{value}</span>
      <span className="text-[9px] font-medium leading-tight" style={{ color: "var(--text-faint)" }}>
        {label}
      </span>
    </div>
  );
}

// import fix
import { LucideIcon } from "lucide-react";