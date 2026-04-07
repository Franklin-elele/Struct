// HistorySummary — top stats strip: best streak, current streak, avg completion
// Reusable on Statistics page later

import { Flame, TrendingUp, Trophy } from "lucide-react";
import { HistorySummary } from "@/app/components/config/historyData";

type HistorySummaryProps = {
  summary: HistorySummary;
};

function SummaryCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="w-9 h-9 rounded-xl bg-[#F1F3E0] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-lg font-bold text-[#2d3328] leading-none">{value}</span>
      <span className="text-[10px] text-[#778873] font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function HistorySummaryCard({ summary }: HistorySummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5">

      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
          All time
        </p>
        <h3 className="text-base font-bold text-[#2d3328]">Your consistency</h3>
      </div>

      <div className="flex items-start gap-2">
        <SummaryCell
          icon={<Trophy size={16} className="text-[#778873]" />}
          value={`${summary.bestStreak}d`}
          label="Best streak"
        />
        <div className="w-px self-stretch bg-[#F1F3E0]" />
        <SummaryCell
          icon={<Flame size={16} className="text-[#778873]" />}
          value={`${summary.currentStreak}d`}
          label="Current streak"
        />
        <div className="w-px self-stretch bg-[#F1F3E0]" />
        <SummaryCell
          icon={<TrendingUp size={16} className="text-[#A1BC98]" />}
          value={`${summary.avgCompletion}%`}
          label="Avg completion"
        />
      </div>
    </div>
  );
}