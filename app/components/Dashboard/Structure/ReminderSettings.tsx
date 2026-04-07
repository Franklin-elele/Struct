// ReminderSettings — morning + night reminder toggles with time inputs
// Reusable: used in StructureModal and onboarding Step4

import { Sun, Moon } from "lucide-react";
import { StructureReminders } from "@/app/components/config/structureData";

type ReminderSettingsProps = {
  value: StructureReminders;
  onChange: (updated: StructureReminders) => void;
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

function ReminderRow({
  label, description, icon, enabled, time, onToggle, onTimeChange,
}: ReminderRowProps) {
  return (
    <div className={`p-3.5 rounded-xl border transition-all duration-200 ${
      enabled ? "border-[#A1BC98] bg-white" : "border-[#D2DCB6] bg-[#F1F3E0]"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[#778873]">{icon}</span>
          <div>
            <p className="text-sm font-medium text-[#2d3328]">{label}</p>
            <p className="text-xs text-[#778873] mt-0.5">{description}</p>
          </div>
        </div>
        {/* Toggle pill */}
        <button
          type="button"
          onClick={onToggle}
          className={`w-10 h-5 rounded-full flex items-center px-0.5 flex-shrink-0
            transition-colors duration-200 ${enabled ? "bg-[#A1BC98]" : "bg-[#D2DCB6]"}`}
        >
          <span className={`w-4 h-4 rounded-full bg-white shadow-sm
            transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
      {enabled && (
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-xs text-[#778873]">Remind me at</span>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[#D2DCB6] bg-[#F1F3E0]
              text-xs text-[#2d3328]
              focus:outline-none focus:ring-2 focus:ring-[#A1BC98]
              transition-all duration-150"
          />
        </div>
      )}
    </div>
  );
}

export default function ReminderSettings({ value, onChange }: ReminderSettingsProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <ReminderRow
        label="Morning reminder"
        description="Start your day with intention"
        icon={<Sun size={15} />}
        enabled={value.morningEnabled}
        time={value.morningTime}
        onToggle={() => onChange({ ...value, morningEnabled: !value.morningEnabled })}
        onTimeChange={(t) => onChange({ ...value, morningTime: t })}
      />
      <ReminderRow
        label="Night reminder"
        description="Review and close out your day"
        icon={<Moon size={15} />}
        enabled={value.nightEnabled}
        time={value.nightTime}
        onToggle={() => onChange({ ...value, nightEnabled: !value.nightEnabled })}
        onTimeChange={(t) => onChange({ ...value, nightTime: t })}
      />
    </div>
  );
}