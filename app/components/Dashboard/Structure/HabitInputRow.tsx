// HabitInputRow — single habit row inside StructureModal
// title input + optional time + remove button

import { X, Clock } from "lucide-react";
import { HabitItem } from "@/app/components/config/structureData";
import InputField from "@/app/components/Inputs/index";

type HabitInputRowProps = {
  habit: HabitItem;
  onUpdate: (updated: HabitItem) => void;
  onRemove: (id: string) => void;
  showRemove: boolean; // hide remove when only 1 habit remains
};

export default function HabitInputRow({
  habit,
  onUpdate,
  onRemove,
  showRemove,
}: HabitInputRowProps) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#F1F3E0]
      border border-[#D2DCB6]">

      {/* Title + remove row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={habit.title}
          onChange={(e) => onUpdate({ ...habit, title: e.target.value })}
          placeholder="e.g. Read for 1 hour"
          className="flex-1 px-3 py-2 rounded-lg border border-[#D2DCB6] bg-white
            text-sm text-[#2d3328] placeholder:text-[#a1bc98]
            focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
            transition-all duration-150"
        />
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(habit.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0
              text-[#D2DCB6] hover:text-red-400 hover:bg-red-50
              transition-all duration-150"
            aria-label="Remove habit"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Optional time row */}
      <div className="flex items-center gap-2 px-1">
        <Clock size={11} className="text-[#a1bc98] flex-shrink-0" />
        <input
          type="text"
          value={habit.timeTarget ?? ""}
          onChange={(e) =>
            onUpdate({ ...habit, timeTarget: e.target.value || undefined })
          }
          placeholder="Time target (optional, e.g. 1 hr)"
          className="flex-1 px-2 py-1 rounded-lg border border-[#D2DCB6] bg-white
            text-xs text-[#2d3328] placeholder:text-[#a1bc98]
            focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
            transition-all duration-150"
        />
      </div>
    </div>
  );
}