"use client";

import { useState } from "react";
import { Zap, Clock } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import ProgressHeader from "@/app/components/Dashboard/Task/ProgressHeader";
import TaskGroup from "@/app/components/Dashboard/Task/TaskGroup";
import FocusMode from "@/app/components/Dashboard/Task/FocusMode";
import EditModal from "@/app/components/EditModal";
import {
  mockTasks,
  mockStructuresMeta,
  yesterdayStats,
  systemStreak,
  Task,
} from "@/app/components/config/tasksData";

export default function TasksPage() {
  const [tasks, setTasks]         = useState<Task[]>(mockTasks);
  const [focusMode, setFocusMode] = useState(false);

  // which task is being edited — null = modal closed
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // a COPY of the task's fields for the modal to work with
  // stays separate from the real task list until Save is clicked
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  // open modal — snapshot current task values into editValues
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setEditValues({
      title: task.title,
      time:  task.time ?? "",
    });
  };

  // Save clicked — write editValues back into the real task list
  const saveTask = () => {
    if (!editingTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? { ...t, title: editValues.title, time: editValues.time || undefined }
          : t
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount     = tasks.length;

  const tasksByStructure = mockStructuresMeta.map((structure) => ({
    structure,
    tasks: tasks.filter((t) => t.structureId === structure.id),
  }));

  return (
    <DashboardLayout>

      {focusMode && (
        <FocusMode
          tasks={tasks}
          onToggle={toggleTask}
          onExit={() => setFocusMode(false)}
        />
      )}

      {editingTask && (
        <EditModal
          title="Edit Task"
          readOnlyFields={[
            { label: "Structure", value: editingTask.structureTitle },
          ]}
          fields={[
            {
              key:         "title",
              label:       "Task title",
              placeholder: "e.g. Read for 1 hour",
            },
            {
              key:         "time",
              label:       "Time target",
              placeholder: "e.g. 1 hr, 30 min",
              optional:    true,
              icon:        <Clock size={11} />,
            },
          ]}
          values={editValues}
          onChange={(key, val) =>
            setEditValues((prev) => ({ ...prev, [key]: val }))
          }
          onSave={saveTask}
          onClose={() => setEditingTask(null)}
          saveDisabled={!editValues.title?.trim()}
        />
      )}

      <div className="flex flex-col gap-5 max-w-2xl mx-auto">

        <ProgressHeader
          completedCount={completedCount}
          totalCount={totalCount}
          systemStreak={systemStreak}
          yesterdayCompleted={yesterdayStats.completed}
          yesterdayTotal={yesterdayStats.total}
        />

        <button
          onClick={() => setFocusMode(true)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
            border-2 border-[#D2DCB6] text-[#778873] text-sm font-semibold
            hover:border-[#A1BC98] hover:text-[#2d3328] hover:bg-white
            transition-all duration-150"
        >
          <Zap size={15} />
          Enter focus mode
        </button>

        <div className="flex flex-col gap-6">
          {tasksByStructure.map(({ structure, tasks: groupTasks }) => (
            <TaskGroup
              key={structure.id}
              structureTitle={structure.title}
              structureStreak={structure.currentStreak}
              tasks={groupTasks}
              onToggle={toggleTask}
              onEdit={openEdit}
            />
          ))}
        </div>

        {completedCount === totalCount && totalCount > 0 && (
          <div className="text-center py-8 flex flex-col items-center gap-2">
            <p className="text-2xl">◈</p>
            <p className="text-sm font-semibold text-[#2d3328]">All tasks done.</p>
            <p className="text-xs text-[#778873]">
              Consistent execution. That's the system working.
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}