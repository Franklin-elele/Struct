"use client";

// app/dashboard/structure/page.tsx
// Users view, create and edit their structures here
// Max 2 structures enforced in UI

import { useState } from "react";
import { Plus, Info } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import StructureCard from "@/app/components/Dashboard/Structure/StructureCard";
import StructureModal from "@/app/components/Dashboard/Structure/StructureModal";
import {
  mockStructures,
  Structure,
  MAX_STRUCTURES,
} from "@/app/components/config/structureData";

// modal mode — null = closed, "create" = new, Structure = edit existing
type ModalMode = null | "create" | Structure;

export default function StructurePage() {
  const [structures, setStructures] = useState<Structure[]>(mockStructures);
  const [modalMode, setModalMode]   = useState<ModalMode>(null);

  const atLimit = structures.length >= MAX_STRUCTURES;

  // save handler — handles both create and edit
  const handleSave = (
    data: Omit<Structure, "id" | "currentStreak" | "todayCompleted">
  ) => {
    if (modalMode === "create") {
      // create — append with generated id and default stats
      const newStructure: Structure = {
        ...data,
        id:             Math.random().toString(36).slice(2, 9),
        currentStreak:  0,
        todayCompleted: 0,
      };
      setStructures((prev) => [...prev, newStructure]);
    } else if (typeof modalMode === "object" && modalMode !== null) {
      // edit — replace existing by id
      setStructures((prev) =>
        prev.map((s) =>
          s.id === modalMode.id
            ? { ...s, ...data }
            : s
        )
      );
    }
  };

  return (
    <DashboardLayout>

      {/* ── Modal ── */}
      {modalMode !== null && (
        <StructureModal
          initial={typeof modalMode === "object" ? modalMode : undefined}
          onSave={handleSave}
          onClose={() => setModalMode(null)}
        />
      )}

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">
              Structures
            </h2>
            <p className="text-sm text-[#778873] mt-0.5">
              Define the systems you follow daily.
            </p>
          </div>

          {/* Create button */}
          <button
            onClick={() => {
              if (!atLimit) setModalMode("create");
            }}
            disabled={atLimit}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150
              ${!atLimit
                ? "bg-[#2d3328] text-[#F1F3E0] shadow-[4px_4px_0px_0px_#a1bc98] hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]"
                : "bg-[#D2DCB6] text-[#a1bc98] cursor-not-allowed"
              }`}
          >
            <Plus size={15} />
            Create
          </button>
        </div>

        {/* ── Limit banner — shown when at max ── */}
        {atLimit && (
          <div className="flex items-start gap-3 p-4 rounded-xl
            bg-[#F1F3E0] border border-[#D2DCB6]">
            <Info size={15} className="text-[#778873] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#4f5c49] leading-relaxed">
              <span className="font-semibold text-[#2d3328]">
                Struct is designed for focus.
              </span>{" "}
              You can only run 2 structures at a time.
            </p>
          </div>
        )}

        {/* ── Structures list ── */}
        {structures.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <p className="text-3xl">◈</p>
            <p className="text-sm font-semibold text-[#2d3328]">No structures yet.</p>
            <p className="text-xs text-[#778873] max-w-xs">
              Create your first structure to start building a disciplined daily system.
            </p>
            <button
              onClick={() => setModalMode("create")}
              className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-[#2d3328] text-[#F1F3E0] text-sm font-semibold
                shadow-[4px_4px_0px_0px_#a1bc98]
                hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]
                transition-all duration-150"
            >
              <Plus size={15} />
              Create your first structure
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {structures.map((structure) => (
              <StructureCard
                key={structure.id}
                structure={structure}
                onEdit={(s) => setModalMode(s)}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}