// historyData.ts — types and helpers for the History page

export type StructureRecord = {
  title: string;
  completed: number;
  total: number;
};

export type DayRecord = {
  date: string; // "2026-10-15" (the user's local day)
  structures: StructureRecord[];
};

export type HistorySummary = {
  daysTracked: number;
  totalCompleted: number;
  avgCompletion: number;
};

// Used to pick the colour indicator for a record
export type CompletionLevel = "full" | "partial" | "low";

export function getCompletionLevel(completed: number, total: number): CompletionLevel {
  const ratio = total > 0 ? completed / total : 0;
  if (ratio === 1) return "full";
  if (ratio >= 0.5) return "partial";
  return "low";
}