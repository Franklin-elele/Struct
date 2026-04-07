// structureData.ts — types and mock data for the Structure page

export type HabitItem = {
  id: string;
  title: string;
  timeTarget?: string;
};

export type StructureReminders = {
  morningEnabled: boolean;
  morningTime: string;
  nightEnabled: boolean;
  nightTime: string;
};

export type Structure = {
  id: string;
  title: string;
  habits: HabitItem[];
  reminders: StructureReminders;
  currentStreak: number;
  todayCompleted: number;   // how many habits done today
};

export const MAX_STRUCTURES = 2;

export const mockStructures: Structure[] = [
  {
    id: "s1",
    title: "Study Daily",
    currentStreak: 7,
    todayCompleted: 2,
    reminders: {
      morningEnabled: true,
      morningTime: "08:00",
      nightEnabled: false,
      nightTime: "21:00",
    },
    habits: [
      { id: "h1", title: "Read for 1 hour",     timeTarget: "1 hr"   },
      { id: "h2", title: "Flashcard review",    timeTarget: "30 min" },
      { id: "h3", title: "Practice problems",   timeTarget: "1 hr"   },
      { id: "h4", title: "Review lecture notes",timeTarget: "20 min" },
    ],
  },
  {
    id: "s2",
    title: "Build Every Day",
    currentStreak: 4,
    todayCompleted: 1,
    reminders: {
      morningEnabled: false,
      morningTime: "08:00",
      nightEnabled: true,
      nightTime: "21:00",
    },
    habits: [
      { id: "h5", title: "Code for 2 hours",    timeTarget: "2 hrs"  },
      { id: "h6", title: "Ship something small"                       },
      { id: "h7", title: "Read tech article",   timeTarget: "15 min" },
    ],
  },
];

// empty reminder defaults for new structure modal
export const DEFAULT_REMINDERS: StructureReminders = {
  morningEnabled: false,
  morningTime: "08:00",
  nightEnabled: false,
  nightTime: "21:00",
};