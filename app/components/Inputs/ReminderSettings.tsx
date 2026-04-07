// Reusable ReminderSettings — morning + night reminder toggles with time inputs
// Used in: Step4 onboarding, Create Structure modal, Create Task modal

import { Moon, Sun } from "lucide-react";

type ReminderConfig = {
  morningEnabled: boolean;
  morningTime: string;
  nightEnabled: boolean;
  nightTime: string;
};

type ReminderSettingsProps = {
  value: ReminderConfig;
  onChange: (updated: ReminderConfig) => void;
};

type ReminderRowProps = {
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  time: string;
  onToggle: () => void;
  onTimeChange: (t: string) => void;
};

// Single reminder row — reused twice below
function ReminderRow({
  label,
  description,
  icon,
  enabled,
  time,
  onToggle,
  onTimeChange,
}: ReminderRowProps) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 ${enabled
          ? "border-[#A1BC98] bg-white"
          : "border-[#D2DCB6] bg-[#F1F3E0]"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{icon}</span>
          <div>
            <p className="text-sm font-medium text-[#2d3328]">{label}</p>
            <p className="text-xs text-[#778873] mt-0.5">{description}</p>
          </div>
        </div>

        {/* Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className={`w-10 h-5 rounded-full flex items-center px-0.5 flex-shrink-0
            transition-colors duration-200 mt-0.5 ${enabled ? "bg-[#A1BC98]" : "bg-[#D2DCB6]"
            }`}
          aria-label={`Toggle ${label}`}
        >
          <span
            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"
              }`}
          />
        </button>
      </div>

      {/* Time picker — shown when enabled */}
      {enabled && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-[#778873]">Remind me at</span>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#D2DCB6] bg-[#F1F3E0]
              text-sm text-[#2d3328]
              focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
              transition-all duration-150"
          />
        </div>
      )}
    </div>
  );
}

export default function ReminderSettings({ value, onChange }: ReminderSettingsProps) {
  return (
    <div className="flex flex-col gap-3">
      <ReminderRow
        label="Morning reminder"
        description="Start your day with intention"
        icon={<Sun size={18} className="text-[#778873]" />}
        enabled={value.morningEnabled}
        time={value.morningTime}
        onToggle={() => onChange({ ...value, morningEnabled: !value.morningEnabled })}
        onTimeChange={(t) => onChange({ ...value, morningTime: t })}
      />
      <ReminderRow
        label="Night reminder"
        description="Review and close out your day"
        icon={<Moon size={18} className="text-[#778873]" />}
        enabled={value.nightEnabled}
        time={value.nightTime}
        onToggle={() => onChange({ ...value, nightEnabled: !value.nightEnabled })}
        onTimeChange={(t) => onChange({ ...value, nightTime: t })}
      />
    </div>
  );
}

export type { ReminderConfig };