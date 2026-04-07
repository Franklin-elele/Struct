// StatCard — single overview metric card
// Reusable across Statistics and any future summary sections

import { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string; // optional small context label e.g. "last 7 days"
};

export default function StatCard({ icon: Icon, label, value, sub }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 border
        shadow-[3px_3px_0px_0px_var(--border)]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "var(--card-subtle)" }}
      >
        <Icon size={16} style={{ color: "var(--text-muted)" }} />
      </div>

      {/* Value */}
      <div>
        <p
          className="text-2xl font-bold leading-none"
          style={{ color: "var(--text)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-[10px] font-medium mt-1" style={{ color: "var(--text-faint)" }}>
            {sub}
          </p>
        )}
      </div>

      {/* Label */}
      <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}