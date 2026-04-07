"use client";

// app/dashboard/history/page.tsx
// Reflection page — read past performance, delete single days or all history
// HistoryList is inlined here (too small to justify its own file)

import { useState } from "react";
import { Trash2 } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import HistorySummaryCard from "@/app/components/Dashboard/History/HistorySummaryCard";
import HistoryDayCard from "@/app/components/Dashboard/History/HistoryDayCard";
import ConfirmModal from "@/app/components/ConfirmModal";
import { mockHistory, mockSummary, DayRecord } from "@/app/components/config/historyData";

// What the confirm modal is targeting
// "day" = one specific day, "all" = entire history
type DeleteTarget = { type: "day"; date: string } | { type: "all" };

export default function HistoryPage() {
  const [records, setRecords] = useState<DayRecord[]>(mockHistory);

  // deleteTarget — null means modal is closed
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  // removes a single day from records
  const deleteDay = (date: string) => {
    setRecords((prev) => prev.filter((r) => r.date !== date));
  };

  // clears all records
  const clearAll = () => {
    setRecords([]);
  };

  // called when user confirms in modal — dispatches correct action
  const handleConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "day") deleteDay(deleteTarget.date);
    if (deleteTarget.type === "all") clearAll();
  };

  return (
    <DashboardLayout>

      {/* ── Confirm modal — only mounts when a delete is pending ── */}
      {deleteTarget && (
        <ConfirmModal
          title={
            deleteTarget.type === "all"
              ? "Clear all history?"
              : "Delete this day?"
          }
          description={
            deleteTarget.type === "all"
              ? "This will permanently remove all your past records. This cannot be undone."
              : "This will remove this day's record from your history. This cannot be undone."
          }
          confirmLabel={deleteTarget.type === "all" ? "Clear all" : "Delete"}
          onConfirm={handleConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">
              History
            </h2>
            <p className="text-sm text-[#778873] mt-0.5">
              Track your consistency over time.
            </p>
          </div>

          {/* Clear all — only shown when records exist */}
          {records.length > 0 && (
            <button
              onClick={() => setDeleteTarget({ type: "all" })}
              className="flex items-center gap-1.5 text-xs font-semibold
                text-[#D2DCB6] hover:text-red-400 transition-colors duration-150
                px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={13} />
              Clear all
            </button>
          )}
        </div>

        {/* ── Summary strip ── */}
        <HistorySummaryCard summary={mockSummary} />

        {/* ── Daily records — inlined, too small for its own component ── */}
        <section className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
            Past days
          </p>

          {records.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-[#a1bc98]">No history yet. Start executing.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {records.map((record) => (
                <HistoryDayCard
                  key={record.date}
                  record={record}
                  onDelete={(date) => setDeleteTarget({ type: "day", date })}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
}