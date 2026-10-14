"use client";

// app/dashboard/structure/[id]/page.tsx
// Full detail for one structure: header, performance, habits, edit modal

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Clock, ArrowLeft, CalendarDays, TrendingUp, Layers, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import Loader from "@/app/components/Loader";
import EmptyState from "@/app/components/Dashboard/EmptyState";
import StructureModal, {
  type StructureFormData,
} from "@/app/components/Dashboard/Structure/StructureModal";
import {
  getStructureById,
  updateStructure,
  createHabit,
  updateHabit,
  deleteHabit,
} from "@/lib/services/structure.service";
import { getTodayTasks } from "@/lib/services/task.service";

type ApiStructure = {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
};

type ApiHabit = {
  _id: string;
  title: string;
  duration?: string;
};

type ApiTask = {
  _id: string;
  structureId: string;
  completed: boolean;
};

function StatCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 py-4">
      <div className="w-10 h-10 rounded-xl bg-[#F1F3E0] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-lg font-bold text-[#2d3328] leading-none">{value}</span>
      <span className="text-[10px] text-[#778873] font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

const MS_PER_DAY = 86400000;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export default function StructureDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // All hooks live inside the component, before any early return
  const [structure, setStructure] = useState<ApiStructure | null>(null);
  const [habits, setHabits] = useState<ApiHabit[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStructureById(id);
        setStructure(res.data.structure);
        setHabits(res.data.habits);
      } catch (error) {
        console.error("Error loading structure: ", error);
      }

      // Separate try so a tasks error can't hide the structure
      try {
        const tasksRes = await getTodayTasks();
        setTasks(tasksRes.data.tasks);
      } catch (error) {
        console.error("Error loading tasks: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (!structure) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={Layers}
            title="Structure not found"
            description="This structure doesn't exist or you don't have access to it."
            actionLabel="Back to structures"
            onAction={() => router.push("/dashboard/structure")}
          />
        </div>
      </DashboardLayout>
    );
  }

  // ── Numbers for display ──
  const myTasks = tasks.filter((t) => t.structureId === structure._id);
  const completedToday = myTasks.filter((t) => t.completed).length;
  const totalToday = myTasks.length;
  const completionPercent = totalToday
    ? Math.round((completedToday / totalToday) * 100)
    : 0;

  const today = startOfDay(new Date());
  const dayNumber = Math.min(
    90,
    Math.floor((today - startOfDay(new Date(structure.startDate))) / MS_PER_DAY) + 1,
  );
  const daysRemaining = Math.max(
    0,
    Math.round((startOfDay(new Date(structure.endDate)) - today) / MS_PER_DAY),
  );

  // ── Save from the modal: compare new list against the loaded one ──
  const handleSave = async (data: StructureFormData) => {
    try {
      const originalIds = new Set(habits.map((h) => h._id));
      const keptIds = new Set(data.habits.map((h) => h.id));
      const calls: Promise<unknown>[] = [];

      if (data.title !== structure.title) {
        calls.push(updateStructure(id, { title: data.title }));
      }

      for (const h of data.habits) {
        if (originalIds.has(h.id)) {
          // existing habit → update
          calls.push(updateHabit(h.id, { title: h.title, duration: h.timeTarget ?? "" }));
        } else {
          // new row from the modal (random id) → create
          calls.push(
            createHabit(id, { title: h.title, frequency: "daily", duration: h.timeTarget }),
          );
        }
      }

      // habits that were removed in the modal → delete
      for (const old of habits) {
        if (!keptIds.has(old._id)) calls.push(deleteHabit(old._id));
      }

      await Promise.all(calls);

      // Reload so the page shows what's really in the database
      const res = await getStructureById(id);
      setStructure(res.data.structure);
      setHabits(res.data.habits);
      toast.success("Structure updated");
    } catch (error) {
      console.error("Error saving structure: ", error);
      toast.error("Could not save changes");
      throw error; // tells the modal to stay open
    }
  };

  return (
    <DashboardLayout>
      {showModal && (
        <StructureModal
          initial={{
            title: structure.title,
            habits: habits.map((h) => ({
              id: h._id,
              title: h.title,
              timeTarget: h.duration,
            })),
          }}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/dashboard/structure")}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#778873]
            hover:text-[#2d3328] transition-colors duration-150 self-start"
        >
          <ArrowLeft size={13} /> All structures
        </button>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
                Structure
              </p>
              <h2 className="text-xl font-bold text-[#2d3328] leading-tight">
                {structure.title}
              </h2>
              <p className="text-[11px] text-[#a1bc98] font-medium mt-0.5">
                Day {dayNumber} of 90
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#D2DCB6]
                text-xs font-semibold text-[#778873] flex-shrink-0
                hover:border-[#A1BC98] hover:text-[#2d3328] hover:bg-[#F1F3E0]
                transition-all duration-150"
            >
              <Pencil size={12} /> Edit
            </button>
          </div>

          <div className="flex items-center justify-between px-3 py-2.5
            bg-[#F1F3E0] rounded-xl border border-[#D2DCB6]">
            <span className="text-xs text-[#778873] font-medium">Today's execution</span>
            <span
              className={`text-sm font-bold ${
                totalToday > 0 && completedToday === totalToday
                  ? "text-[#A1BC98]"
                  : "text-[#2d3328]"
              }`}
            >
              {completedToday}/{totalToday} done
            </span>
          </div>
        </div>

        {/* Performance card */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
            Performance
          </p>
          <div className="flex items-start divide-x divide-[#F1F3E0]">
            <StatCell
              icon={<TrendingUp size={16} className="text-[#A1BC98]" />}
              value={`${completionPercent}%`}
              label="Completion today"
            />
            <StatCell
              icon={<CalendarDays size={16} className="text-[#778873]" />}
              value={`${daysRemaining}d`}
              label="Days left"
            />
          </div>
        </div>

        {/* Habits card */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
            Habits
          </p>

          {habits.length === 0 ? (
            <p className="text-sm text-[#778873]">No habits in this structure yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {habits.map((habit) => (
                <li
                  key={habit._id}
                  className="flex items-center gap-2.5 p-3 rounded-xl
                    bg-[#F1F3E0] border border-[#D2DCB6]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A1BC98] flex-shrink-0" />
                  <span className="text-sm flex-1 text-[#4f5c49] font-medium">
                    {habit.title}
                  </span>
                  {habit.duration && (
                    <span
                      className="flex items-center gap-1 text-[10px] text-[#778873]
                        bg-white border border-[#D2DCB6] rounded-full px-1.5 py-0.5 flex-shrink-0"
                    >
                      <Clock size={9} />
                      {habit.duration}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}