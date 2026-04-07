// TaskItem — updated with edit button (pencil icon)
// No delete button — tasks are system-generated
// onEdit opens the EditTaskModal in the parent

import { CheckCircle2, Circle, Clock, Pencil } from "lucide-react";
import { Task } from "../../config/tasksData";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void; // triggers modal in parent
};

export default function TaskItem({ task, onToggle, onEdit }: TaskItemProps) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border
      transition-all duration-150
      ${task.completed
        ? "bg-[#F1F3E0] border-[#D2DCB6]"
        : "bg-white border-[#D2DCB6] hover:border-[#A1BC98] hover:shadow-sm"
      }`}
    >
      {/* Checkbox — clicking this area toggles completion */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 focus:outline-none"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed
          ? <CheckCircle2 size={18} className="text-[#A1BC98]" />
          : <Circle       size={18} className="text-[#D2DCB6]"  />
        }
      </button>

      {/* Title — takes remaining space */}
      <span className={`flex-1 text-sm font-medium transition-all duration-150 ${
        task.completed ? "line-through text-[#a1bc98]" : "text-[#2d3328]"
      }`}>
        {task.title}
      </span>

      {/* Optional time badge */}
      {task.time && (
        <span className="flex items-center gap-1 text-[10px] text-[#778873]
          bg-[#F1F3E0] border border-[#D2DCB6] rounded-full px-2 py-0.5 flex-shrink-0">
          <Clock size={9} />
          {task.time}
        </span>
      )}

      {/* Edit button — opens modal, never deletes */}
      <button
        onClick={() => onEdit(task)}
        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0
          text-[#D2DCB6] hover:text-[#778873] hover:bg-[#F1F3E0]
          transition-all duration-150"
        aria-label="Edit task"
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}