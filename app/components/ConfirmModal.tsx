// ConfirmModal — reusable destructive action confirmation
// Waits for onConfirm (sync or async), shows a spinner, closes only on success

"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel?: string; // defaults to "Confirm"
  loadingLabel?: string; // defaults to "Please wait..."
  onConfirm: () => void | Promise<void>; // throw to keep the modal open
  onClose: () => void;
};

export default function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirm",
  loadingLabel = "Please wait...",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  // close on Escape, but not while a request is running
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, loading]);

  const handleConfirm = async () => {
    if (loading) return; // blocks double-clicks
    setLoading(true);
    try {
      await onConfirm();
      onClose(); // only close if it worked
    } catch {
      // the caller already showed an error; stay open so the user can retry
    } finally {
      setLoading(false);
    }
  };

  const safeClose = () => {
    if (!loading) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-[#2d3328]/30 backdrop-blur-sm"
      onClick={safeClose}
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
            onClick={safeClose}
            disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
              disabled:opacity-40 transition-all duration-150 flex-shrink-0"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <button
            onClick={safeClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#D2DCB6]
              text-sm font-semibold text-[#778873]
              hover:border-[#A1BC98] hover:text-[#2d3328]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
              flex items-center justify-center gap-2
              bg-red-400 text-white hover:bg-red-500
              disabled:opacity-70 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}