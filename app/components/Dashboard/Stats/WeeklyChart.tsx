// WeeklyChart — 7-day activity visualization
// No chart libraries — pure divs with CSS variables
// Each day shows status: perfect / partial / missed / empty
// Status logic lives in statsData.ts getDayStatus()

import { DayActivity, getDayStatus, getWeekdayLabel, DayStatus } from "@/app/components/config/statsData";

type WeeklyChartProps = {
  days: DayActivity[];
};

// color config per status — uses CSS variables for dark mode support
const statusConfig: Record<DayStatus, {
  bar: string;       // inline style for the bar fill
  dot: string;       // dot indicator color
  label: string;     // accessible label
}> = {
  perfect: {
    bar:   "var(--accent)",
    dot:   "var(--accent)",
    label: "Completed",
  },
  partial: {
    bar:   "var(--sage-light, #d2dcb6)",
    dot:   "var(--text-faint)",
    label: "Partial",
  },
  missed: {
    bar:   "#fca5a5",   // soft red — intentional, not palette
    dot:   "#fca5a5",
    label: "Missed",
  },
  empty: {
    bar:   "var(--card-subtle)",
    dot:   "var(--border)",
    label: "No tasks",
  },
};

export default function WeeklyChart({ days }: WeeklyChartProps) {
  return (
    <div
      className="rounded-2xl p-5 border shadow-[3px_3px_0px_0px_var(--border)]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="mb-4">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--text-faint)" }}
        >
          This week
        </p>
        <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
          Weekly Activity
        </h3>
      </div>

      {/* ── Day columns ── */}
      <div className="flex items-end gap-2 h-24">
        {days.map((day) => {
          const status  = getDayStatus(day);
          const config  = statusConfig[status];
          // bar height: 100% for perfect, proportional for partial, fixed low for missed/empty
          const height  = status === "perfect"
            ? "100%"
            : status === "partial" && day.tasksCreated > 0
            ? `${Math.round((day.tasksCompleted / day.tasksCreated) * 100)}%`
            : status === "missed"
            ? "12%"
            : "4%";

          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1.5 flex-1"
              title={`${getWeekdayLabel(day.date)}: ${config.label} (${day.tasksCompleted}/${day.tasksCreated})`}
            >
              {/* Bar column */}
              <div
                className="w-full rounded-lg overflow-hidden flex items-end"
                style={{ height: "80px", background: "var(--card-subtle)" }}
              >
                <div
                  className="w-full rounded-lg transition-all duration-500"
                  style={{
                    height,
                    background: config.bar,
                    minHeight: "4px",
                  }}
                />
              </div>

              {/* Day label */}
              <span
                className="text-[10px] font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                {getWeekdayLabel(day.date)}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div
        className="flex items-center gap-4 mt-4 pt-3 border-t flex-wrap"
        style={{ borderColor: "var(--border)" }}
      >
        {(["perfect", "partial", "missed", "empty"] as DayStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: statusConfig[s].bar }}
            />
            <span
              className="text-[10px] font-medium capitalize"
              style={{ color: "var(--text-faint)" }}
            >
              {statusConfig[s].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}