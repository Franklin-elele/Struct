"use client";

// TaskSection — today's tasks list. Controlled: the parent owns the tasks
// and decides what happens on toggle.

import { ArrowRight } from "lucide-react";
import TaskItem from "./TaskItem";
import { Task } from "../../config/tasksData";

type TaskSectionProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onViewAll?: () => void;
};

export default function TaskSection({ tasks, onToggle, onViewAll }: TaskSectionProps) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-0.5">
            Today's Tasks
          </p>
          <p className="text-sm font-bold text-[#2d3328]">
            {completedCount}/{totalCount} completed
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-xs font-semibold
              text-[#778873] hover:text-[#2d3328] transition-colors duration-150 pb-0.5"
          >
            View all <ArrowRight size={13} />
          </button>
        )}
      </div>

      <div className="w-full h-1.5 bg-[#F1F3E0] rounded-full overflow-hidden border border-[#D2DCB6]">
        <div
          className="h-full bg-[#A1BC98] rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} />
        ))}

        {tasks.length === 0 && (
          <p className="text-sm text-[#a1bc98] text-center py-6">
            No tasks for today yet.
          </p>
        )}
      </div>
    </section>
  );
}