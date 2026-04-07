// StructureCard — full detail card for the Structure page
// Shows complete habit list (not preview), streak, today's execution, edit button

import { Flame, Clock, Pencil, CheckCircle2, Circle } from "lucide-react";
import { Structure }  from "@/app/components/config/structureData";

type StructureCardProps = {
  structure: Structure;
  onEdit: (structure: Structure) => void;
};

export default function StructureCard({ structure, onEdit }: StructureCardProps) {
  const { habits, currentStreak, todayCompleted } = structure;
  const totalHabits = habits.length;

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
            Structure
          </p>
          <h3 className="text-lg font-bold text-[#2d3328] leading-tight">
            {structure.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Streak badge */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 bg-[#F1F3E0] border border-[#D2DCB6]
              rounded-full px-2.5 py-1">
              <Flame size={12} className="text-[#778873]" />
              <span className="text-xs font-semibold text-[#2d3328]">{currentStreak}d</span>
            </div>
          )}

          {/* Edit button */}
          <button
            onClick={() => onEdit(structure)}
            className="w-8 h-8 flex items-center justify-center rounded-xl
              text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
              border border-[#D2DCB6] transition-all duration-150"
            aria-label="Edit structure"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>

      {/* ── Today's execution summary ── */}
      <div className="flex items-center justify-between px-3 py-2.5
        bg-[#F1F3E0] rounded-xl border border-[#D2DCB6]">
        <span className="text-xs text-[#778873] font-medium">Today's execution</span>
        <span className={`text-sm font-bold ${
          todayCompleted === totalHabits ? "text-[#A1BC98]" : "text-[#2d3328]"
        }`}>
          {todayCompleted}/{totalHabits} done
        </span>
      </div>

      {/* ── Full habits list ── */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
          Habits
        </p>
        <ul className="flex flex-col gap-2">
          {habits.map((habit, index) => {
            // mock: first `todayCompleted` habits are done
            const isDone = index < todayCompleted;
            return (
              <li key={habit.id} className="flex items-center gap-2.5">
                {isDone
                  ? <CheckCircle2 size={15} className="text-[#A1BC98] flex-shrink-0" />
                  : <Circle       size={15} className="text-[#D2DCB6]  flex-shrink-0" />
                }
                <span className={`text-sm flex-1 ${
                  isDone ? "line-through text-[#a1bc98]" : "text-[#4f5c49]"
                }`}>
                  {habit.title}
                </span>
                {habit.timeTarget && (
                  <span className="flex items-center gap-1 text-[10px] text-[#778873]
                    bg-[#F1F3E0] rounded-full px-1.5 py-0.5 flex-shrink-0">
                    <Clock size={9} />
                    {habit.timeTarget}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}