// StructureCard — updated v2
// Shows: title, habit preview (max 3 + overflow), today's progress, streak
// Removed: completion % (we track execution, not structure completion)

import { CheckCircle2, Circle, Clock, Flame, ArrowRight } from "lucide-react";
import { Structure } from "../config/mockData";

type StructureCardProps = {
  structure: Structure;
  onView?: (id: string) => void;
};

const HABIT_PREVIEW_LIMIT = 3; // max habits shown before "+X more"

export default function StructureCard({ structure, onView }: StructureCardProps) {
  const { habits, currentStreak, streakEnabled } = structure;

  // progress counts
  const completed = habits.filter((h) => h.completed).length;
  const total     = habits.length;

  // split habits into visible preview and overflow
  const visibleHabits  = habits.slice(0, HABIT_PREVIEW_LIMIT);
  const overflowCount  = habits.length - HABIT_PREVIEW_LIMIT;

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">

      {/* ── Header: title + streak badge ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
            Structure
          </p>
          <h3 className="text-base font-bold text-[#2d3328] leading-tight truncate">
            {structure.title}
          </h3>
        </div>

        {/* Streak badge — only shown if streakEnabled */}
        {streakEnabled && currentStreak > 0 && (
          <div className="flex items-center gap-1 bg-[#F1F3E0] border border-[#D2DCB6]
            rounded-full px-2.5 py-1 flex-shrink-0">
            <Flame size={12} className="text-[#778873]" />
            <span className="text-xs font-semibold text-[#2d3328]">
              {currentStreak}d
            </span>
          </div>
        )}
      </div>

      {/* ── Habit preview list ── */}
      <ul className="flex flex-col gap-2">
        {visibleHabits.map((habit) => (
          <li key={habit.id} className="flex items-center gap-2.5">
            {habit.completed
              ? <CheckCircle2 size={15} className="text-[#A1BC98] flex-shrink-0" />
              : <Circle       size={15} className="text-[#D2DCB6]  flex-shrink-0" />
            }
            <span className={`text-sm flex-1 truncate ${
              habit.completed ? "line-through text-[#a1bc98]" : "text-[#4f5c49]"
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
        ))}

        {/* Overflow indicator */}
        {overflowCount > 0 && (
          <li className="text-xs text-[#a1bc98] font-medium pl-[23px]">
            +{overflowCount} more habit{overflowCount > 1 ? "s" : ""}
          </li>
        )}
      </ul>

      {/* ── Today's progress — fraction only, no % ── */}
      <div className="flex items-center justify-between pt-1 border-t border-[#F1F3E0]">
        <span className="text-xs text-[#778873] font-medium">Today's progress</span>
        <span className={`text-sm font-bold ${
          completed === total ? "text-[#A1BC98]" : "text-[#2d3328]"
        }`}>
          {completed}/{total} done
        </span>
      </div>

      {/* ── View button ── */}
      <button
        onClick={() => onView?.(structure.id)}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
          border-2 border-[#D2DCB6] text-[#778873] text-sm font-semibold
          hover:border-[#A1BC98] hover:text-[#2d3328] hover:bg-[#F1F3E0]
          transition-all duration-150"
      >
        View structure <ArrowRight size={14} />
      </button>
    </div>
  );
}