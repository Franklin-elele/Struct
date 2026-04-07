// EditModal — generic reusable modal for editing any entity
// Accepts dynamic fields so it works for tasks, habits, structures, etc.
// Usage: define fields config, pass current values, get updates back via onSave

"use client";

import { useEffect } from "react";
import { X, PenLine } from "lucide-react";

// a single editable field definition
export type EditField = {
  key: string;           // maps to the data object key
  label: string;         // displayed label
  placeholder?: string;
  optional?: boolean;    // shows "(optional)" next to label
  icon?: React.ReactNode;
};

// a read-only info row (e.g. Structure name — shown but not editable)
export type ReadOnlyField = {
  label: string;
  value: string;
};

type EditModalProps = {
  title: string;                          // modal heading e.g. "Edit Task"
  fields: EditField[];                    // editable fields
  readOnlyFields?: ReadOnlyField[];       // info rows shown but not editable
  values: Record<string, string>;         // current field values
  onChange: (key: string, val: string) => void;  // updates a single field
  onSave: () => void;
  onClose: () => void;
  saveDisabled?: boolean;                 // e.g. disable if title is empty
};

export default function EditModal({
  title,
  fields,
  readOnlyFields,
  values,
  onChange,
  onSave,
  onClose,
  saveDisabled,
}: EditModalProps) {

  // close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (saveDisabled) return;
    onSave();
    onClose();
  };

  return (
    // ── Backdrop ──
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-[#2d3328]/30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* ── Card — stop click propagation ── */}
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[5px_5px_0px_0px_#d2dcb6] p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine size={15} className="text-[#778873]" />
            <h3 className="text-sm font-bold text-[#2d3328]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
              transition-all duration-150"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Read-only info rows ── */}
        {readOnlyFields && readOnlyFields.length > 0 && (
          <div className="flex flex-col gap-2">
            {readOnlyFields.map((field) => (
              <div
                key={field.label}
                className="px-3 py-2 rounded-xl bg-[#F1F3E0] border border-[#D2DCB6]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-0.5">
                  {field.label}
                </p>
                <p className="text-sm font-medium text-[#778873]">{field.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Editable fields ── */}
        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#4f5c49] uppercase tracking-wider
                flex items-center gap-1.5">
                {field.icon}
                {field.label}
                {field.optional && (
                  <span className="font-normal text-[#a1bc98] normal-case tracking-normal">
                    (optional)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[#D2DCB6] bg-[#F1F3E0]
                  text-sm text-[#2d3328] placeholder:text-[#a1bc98]
                  focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
                  transition-all duration-150"
              />
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-1">
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
            disabled={saveDisabled}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150
              ${!saveDisabled
                ? "bg-[#2d3328] text-[#F1F3E0] shadow-[4px_4px_0px_0px_#a1bc98] hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]"
                : "bg-[#D2DCB6] text-[#a1bc98] cursor-not-allowed"
              }`}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}