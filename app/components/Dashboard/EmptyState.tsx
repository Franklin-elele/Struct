import { Layers, ArrowRight, type LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon: Icon = Layers,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 bg-white rounded-2xl border border-[#D2DCB6] shadow-[4px_4px_0px_0px_#d2dcb6] px-6 py-12">
      <div className="w-16 h-16 rounded-2xl bg-[#D2DCB6] flex items-center justify-center">
        <Icon size={28} className="text-[#778873]" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[#2d3328] tracking-tight">{title}</h3>
        <p className="text-base text-[#778873] mt-2 max-w-sm">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 flex items-center gap-2 py-3 px-6 rounded-xl bg-[#2d3328] text-[#F1F3E0] text-sm font-semibold
            shadow-[5px_4px_0px_1px_#a1bc98]
            hover:shadow-[2px_2px_0px_1px_#778873] hover:translate-x-[3px] hover:translate-y-[2px]
            transition-all duration-150"
        >
          {actionLabel} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}