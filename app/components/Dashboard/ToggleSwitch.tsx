// ToggleSwitch — reusable on/off toggle
// Used for dark mode, notifications, and any future boolean settings

type ToggleSwitchProps = {
  enabled: boolean;
  onToggle: () => void;
  ariaLabel: string;
};

export default function ToggleSwitch({ enabled, onToggle, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={onToggle}
      className={`w-11 h-6 rounded-full flex items-center px-0.5
        transition-colors duration-200 flex-shrink-0
        ${enabled ? "bg-[#778873]" : "bg-[#D2DCB6] dark:bg-zinc-600"}`}
    >
      <span
        className={`w-5 h-5 rounded-full bg-white shadow-sm
          transition-transform duration-200
          ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}