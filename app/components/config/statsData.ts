// statsData.ts — mock data for the Statistics page
// All stats are derived from tasks, not structures
// Structures only track streaks — completion lives on tasks

export type DayActivity = {
  date: string;       // ISO "2026-04-07"
  tasksCreated: number;
  tasksCompleted: number;
  // "completed" = at least 1 task done
  // "missed"    = tasks were created but none completed
  // "empty"     = no tasks created that day
};

export type StructureStat = {
  id: string;
  title: string;
  currentStreak: number;
  longestStreak: number;
  totalTasksCreated: number;
  totalTasksCompleted: number;
  // completion rate = totalTasksCompleted / totalTasksCreated
};

export type Insight = {
  id: string;
  text: string;
};

// ── Last 7 days activity — Mon to Sun ──
export const mockWeekActivity: DayActivity[] = [
  { date: "2026-03-31", tasksCreated: 5, tasksCompleted: 5 }, // Mon — perfect
  { date: "2026-04-01", tasksCreated: 5, tasksCompleted: 4 }, // Tue — partial
  { date: "2026-04-02", tasksCreated: 5, tasksCompleted: 0 }, // Wed — missed
  { date: "2026-04-03", tasksCreated: 5, tasksCompleted: 5 }, // Thu — perfect
  { date: "2026-04-04", tasksCreated: 5, tasksCompleted: 3 }, // Fri — partial
  { date: "2026-04-05", tasksCreated: 0, tasksCompleted: 0 }, // Sat — empty
  { date: "2026-04-06", tasksCreated: 5, tasksCompleted: 5 }, // Sun — perfect
];

// ── Structure long-term performance ──
export const mockStructureStats: StructureStat[] = [
  {
    id: "s1",
    title: "Study Daily",
    currentStreak: 7,
    longestStreak: 14,
    totalTasksCreated: 84,
    totalTasksCompleted: 71,
  },
  {
    id: "s2",
    title: "Build Every Day",
    currentStreak: 4,
    longestStreak: 9,
    totalTasksCreated: 63,
    totalTasksCompleted: 48,
  },
];

// ── Overview numbers ──
export const mockOverview = {
  totalCompleted:   119,   // all-time tasks completed
  weeklyRate:        80,   // % of last 7 days with completed tasks
  activeStructures:   2,
  bestStreak:        14,   // across all structures
};

// ── Insights — derived from data, simple logic ──
// In real app: compute these from actual task history
export const mockInsights: Insight[] = [
  { id: "i1", text: "You are most consistent on Mondays." },
  { id: "i2", text: "You missed 1 day this week." },
  { id: "i3", text: "Your longest streak is 14 days — keep pushing." },
  { id: "i4", text: "Study Daily has a higher completion rate than Build Every Day." },
];

// ── Day status helper ──
// Determines how a day should be displayed in the weekly chart
export type DayStatus = "perfect" | "partial" | "missed" | "empty";

export function getDayStatus(day: DayActivity): DayStatus {
  if (day.tasksCreated === 0) return "empty";
  if (day.tasksCompleted === 0) return "missed";
  if (day.tasksCompleted === day.tasksCreated) return "perfect";
  return "partial";
}

// short weekday label from ISO date string
export function getWeekdayLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}