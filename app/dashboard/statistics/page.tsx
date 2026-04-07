"use client";

// app/dashboard/statistics/page.tsx
// Statistics = reflection on long-term discipline
// All numbers derived from tasks, not structures
// Structures only appear here for streak/rate context

import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import StatCard from "@/app/components/Dashboard/Stats/StatCard";
import StructureStatCard from "@/app/components/Dashboard/Stats/StructureStatCard";
import WeeklyChart from "@/app/components/Dashboard/Stats/WeeklyChart";
import {
  mockOverview,
  mockStructureStats,
  mockWeekActivity,
  mockInsights,
} from "@/app/components/config/statsData";
import {
  CheckSquare,
  TrendingUp,
  Layers,
  Trophy,
  Lightbulb,
} from "lucide-react";

const hasData = mockStructureStats.length > 0;

export default function StatisticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">

        {/* ── Page header ── */}
        <div>
          <h2
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Statistics
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Your discipline, measured over time.
          </p>
        </div>

        {/* ── Empty state ── */}
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <p className="text-3xl">◈</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Nothing to show yet.
            </p>
            <p
              className="text-xs max-w-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Start completing tasks to see your stats appear here.
            </p>
          </div>
        ) : (
          <>
            {/* ── Section 1: Overview grid ── */}
            <section className="flex flex-col gap-3">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}
              >
                Overview
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  icon={CheckSquare}
                  label="Tasks completed"
                  value={mockOverview.totalCompleted}
                  sub="all time"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Weekly completion"
                  value={`${mockOverview.weeklyRate}%`}
                  sub="last 7 days"
                />
                <StatCard
                  icon={Layers}
                  label="Active structures"
                  value={mockOverview.activeStructures}
                  sub={`of 2 max`}
                />
                <StatCard
                  icon={Trophy}
                  label="Best streak"
                  value={`${mockOverview.bestStreak}d`}
                  sub="across structures"
                />
              </div>
            </section>

            {/* ── Section 2: Structure performance ── */}
            <section className="flex flex-col gap-3">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}
              >
                Structure Performance
              </p>
              <div className={`grid gap-4 ${
                mockStructureStats.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}>
                {mockStructureStats.map((stat) => (
                  <StructureStatCard key={stat.id} stat={stat} />
                ))}
              </div>
            </section>

            {/* ── Section 3: Weekly chart ── */}
            <section className="flex flex-col gap-3">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}
              >
                Weekly Activity
              </p>
              <WeeklyChart days={mockWeekActivity} />
            </section>

            {/* ── Section 4: Insights ── */}
            <section className="flex flex-col gap-3">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}
              >
                Insights
              </p>
              <div
                className="rounded-2xl border shadow-[3px_3px_0px_0px_var(--border)]
                  divide-y"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  // @ts-ignore — CSS custom property
                  "--tw-divide-color": "var(--border)",
                }}
              >
                {mockInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="flex items-start gap-3 px-5 py-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <Lightbulb
                      size={14}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "var(--text-faint)" }}
                    />
                    <p className="text-sm" style={{ color: "var(--text)" }}>
                      {insight.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </>
        )}

      </div>
    </DashboardLayout>
  );
}