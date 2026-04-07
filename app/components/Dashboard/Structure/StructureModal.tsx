// StructureModal — create new structure OR edit existing one
// Mode is determined by whether `initial` prop is provided
// onSave receives the full structure data — wire to API later

"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import HabitInputRow from "./HabitInputRow";
import ReminderSettings from "./ReminderSettings";
import {
  Structure,
  HabitItem,
  StructureReminders,
  DEFAULT_REMINDERS,
} from "@/app/components/config/structureData";

type StructureModalProps = {
  initial?: Structure;  // if provided = edit mode, else = create mode
  onSave: (data: Omit<Structure, "id" | "currentStreak" | "todayCompleted">) => void;
  onClose: () => void;
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function StructureModal({ initial, onSave, onClose }: StructureModalProps) {
  const isEditing = !!initial;

  // ── Form state — pre-filled from `initial` if editing ──
  const [title, setTitle]           = useState(initial?.title ?? "");
  const [habits, setHabits]         = useState<HabitItem[]>(
    initial?.habits ?? [{ id: generateId(), title: "", timeTarget: undefined }]
  );
  const [reminders, setReminders]   = useState<StructureReminders>(
    initial?.reminders ?? DEFAULT_REMINDERS
  );

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const addHabit = () =>
    setHabits((prev) => [
      ...prev,
      { id: generateId(), title: "", timeTarget: undefined },
    ]);

  const updateHabit = (updated: HabitItem) =>
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));

  const removeHabit = (id: string) =>
    setHabits((prev) => prev.filter((h) => h.id !== id));

  const canSave =
    title.trim().length > 0 &&
    habits.some((h) => h.title.trim().length > 0);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      title: title.trim(),
      habits: habits.filter((h) => h.title.trim()), // strip empty habit rows
      reminders,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
        bg-[#2d3328]/30 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      {/* ── Modal card ── */}
      {/* Bottom sheet on mobile, centered card on sm+ */}
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl
          border border-[#D2DCB6] shadow-[5px_5px_0px_0px_#d2dcb6]
          flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4
          border-b border-[#F1F3E0] flex-shrink-0">
          <h3 className="text-sm font-bold text-[#2d3328]">
            {isEditing ? "Edit Structure" : "Create Structure"}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
              transition-all duration-150"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4f5c49] uppercase tracking-wider">
              Structure title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study Daily"
              className="w-full px-4 py-3 rounded-xl border border-[#D2DCB6] bg-[#F1F3E0]
                text-sm text-[#2d3328] placeholder:text-[#a1bc98]
                focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
                transition-all duration-150"
            />
          </div>

          {/* Habits */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#4f5c49] uppercase tracking-wider">
              Habits
            </label>
            <div className="flex flex-col gap-2">
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
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                border-2 border-dashed border-[#D2DCB6] text-[#778873] text-xs font-semibold
                hover:border-[#A1BC98] hover:text-[#2d3328] hover:bg-[#F1F3E0]
                transition-all duration-150"
            >
              <Plus size={13} />
              Add habit
            </button>
          </div>

          {/* Reminders */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#4f5c49] uppercase tracking-wider">
              Reminders
              <span className="font-normal text-[#a1bc98] normal-case tracking-normal ml-1">
                (optional)
              </span>
            </label>
            <ReminderSettings value={reminders} onChange={setReminders} />
          </div>

        </div>

        {/* ── Footer actions ── */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#F1F3E0] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#D2DCB6]
              text-sm font-semibold text-[#778873]
              hover:border-[#A1BC98] hover:text-[#2d3328]
              transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150
              ${canSave
                ? "bg-[#2d3328] text-[#F1F3E0] shadow-[4px_4px_0px_0px_#a1bc98] hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]"
                : "bg-[#D2DCB6] text-[#a1bc98] cursor-not-allowed"
              }`}
          >
            {isEditing ? "Save changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}