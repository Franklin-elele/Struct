"use client";

// app/dashboard/structure/page.tsx
// List, create, edit and archive structures

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Info, Layers } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import Loader from "@/app/components/Loader";
import EmptyState from "@/app/components/Dashboard/EmptyState";
import StructureCard from "@/app/components/Dashboard/Structure/StructureCard";
import StructureModal, {
  type StructureFormData,
} from "@/app/components/Dashboard/Structure/StructureModal";
import { Structure as CardStructure } from "@/app/components/config/structureData";
import {
  getStructures,
  createStructure,
  updateStructure,
  createHabit,
  updateHabit,
  deleteHabit,
  archiveStructureById,
} from "@/lib/services/structure.service";
import { getTodayTasks } from "@/lib/services/task.service";
import { getDayNumber } from "@/lib/dates";
import ConfirmModal from "@/app/components/ConfirmModal";

// Free plan = 1 active structure (the backend enforces this too)
const FREE_LIMIT = 1;

type ApiHabit = { _id: string; title: string; duration?: string };

type ApiStructure = {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "active" | "archived";
  habits: ApiHabit[];
};

type ApiTask = { _id: string; habitId: string; completed: boolean };

// null = closed, "create" = new, ApiStructure = editing that one
type ModalMode = null | "create" | ApiStructure;

const errorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) ? error.response?.data?.message ?? fallback : fallback;

export default function StructurePage() {
  const router = useRouter();
  const [structures, setStructures] = useState<ApiStructure[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [archiveTarget, setArchiveTarget] = useState<ApiStructure | null>(null);
  const [archiving, setArchiving] = useState(false);

  // Structures and tasks load in separate try blocks so one failure can't hide the other.
  // getTodayTasks also generates today's tasks for any new habits.
  const loadData = useCallback(async () => {
    try {
      const res = await getStructures();
      setStructures(res.data.structures);
    } catch (error) {
      console.error("Error loading structures: ", error);
    }

    try {
      const tasksRes = await getTodayTasks();
      setTasks(tasksRes.data.tasks);
    } catch (error) {
      console.error("Error loading tasks: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const active = structures.filter((s) => s.status === "active");
  const archived = structures.filter((s) => s.status === "archived");
  const atLimit = active.length >= FREE_LIMIT;

  // Real data -> the shape StructureCard expects
  const toCard = (s: ApiStructure): CardStructure => {
    const habits = s.habits ?? [];
    return {
      id: s._id,
      title: s.title,
      currentStreak: 0,
      todayCompleted: habits.filter((h) =>
        tasks.some((t) => t.habitId === h._id && t.completed),
      ).length,
      habits: habits.map((h) => ({
        id: h._id,
        title: h.title,
        timeTarget: h.duration,
      })),
    };
  };

  // ── Create: structure first (we need its id), then its habits ──
  const handleCreate = async (data: StructureFormData) => {
    let newId: string;
    try {
      const res = await createStructure({ title: data.title });
      newId = res.data.structure._id;
    } catch (error) {
      toast.error(errorMessage(error, "Could not create structure"));
      throw error; // keeps the modal open
    }

    try {
      for (const h of data.habits) {
        await createHabit(newId, {
          title: h.title,
          frequency: "daily",
          duration: h.timeTarget,
        });
      }
      toast.success("Structure created");
    } catch (error) {
      // The structure exists now, so don't throw: a retry would create a second one
      toast.error("Structure created, but some habits failed. Add them by editing it.");
    }
    await loadData();
  };

  // ── Edit: compare the modal's list against what was loaded ──
  const handleEdit = async (target: ApiStructure, data: StructureFormData) => {
    try {
      const originalIds = new Set(target.habits.map((h) => h._id));
      const keptIds = new Set(data.habits.map((h) => h.id));
      const calls: Promise<unknown>[] = [];

      if (data.title !== target.title) {
        calls.push(updateStructure(target._id, { title: data.title }));
      }

      for (const h of data.habits) {
        if (originalIds.has(h.id)) {
          calls.push(updateHabit(h.id, { title: h.title, duration: h.timeTarget ?? "" }));
        } else {
          calls.push(
            createHabit(target._id, { title: h.title, frequency: "daily", duration: h.timeTarget }),
          );
        }
      }

      for (const old of target.habits) {
        if (!keptIds.has(old._id)) calls.push(deleteHabit(old._id));
      }

      await Promise.all(calls);
      await loadData();
      toast.success("Structure updated");
    } catch (error) {
      toast.error(errorMessage(error, "Could not save changes"));
      throw error;
    }
  };

  const handleSave = async (data: StructureFormData) => {
    if (modalMode === "create") return handleCreate(data);
    if (modalMode) return handleEdit(modalMode, data);
  };

  // ── Archive: stops task generation for this structure ──
  const confirmArchive = async () => {
    if (!archiveTarget) return;
    try {
      await archiveStructureById(archiveTarget._id);
      await loadData();
      toast.success("Structure archived");
    } catch (error) {
      toast.error(errorMessage(error, "Could not archive structure"));
      throw error; // keeps the modal open
    }
  };

  const openCreate = () => {
    if (atLimit) router.push("/upgrade"); // placeholder until billing exists
    else setModalMode("create");
  };

  return (
    <DashboardLayout>
      {modalMode !== null && (
        <StructureModal
          initial={
            modalMode === "create"
              ? undefined
              : {
                title: modalMode.title,
                habits: modalMode.habits.map((h) => ({
                  id: h._id,
                  title: h.title,
                  timeTarget: h.duration,
                })),
              }
          }
          onSave={handleSave}
          onClose={() => setModalMode(null)}
        />
      )}
      {archiveTarget && (
        <ConfirmModal
          title={`Archive "${archiveTarget.title}"?`}
          description="This can't be undone. It will stop generating tasks and move to your archived list, and it won't come back. Your history is kept."
          confirmLabel="Archive structure"
          loadingLabel="Archiving..."
          onConfirm={confirmArchive}
          onClose={() => setArchiveTarget(null)}
        />
      )}

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">Structures</h2>
            <p className="text-sm text-[#778873] mt-0.5">
              Define the systems you follow daily.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150 bg-[#2d3328] text-[#F1F3E0]
              shadow-[3.5px_3px_0px_0px_#a1bc98] hover:shadow-[2px_2px_0px_0px_#778873]
              hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <Plus size={15} />
            Create
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Limit banner */}
            {atLimit && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F1F3E0] border border-[#D2DCB6]">
                <Info size={15} className="text-[#778873] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#4f5c49] leading-relaxed">
                  <span className="font-semibold text-[#2d3328]">
                    Free plan includes 1 structure.
                  </span>{" "}
                  Upgrade to Premium to run multiple structures in parallel.
                </p>
              </div>
            )}

            {/* Active structures */}
            {active.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No active structure"
                description="Create a structure to start building a disciplined daily system."
                actionLabel="Create your first structure"
                onAction={() => setModalMode("create")}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {active.map((s) => (
                  <StructureCard
                    key={s._id}
                    structure={toCard(s)}
                    dayNumber={getDayNumber(s.startDate)}
                    onEdit={() => setModalMode(s)}
                    onArchive={(card) =>
                      setArchiveTarget(structures.find((s) => s._id === card.id) ?? null)
                    }
                  />
                ))}
              </div>
            )}

            {/* Archived structures: read-only, the backend won't edit them */}
            {archived.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
                  Archived
                </p>
                {archived.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl
                      bg-[#F1F3E0] border border-[#D2DCB6]"
                  >
                    <span className="text-sm font-medium text-[#4f5c49]">{s.title}</span>
                    <span className="text-[11px] text-[#778873]">
                      {new Date(s.startDate).toLocaleDateString()} →{" "}
                      {new Date(s.endDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}