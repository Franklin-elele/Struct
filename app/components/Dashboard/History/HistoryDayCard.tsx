// HistoryDayCard — one day's performance record
// onDelete — triggers confirm modal in parent (single day deletion)

import { Calendar, Trash2 } from "lucide-react";
import { DayRecord, getCompletionLevel, CompletionLevel }  from "@/app/components/config/historyData";

type HistoryDayCardProps = {
  record: DayRecord;
  onDelete: (date: string) => void;
};

const levelStyles: Record<CompletionLevel, { dot: string; text: string; bar: string }> = {
  full:    { dot: "bg-[#A1BC98]", text: "text-[#A1BC98]", bar: "bg-[#A1BC98]" },
  partial: { dot: "bg-[#D2DCB6]", text: "text-[#778873]", bar: "bg-[#D2DCB6]" },
  low:     { dot: "bg-red-200",   text: "text-red-400",   bar: "bg-red-200"   },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month:   "long",
    day:     "numeric",
  });
}

function getDayPercent(record: DayRecord): number {
  const totalCompleted = record.structures.reduce((sum, s) => sum + s.completed, 0);
  const totalHabits    = record.structures.reduce((sum, s) => sum + s.total, 0);
  return totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;
}

export default function HistoryDayCard({ record, onDelete }: HistoryDayCardProps) {
  const dayPercent = getDayPercent(record);
  const dayLevel   = getCompletionLevel(dayPercent, 100);

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[3px_3px_0px_0px_#d2dcb6] p-4 flex flex-col gap-3">

      {/* ── Date row ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#a1bc98]" />
          <span className="text-sm font-bold text-[#2d3328]">
            {formatDate(record.date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Completion badge */}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
            border border-[#D2DCB6] bg-[#F1F3E0] ${levelStyles[dayLevel].text}`}
          >
            {dayPercent}%
          </span>

          {/* Delete single day */}
          <button
            onClick={() => onDelete(record.date)}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-[#D2DCB6] hover:text-red-400 hover:bg-red-50
              transition-all duration-150"
            aria-label="Delete this day"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* ── Per-structure rows ── */}
      <div className="flex flex-col gap-2">
        {record.structures.map((structure) => {
          const level   = getCompletionLevel(structure.completed, structure.total);
          const styles  = levelStyles[level];
          const percent = structure.total > 0
            ? Math.round((structure.completed / structure.total) * 100)
            : 0;

          return (
            <div key={structure.title} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
                  <span className="text-xs font-medium text-[#4f5c49]">
                    {structure.title}
                  </span>
                </div>
                <span className={`text-xs font-semibold ${styles.text}`}>
                  {structure.completed}/{structure.total}
                </span>
              </div>
              <div className="ml-4 h-1 bg-[#F1F3E0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}