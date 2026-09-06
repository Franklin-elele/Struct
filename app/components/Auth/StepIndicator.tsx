import React from "react";

export default function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${i < current
              ? "bg-[#778873] w-8"
              : i === current
                ? "bg-[#A1BC98] w-8"
                : "bg-[#D2DCB6] w-4"
              }`}
          />
        </div>
      ))}
      <span className="text-xs text-[#778873] ml-1 font-medium">
        {current + 1} / {total}
      </span>
    </div>
  );
}