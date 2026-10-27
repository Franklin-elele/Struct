"use client";

// app/dashboard/tasks/page.tsx
// Today's tasks, grouped by structure, with focus mode

import { useState, useEffect } from "react";
import { Zap, ListChecks } from "lucide-react";
import { useRouter } from "next/navigation";
// import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import Loader from "@/app/components/Loader";
import EmptyState from "@/app/components/Dashboard/EmptyState";
import ProgressHeader from "@/app/components/Dashboard/Task/ProgressHeader";
import TaskGroup from "@/app/components/Dashboard/Task/TaskGroup";
import FocusMode from "@/app/components/Dashboard/Task/FocusMode";
import { Task } from "@/app/components/config/tasksData";
import { getTodayTasks } from "@/lib/services/task.service";
import { getStructures } from "@/lib/services/structure.service";
import { useToggleTask } from "@/hooks/useToggleTask";

type ApiTask = {
  _id: string;
  structureId: string;
  title: string;
  duration?: string;
  completed: boolean;
};

type ApiStructure = {
  _id: string;
  title: string;
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [structures, setStructures] = useState<ApiStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  const toggleTask = useToggleTask(setTasks);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTodayTasks();
        setTasks(res.data.tasks);
      } catch (error) {
        console.error("Error loading tasks: ", error);
      }

      // separate try so one failure can't hide the other
      try {
        const res = await getStructures();
        setStructures(res.data.structures);
      } catch (error) {
        console.error("Error loading structures: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const titleOf = (structureId: string) =>
    structures.find((s) => s._id === structureId)?.title ?? "";

  // Real data -> the shape the existing task components expect
  const viewTasks: Task[] = tasks.map((t) => ({
  id: t._id,
  title: t.title,
  completed: t.completed,
  time: t.duration,
  structureId: t.structureId,
  structureTitle: titleOf(t.structureId),
}));

  const completedCount = viewTasks.filter((t) => t.completed).length;
  const totalCount = viewTasks.length;

  // Only structures that have tasks today get a group
  const groups = structures
    .map((s) => ({
      structure: s,
      tasks: viewTasks.filter((t) => t.structureId === s._id),
    }))
    .filter((g) => g.tasks.length > 0);

  return (
    <>
      {focusMode && (
        <FocusMode
          tasks={viewTasks}
          onToggle={toggleTask}
          onExit={() => setFocusMode(false)}
        />
      )}

      <div className="flex flex-col gap-5 max-w-2xl mx-auto">
        {isLoading ? (
          <Loader />
        ) : totalCount === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No tasks today"
            description="Tasks come from the habits in your active structure. Create a structure and add habits to get started."
            actionLabel="Go to structures"
            onAction={() => router.push("/dashboard/structure")}
          />
        ) : (
          <>
            <ProgressHeader
              completedCount={completedCount}
              totalCount={totalCount}
              systemStreak={0}
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
              {groups.map(({ structure, tasks: groupTasks }) => (
                <TaskGroup
                  key={structure._id}
                  structureTitle={structure.title}
                  structureStreak={0}
                  tasks={groupTasks}
                  onToggle={toggleTask}
                />
              ))}
            </div>

            {completedCount === totalCount && (
              <div className="text-center py-8 flex flex-col items-center gap-2">
                <p className="text-2xl">◈</p>
                <p className="text-sm font-semibold text-[#2d3328]">All tasks done.</p>
                <p className="text-xs text-[#778873]">
                  Consistent execution. That's the system working.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}