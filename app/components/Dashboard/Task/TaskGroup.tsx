// TaskGroup — updated to pass onEdit down to TaskItem

import { Flame } from "lucide-react";
import TaskItem from "./TaskItem";
import { Task } from "../../config/tasksData";

type TaskGroupProps = {
  structureTitle: string;
  structureStreak: number;
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void; // passed through to TaskItem
};

export default function TaskGroup({
  structureTitle,
  structureStreak,
  tasks,
  onToggle,
  onEdit,
}: TaskGroupProps) {
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col gap-3">

      {/* ── Group header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A1BC98] flex-shrink-0" />
          <h3 className="text-sm font-bold text-[#2d3328]">{structureTitle}</h3>
        </div>
        <div className="flex items-center gap-2">
          {structureStreak > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-semibold
              text-[#778873] bg-[#F1F3E0] border border-[#D2DCB6] rounded-full px-2 py-0.5">
              <Flame size={10} />
              {structureStreak}d
            </div>
          )}
          <span className="text-xs font-medium text-[#a1bc98]">
            {completed}/{tasks.length}
          </span>
        </div>
      </div>

      {/* ── Task list ── */}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}