// Step 3 — Habit Setup: dynamic list of habits with optional time targets

import { useCallback } from "react";
import HabitInputRow, { Habit } from "../Inputs/HabitInputRow";
// import InputField from "../Inputs/index";

type Step3Props = {
  habits: Habit[];
  onChange: (habits: Habit[]) => void;
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Step3HabitSetup({ habits, onChange }: Step3Props) {
  const addHabit = useCallback(() => {
    onChange([
      ...habits,
      { id: generateId(), title: "", timeEnabled: false, timeTarget: "08:00" },
    ]);
  }, [habits, onChange]);

  const updateHabit = useCallback(
    (updated: Habit) => {
      onChange(habits.map((h) => (h.id === updated.id ? updated : h)));
    },
    [habits, onChange]
  );

  const removeHabit = useCallback(
    (id: string) => {
      onChange(habits.filter((h) => h.id !== id));
    },
    [habits, onChange]
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">
          Add habits to your structure
        </h2>
        <p className="text-sm text-[#778873] mt-1">
          These are the actions you'll execute every day. Keep them focused.
        </p>
      </div>

      {/* Habit list */}
      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <HabitInputRow
            key={habit.id}
            habit={habit}
            onUpdate={updateHabit}
            onRemove={removeHabit}
            showRemove={habits.length > 1}
          />
        ))}
      </div>

      {/* Add habit button */}
      <button
        type="button"
        onClick={addHabit}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
          border-2 border-dashed border-[#D2DCB6] text-[#778873] text-sm font-medium
          hover:border-[#A1BC98] hover:text-[#2d3328] hover:bg-white
          transition-all duration-150"
      >
        <span className="text-lg leading-none">+</span>
        Add another habit
      </button>
    </div>
  );
}