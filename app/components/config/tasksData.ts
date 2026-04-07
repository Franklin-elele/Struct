// tasksData.ts — mock data for the Tasks page
// Tasks are generated from structures — not manually created
// Replace with API responses later

export type Task = {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
  structureId: string;
  structureTitle: string; // denormalized for easy grouping
};

export type StructureMeta = {
  id: string;
  title: string;
  currentStreak: number;
};

export const mockStructuresMeta: StructureMeta[] = [
  { id: "s1", title: "Study Daily",    currentStreak: 7 },
  { id: "s2", title: "Build Every Day", currentStreak: 4 },
];

export const mockTasks: Task[] = [
  // Study Daily
  { id: "t1", title: "Read for 1 hour",      time: "1 hr",   completed: true,  structureId: "s1", structureTitle: "Study Daily"     },
  { id: "t2", title: "Flashcard review",      time: "30 min", completed: true,  structureId: "s1", structureTitle: "Study Daily"     },
  { id: "t3", title: "Practice problems",                     completed: false, structureId: "s1", structureTitle: "Study Daily"     },
  { id: "t4", title: "Review lecture notes",  time: "20 min", completed: false, structureId: "s1", structureTitle: "Study Daily"     },
  // Build Every Day
  { id: "t5", title: "Code for 2 hours",      time: "2 hrs",  completed: true,  structureId: "s2", structureTitle: "Build Every Day" },
  { id: "t6", title: "Ship something small",                  completed: false, structureId: "s2", structureTitle: "Build Every Day" },
  { id: "t7", title: "Read tech article",     time: "15 min", completed: false, structureId: "s2", structureTitle: "Build Every Day" },
];

// Yesterday mock — subtle feedback only
export const yesterdayStats = { completed: 5, total: 7 };

// System streak = min of all structure streaks
export const systemStreak = Math.min(
  ...mockStructuresMeta.map((s) => s.currentStreak)
); // → 4