import structureSchema from "@/lib/modals/structure.modal";
import habitSchema from "@/lib/modals/habit.modal";
import taskSchema from "@/lib/modals/task.modal";
import { getToday } from "@/lib/timezone";

function isHabitDueToday(habit: any, dayName: string) {
  if (habit.frequency === "daily") return true;
  if (habit.frequency === "custom") return !!habit.customDays?.includes(dayName);
  return false;
}

export async function generateTasksForUser(userId: string, timezone?: string | null) {
  const { start: today, dayName } = getToday(timezone);

  const activeStructures = await structureSchema.find({ userId, status: "active" });
  const structureIds = activeStructures.map((s) => s._id);

  const habits = await habitSchema.find({ structureId: { $in: structureIds } });

  for (const habit of habits) {
    if (!isHabitDueToday(habit, dayName)) continue;

    await taskSchema.updateOne(
      { habitId: habit._id, date: today },
      {
        $set: { duration: habit.duration ?? "" },
        $setOnInsert: {
          structureId: habit.structureId,
          userId,
          title: habit.title,
          completed: false,
        },
      },
      { upsert: true },
    );
  }
}