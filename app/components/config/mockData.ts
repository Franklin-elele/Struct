// mockData.ts — updated with streak fields and richer structure model
// Replace with API responses later — shapes stay the same

export type Habit = {
  id: string;
  title: string;
  timeTarget?: string;
  completed: boolean;
};

export type Structure = {
  id: string;
  title: string;
  habits: Habit[];
  streakEnabled: boolean;   // whether streak tracking is on
  currentStreak: number;    // days in a row with at least 1 task done
  lastCompletedDate: string; // ISO date string — mock for now
};

export type Task = {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
  structureId: string;
};

export type Stats = {
  streakDays: number;
  completedToday: number;
  totalToday: number;
  overallPercent: number;
};

// ── Structures — max 2 enforced in UI ──
export const mockStructures: Structure[] = [
  {
    id: "s1",
    title: "Study Daily",
    streakEnabled: true,
    currentStreak: 7,
    lastCompletedDate: "2025-04-03",
    habits: [
      { id: "h1", title: "Read for 1 hour",    timeTarget: "1 hr",   completed: true  },
      { id: "h2", title: "Flashcard review",   timeTarget: "30 min", completed: true  },
      { id: "h3", title: "Practice problems",                         completed: false },
      { id: "h4", title: "Review lecture notes",timeTarget: "20 min", completed: false },
    ],
  },
  {
    id: "s2",
    title: "Build Every Day",
    streakEnabled: true,
    currentStreak: 4,
    lastCompletedDate: "2025-04-03",
    habits: [
      { id: "h5", title: "Code for 2 hours",     timeTarget: "2 hrs", completed: true  },
      { id: "h6", title: "Ship something small",                       completed: false },
      { id: "h7", title: "Read tech article",    timeTarget: "15 min", completed: false },
    ],
  },
];

// ── Today's tasks ──
export const mockTasks: Task[] = [
  { id: "t1", title: "Read for 1 hour",      time: "1 hr",   completed: true,  structureId: "s1" },
  { id: "t2", title: "Flashcard review",     time: "30 min", completed: true,  structureId: "s1" },
  { id: "t3", title: "Practice problems",                    completed: false, structureId: "s1" },
  { id: "t4", title: "Review lecture notes", time: "20 min", completed: false, structureId: "s1" },
  { id: "t5", title: "Code for 2 hours",     time: "2 hrs",  completed: true,  structureId: "s2" },
  { id: "t6", title: "Ship something small",                 completed: false, structureId: "s2" },
  { id: "t7", title: "Read tech article",    time: "15 min", completed: false, structureId: "s2" },
];

export const mockStats: Stats = {
  streakDays:      7,
  completedToday:  3,
  totalToday:      7,
  overallPercent:  43,
};

// ── Max structures constant — single source of truth ──
export const MAX_STRUCTURES = 2;