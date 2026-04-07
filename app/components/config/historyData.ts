// historyData.ts — mock past performance data
// Shape matches what the API will return later
// Each entry = one day's execution record

export type StructureRecord = {
  title: string;
  completed: number;
  total: number;
};

export type DayRecord = {
  date: string; // ISO format: "2026-04-06"
  structures: StructureRecord[];
};

export type HistorySummary = {
  bestStreak: number;
  currentStreak: number;
  avgCompletion: number; // percentage 0–100
};

export const mockHistory: DayRecord[] = [
  {
    date: "2026-04-06",
    structures: [
      { title: "Study Daily",    completed: 3, total: 4 },
      { title: "Build Every Day", completed: 2, total: 3 },
    ],
  },
  {
    date: "2026-04-05",
    structures: [
      { title: "Study Daily",    completed: 4, total: 4 },
      { title: "Build Every Day", completed: 3, total: 3 },
    ],
  },
  {
    date: "2026-04-04",
    structures: [
      { title: "Study Daily",    completed: 2, total: 4 },
      { title: "Build Every Day", completed: 1, total: 3 },
    ],
  },
  {
    date: "2026-04-03",
    structures: [
      { title: "Study Daily",    completed: 4, total: 4 },
      { title: "Build Every Day", completed: 3, total: 3 },
    ],
  },
  {
    date: "2026-04-02",
    structures: [
      { title: "Study Daily",    completed: 3, total: 4 },
      { title: "Build Every Day", completed: 2, total: 3 },
    ],
  },
  {
    date: "2026-04-01",
    structures: [
      { title: "Study Daily",    completed: 1, total: 4 },
      { title: "Build Every Day", completed: 0, total: 3 },
    ],
  },
  {
    date: "2026-03-31",
    structures: [
      { title: "Study Daily",    completed: 4, total: 4 },
      { title: "Build Every Day", completed: 3, total: 3 },
    ],
  },
];

export const mockSummary: HistorySummary = {
  bestStreak:    7,
  currentStreak: 4,
  avgCompletion: 74,
};

// ── Completion level helper ──
// Used to pick the right color indicator per structure record
export type CompletionLevel = "full" | "partial" | "low";

export function getCompletionLevel(completed: number, total: number): CompletionLevel {
  const ratio = total > 0 ? completed / total : 0;
  if (ratio === 1)    return "full";
  if (ratio >= 0.5)   return "partial";
  return "low";
}