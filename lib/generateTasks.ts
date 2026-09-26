import structureSchema from "@/lib/modals/structure.modal";
import habitSchema from "@/lib/modals/habit.modal";
import taskSchema from "@/lib/modals/task.modal";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isHabitDueToday(habit: any, today: Date) {
  if (habit.frequency === "daily") return true;
  if (habit.frequency === "custom") {
    const todayName = DAY_NAMES[today.getDay()];
    return habit.customDays?.includes(todayName);
  }
  return false;
}

export async function generateTasksForUser(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeStructures = await structureSchema.find({ userId, status: "active" });
  const structureIds = activeStructures.map((s) => s._id);

  const habits = await habitSchema.find({ structureId: { $in: structureIds } });

  for (const habit of habits) {
    if (!isHabitDueToday(habit, today)) continue;

    const exists = await taskSchema.findOne({ habitId: habit._id, date: today });
    if (exists) continue;

    await taskSchema.create({
      habitId: habit._id,
      structureId: habit.structureId,
      userId,
      date: today,
      title: habit.title,
      completed: false,
    });
  }
}