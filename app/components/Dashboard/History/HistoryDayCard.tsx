// HistoryDayCard — one day's performance record (read-only)

import { Calendar } from "lucide-react";
import {
  DayRecord,
  getCompletionLevel,
  CompletionLevel,
} from "@/app/components/config/historyData";

type HistoryDayCardProps = {
  record: DayRecord;
};

const levelStyles: Record<CompletionLevel, { dot: string; text: string; bar: string }> = {
  full:    { dot: "bg-[#A1BC98]", text: "text-[#A1BC98]", bar: "bg-[#A1BC98]" },
  partial: { dot: "bg-[#D2DCB6]", text: "text-[#778873]", bar: "bg-[#D2DCB6]" },
  low:     { dot: "bg-red-200",   text: "text-red-400",   bar: "bg-red-200"   },
};

function formatDate(dateStr: string): string {
  // Build the date from its parts so it stays on the same calendar day
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

function getDayPercent(record: DayRecord): number {
  const done = record.structures.reduce((sum, s) => sum + s.completed, 0);
  const total = record.structures.reduce((sum, s) => sum + s.total, 0);
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

export default function HistoryDayCard({ record }: HistoryDayCardProps) {
  const dayPercent = getDayPercent(record);
  const dayLevel = getCompletionLevel(dayPercent, 100);

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[3px_3px_0px_0px_#d2dcb6] p-4 flex flex-col gap-3">

      {/* Date row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#a1bc98]" />
          <span className="text-sm font-bold text-[#2d3328]">
            {formatDate(record.date)}
          </span>
        </div>

        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
          border border-[#D2DCB6] bg-[#F1F3E0] ${levelStyles[dayLevel].text}`}
        >
          {dayPercent}%
        </span>
      </div>

      {/* Per-structure rows */}
      <div className="flex flex-col gap-2">
        {record.structures.map((structure, i) => {
          const level = getCompletionLevel(structure.completed, structure.total);
          const styles = levelStyles[level];
          const percent = structure.total > 0
            ? Math.round((structure.completed / structure.total) * 100)
            : 0;

          return (
            // index in the key: two structures can share a title
            <div key={`${structure.title}-${i}`} className="flex flex-col gap-1">
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