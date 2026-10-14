// HabitInputRow — one habit row inside StructureModal
// Title + optional "time needed" as hours and minutes, saved as text like "1 hr 30 min"

"use client";

import { useState } from "react";
import { X, Clock } from "lucide-react";
// import { HabitItem } from "@/app/components/config/structureData";

type HabitItem = {
  id: string;
  title: string;
  timeTarget?: string;

};


type HabitInputRowProps = {
  habit: HabitItem;
  onUpdate: (updated: HabitItem) => void;
  onRemove: (id: string) => void;
  showRemove: boolean; // hide remove when only 1 habit remains
};

// A task is a per-day item, so 24 hours is the sensible ceiling
const MAX_HOURS = 24;

// "1 hr 30 min" -> { hours: "1", minutes: "30" }. Anything unreadable ("7", "6:00") -> blank
function parseDuration(value?: string) {
  const hr = value?.match(/(\d+)\s*h/i);
  const min = value?.match(/(\d+)\s*m/i);
  return { hours: hr ? hr[1] : "", minutes: min ? min[1] : "" };
}

// Keep digits only (max 2), then clamp to the allowed maximum
function cleanNumber(raw: string, max: number) {
  const digits = raw.replace(/\D/g, "").slice(0, 2);
  if (!digits) return "";
  return String(Math.min(Number(digits), max));
}

export default function HabitInputRow({
  habit,
  onUpdate,
  onRemove,
  showRemove,
}: HabitInputRowProps) {
  const initial = parseDuration(habit.timeTarget);
  const [hours, setHours] = useState(initial.hours);
  const [minutes, setMinutes] = useState(initial.minutes);

  // Build the saved text from the two boxes
  const pushDuration = (h: string, m: string) => {
    const parts: string[] = [];
    if (Number(h)) parts.push(`${Number(h)} hr`);
    if (Number(m)) parts.push(`${Number(m)} min`);
    onUpdate({ ...habit, timeTarget: parts.length ? parts.join(" ") : undefined });
  };

  const handleHours = (raw: string) => {
    const h = cleanNumber(raw, MAX_HOURS);
    const m = h === String(MAX_HOURS) ? "" : minutes; // 24 hr leaves no room for minutes
    setHours(h);
    setMinutes(m);
    pushDuration(h, m);
  };

  const handleMinutes = (raw: string) => {
    if (hours === String(MAX_HOURS)) return;
    const m = cleanNumber(raw, 59);
    setMinutes(m);
    pushDuration(hours, m);
  };

  const boxClass =
    "w-14 px-2 py-1.5 rounded-md border border-[#D2DCB6] bg-white text-center " +
    "text-sm text-[#2d3328] placeholder:text-[#a1bc98] " +
    "focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent " +
    "transition-all duration-150";

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#F1F3E0] border border-[#D2DCB6]">
      {/* Title + remove */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={habit.title}
          onChange={(e) => onUpdate({ ...habit, title: e.target.value })}
          placeholder="e.g. Read for 1 hour"
          className="flex-1 min-w-0 px-3 py-2 rounded-md  border border-[#D2DCB6] bg-white
            text-sm text-[#2d3328] placeholder:text-[#a1bc98]
            focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
            transition-all duration-150"
        />
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(habit.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0
              text-[#D2DCB6] hover:text-red-400 hover:bg-red-50 transition-all duration-150"
            aria-label="Remove habit"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Time needed */}
      <div className="flex items-center gap-2 px-1 flex-wrap">
        <Clock size={12} className="text-[#a1bc98] flex-shrink-0" />
        <span className="text-[11px] font-medium text-[#778873]">
          Time needed (optional)
        </span>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            value={hours}
            onChange={(e) => handleHours(e.target.value)}
            placeholder="0"
            aria-label="Hours"
            className={boxClass}
          />
          <span className="text-xs text-[#778873]">hr</span>
          <input
            type="text"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => handleMinutes(e.target.value)}
            placeholder="0"
            aria-label="Minutes"
            className={boxClass}
          />
          <span className="text-xs text-[#778873]">min</span>
        </div>
      </div>
    </div>
  );
}

