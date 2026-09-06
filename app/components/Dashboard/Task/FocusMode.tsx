"use client";

// FocusMode — distraction-free execution, one task at a time
// Exit opens ExitConfirmModal with a 60s countdown for intentional friction
// When all tasks are done, exit is immediate — no timer needed

import { useState } from "react";
import { CheckCircle2, Zap, Clock } from "lucide-react";
import { Task } from "../../config/tasksData";
import ExitConfirmModal from "./ExitConfirmModal";

type FocusModeProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onExit: () => void;
};

export default function FocusMode({ tasks, onToggle, onExit }: FocusModeProps) {
  const [showExitModal, setShowExitModal] = useState(false);

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedCount  = tasks.filter((t) => t.completed).length;
  const activeTask      = incompleteTasks[0] ?? null;
  const allDone         = incompleteTasks.length === 0;

  return (
    <div className="fixed inset-0 z-40 bg-[#F1F3E0]/95 backdrop-blur-sm
      flex flex-col items-center justify-center p-6">

      {showExitModal && (
        <ExitConfirmModal
          incompleteTasks={incompleteTasks.length}
          onCancel={() => setShowExitModal(false)}
          onConfirm={onExit}
        />
      )}

      {/* Exit button — opens modal instead of exiting directly */}
      <button
        onClick={() => setShowExitModal(true)}
        className="absolute top-5 right-5 text-xs font-semibold text-[#778873]
          hover:text-[#2d3328] transition-colors duration-150 px-3 py-1.5
          rounded-lg border border-[#D2DCB6] bg-white"
      >
        Exit focus
      </button>

      {/* Progress indicator */}
      <p className="text-xs font-semibold text-[#a1bc98] uppercase tracking-widest mb-6">
        {completedCount}/{tasks.length} done
      </p>

      {allDone ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#D2DCB6] flex items-center justify-center">
            <CheckCircle2 size={36} className="text-[#778873]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">All done.</h2>
          <p className="text-sm text-[#778873] max-w-xs">
            You executed everything today. That's what consistency looks like.
          </p>
          <button
            onClick={onExit}
            className="mt-2 px-6 py-3 rounded-xl bg-[#2d3328] text-[#F1F3E0]
              text-sm font-semibold shadow-[4px_4px_0px_0px_#a1bc98]
              hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]
              transition-all duration-150"
          >
            Back to tasks
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#778873]" />
            <span className="text-xs font-semibold text-[#778873] uppercase tracking-wider">
              Focus on this
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D2DCB6]
            shadow-[5px_5px_0px_0px_#d2dcb6] p-6 flex flex-col gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
              {activeTask!.structureTitle}
            </p>
            <h2 className="text-xl font-bold text-[#2d3328] leading-snug">
              {activeTask!.title}
            </h2>
            {activeTask!.time && (
              <div className="flex items-center gap-1.5 text-sm text-[#778873]">
                <Clock size={14} />
                <span>{activeTask!.time}</span>
              </div>
            )}
            <button
              onClick={() => onToggle(activeTask!.id)}
              className="w-full py-3.5 rounded-xl bg-[#2d3328] text-[#F1F3E0]
                text-sm font-semibold flex items-center justify-center gap-2
                shadow-[4px_4px_0px_0px_#a1bc98]
                hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]
                transition-all duration-150"
            >
              <CheckCircle2 size={16} />
              Mark as done
            </button>
          </div>

          {incompleteTasks.length > 1 && (
            <p className="text-center text-xs text-[#a1bc98]">
              {incompleteTasks.length - 1} task{incompleteTasks.length - 1 > 1 ? "s" : ""} remaining
            </p>
          )}
        </div>
      )}
    </div>
  );
}