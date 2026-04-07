// Step 4 — Reminder Settings: wraps the reusable ReminderSettings component

import ReminderSettings, { ReminderConfig } from "../Inputs/ReminderSettings";

type Step4Props = {
  reminders: ReminderConfig;
  onChange: (updated: ReminderConfig) => void;
};

export default function Step4ReminderSettings({ reminders, onChange }: Step4Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">
          Set your reminders
        </h2>
        <p className="text-sm text-[#778873] mt-1">
          Optional nudges to keep you on track. You can change these later.
        </p>
      </div>

      <ReminderSettings value={reminders} onChange={onChange} />

      {/* Skip note */}
      <p className="text-xs text-center text-[#a1bc98]">
        You can skip this — reminders can be configured from settings anytime.
      </p>
    </div>
  );
}