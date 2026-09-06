"use client";

// ExitConfirmModal — confirmation modal with 60s countdown timer
// Shown when user tries to exit focus mode before completing all tasks
// Exit button is disabled until timer hits 0

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ExitConfirmModalProps = {
  incompleteTasks: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ExitConfirmModal({ incompleteTasks, onCancel, onConfirm }: ExitConfirmModalProps) {
  const [seconds, setSeconds] = useState(60);

  // countdown — ticks every second until 0
  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2d3328]/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#D2DCB6]
        shadow-[5px_5px_0px_0px_#d2dcb6] p-6 w-full max-w-sm flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#2d3328]">Leave focus mode?</h3>
            {incompleteTasks > 0 && (
              <p className="text-sm text-[#778873] mt-1">
                You still have {incompleteTasks} task{incompleteTasks > 1 ? "s" : ""} remaining.
              </p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-[#D2DCB6] hover:text-[#778873] hover:bg-[#F1F3E0]
              transition-all duration-150 flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Countdown ring */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
              <circle cx="36" cy="36" r="28" fill="none" stroke="#F1F3E0" strokeWidth="6" />
              <circle
                cx="36" cy="36" r="28"
                fill="none" stroke="#A1BC98" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - seconds / 60)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-[#2d3328]">{seconds}s</span>
            </div>
          </div>
          <p className="text-xs text-[#a1bc98] text-center">
            {seconds > 0
              ? "Stay a little longer — you've got this."
              : "Timer done. You can leave now."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={seconds > 0}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150
              ${seconds > 0
                ? "bg-[#F1F3E0] text-[#a1bc98] cursor-not-allowed"
                : "bg-[#2d3328] text-[#F1F3E0] shadow-[4px_4px_0px_0px_#a1bc98] hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]"
              }`}
          >
            {seconds > 0 ? `Wait ${seconds}s to exit` : "I'm done for now"}
          </button>

          <button
            onClick={onCancel}
            className="w-full py-3 rounded-xl border-2 border-[#D2DCB6] text-[#778873]
              text-sm font-semibold hover:border-[#A1BC98] hover:text-[#2d3328]
              hover:bg-[#F1F3E0] transition-all duration-150"
          >
            Keep going
          </button>
        </div>

      </div>
    </div>
  );
}