// ConfirmModal — reusable destructive action confirmation
// Generic enough to use for any confirm/cancel flow across the app

"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel?: string; // defaults to "Confirm"
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: ConfirmModalProps) {

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-[#2d3328]/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[5px_5px_0px_0px_#d2dcb6] p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center
              justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2d3328]">{title}</h3>
              <p className="text-xs text-[#778873] mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
              transition-all duration-150 flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
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
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
              bg-red-400 text-white
              hover:bg-red-500 transition-all duration-150"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}