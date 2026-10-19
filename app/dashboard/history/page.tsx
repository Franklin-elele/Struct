"use client";

// app/dashboard/history/page.tsx
// Read-only look back at the last 30 days

import { useState, useEffect, useCallback } from "react";
import { History as HistoryIcon } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import Loader from "@/app/components/Loader";
import EmptyState from "@/app/components/Dashboard/EmptyState";
import HistorySummaryCard from "@/app/components/Dashboard/History/HistorySummaryCard";
import HistoryDayCard from "@/app/components/Dashboard/History/HistoryDayCard";
import { DayRecord, HistorySummary } from "@/app/components/config/historyData";
import { getTaskHistory } from "@/lib/services/task.service";

const RANGE_DAYS = 30;

export default function HistoryPage() {
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [summary, setSummary] = useState<HistorySummary>({
    daysTracked: 0,
    totalCompleted: 0,
    avgCompletion: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setFailed(false);
    try {
      const res = await getTaskHistory(RANGE_DAYS);
      const list: DayRecord[] = res.data.records;
      setRecords(list);
      setSummary({
        daysTracked: list.length,
        totalCompleted: res.data.summary.totalCompleted,
        avgCompletion: res.data.summary.avgCompletion,
      });
    } catch (error) {
      console.error("Error loading history: ", error);
      setFailed(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">

        {/* Page header */}
        <div>
          <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">History</h2>
          <p className="text-sm text-[#778873] mt-0.5">
            Track your consistency over time.
          </p>
        </div>

        {isLoading ? (
          <Loader />
        ) : failed ? (
          <EmptyState
            icon={HistoryIcon}
            title="Couldn't load your history"
            description="Something went wrong while loading your past days."
            actionLabel="Try again"
            onAction={load}
          />
        ) : records.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No history yet"
            description="Your past days show up here. Today's tasks appear tomorrow, so come back after your first full day."
          />
        ) : (
          <>
            <HistorySummaryCard summary={summary} days={RANGE_DAYS} />

            <section className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
                Past days
              </p>
              <div className="flex flex-col gap-3">
                {records.map((record) => (
                  <HistoryDayCard key={record.date} record={record} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}