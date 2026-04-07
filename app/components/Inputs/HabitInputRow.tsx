// Single habit row — title input + optional time toggle + time input
// Reusable in onboarding Step3 and future Structure modals

type Habit = {
  id: string;
  title: string;
  timeEnabled: boolean;
  timeTarget: string;
};

type HabitInputRowProps = {
  habit: Habit;
  onUpdate: (updated: Habit) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
};

export default function HabitInputRow({
  habit,
  onUpdate,
  onRemove,
  showRemove,
}: HabitInputRowProps) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-white border border-[#D2DCB6]">
      <div className="flex items-center gap-2">
        {/* Habit title input */}
        <input
          type="text"
          value={habit.title}
          onChange={(e) => onUpdate({ ...habit, title: e.target.value })}
          placeholder="e.g. Read for 1 hour"
          className="flex-1 px-3 py-2 rounded-lg border border-[#D2DCB6] bg-[#F1F3E0]
            text-sm text-[#2d3328] placeholder:text-[#a1bc98]
            focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
            transition-all duration-150"
        />

        {/* Remove button — only shown when more than 1 habit */}
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(habit.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-[#778873] hover:bg-[#D2DCB6] hover:text-[#2d3328]
              transition-all duration-150 flex-shrink-0"
            aria-label="Remove habit"
          >
            ✕
          </button>
        )}
      </div>

      {/* Time toggle row */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => onUpdate({ ...habit, timeEnabled: !habit.timeEnabled })}
          className="flex items-center gap-2 text-xs text-[#778873] hover:text-[#2d3328] transition-colors"
        >
          {/* Toggle pill */}
          <span
            className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
              habit.timeEnabled ? "bg-[#A1BC98]" : "bg-[#D2DCB6]"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                habit.timeEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
          Set time target
        </button>

        {/* Time input — only visible when toggled on */}
        {habit.timeEnabled && (
          <input
            type="time"
            value={habit.timeTarget}
            onChange={(e) => onUpdate({ ...habit, timeTarget: e.target.value })}
            className="px-2 py-1 rounded-lg border border-[#D2DCB6] bg-[#F1F3E0]
              text-xs text-[#2d3328]
              focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
              transition-all duration-150"
          />
        )}
      </div>
    </div>
  );
}

export type { Habit };