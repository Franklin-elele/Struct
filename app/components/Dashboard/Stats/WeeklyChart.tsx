"use client";

// WeeklyChart — bar chart for weekly view, line chart for 30/90 day views
// Toggle: This Week / Last 30 Days / Full Cycle
// Bar chart shows daily status, line chart shows completion % trend

import { useState } from "react";
import {
  BarChart, Bar, XAxis, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, YAxis, CartesianGrid,
} from "recharts";
import {
  DayActivity,
  getDayStatus,
  getWeekdayLabel,
  DayStatus,
} from "@/app/components/config/statsData";

type WeeklyChartProps = {
  days: DayActivity[];
};

type ViewRange = "week" | "month" | "cycle";

const statusColors: Record<DayStatus, string> = {
  perfect: "#A1BC98",
  partial: "#D2DCB6",
  missed:  "#fca5a5",
  empty:   "#F1F3E0",
};

const statusLabels: Record<DayStatus, string> = {
  perfect: "Completed",
  partial: "Partial",
  missed:  "Missed",
  empty:   "No Tasks",
};

const toggleOptions: { key: ViewRange; label: string }[] = [
  { key: "week",  label: "This Week"    },
  { key: "month", label: "Last 30 Days" },
  { key: "cycle", label: "Full Cycle"   },
];

// rounded bar shape
function RoundedBar(props: any) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  return <rect x={x} y={y} width={width} height={height} rx={6} ry={6} fill={fill} />;
}

// tooltip for bar chart
function BarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { day, status } = payload[0].payload;
  return (
    <div className="bg-white border border-[#D2DCB6] rounded-xl px-3 py-2
      shadow-[3px_3px_0px_0px_#d2dcb6] text-xs">
      <p className="font-semibold text-[#2d3328]">{getWeekdayLabel(day.date)}</p>
      <p className="text-[#778873]">{statusLabels[status as DayStatus]}</p>
      {day.tasksCreated > 0 && (
        <p className="text-[#778873]">{day.tasksCompleted}/{day.tasksCreated} tasks</p>
      )}
    </div>
  );
}

// tooltip for line chart
function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#D2DCB6] rounded-xl px-3 py-2
      shadow-[3px_3px_0px_0px_#d2dcb6] text-xs">
      <p className="font-semibold text-[#2d3328]">{label}</p>
      <p className="text-[#778873]">{payload[0].value}% completion</p>
    </div>
  );
}

// extend mock data to simulate 30 or 90 days — swap for real API data later
function extendData(days: DayActivity[], count: number): DayActivity[] {
  const result: DayActivity[] = [];
  for (let i = 0; i < count; i++) result.push(days[i % days.length]);
  return result;
}

function buildBarData(days: DayActivity[]) {
  return days.map((day) => {
    const status = getDayStatus(day);
    return {
      label: getWeekdayLabel(day.date),
      value: status === "perfect" ? 100
        : status === "partial" && day.tasksCreated > 0
        ? Math.round((day.tasksCompleted / day.tasksCreated) * 100)
        : status === "missed" ? 15 : 5,
      color: statusColors[status],
      status,
      day,
    };
  });
}

function buildLineData(days: DayActivity[]) {
  return days.map((day, i) => ({
    // show every 5th label to avoid crowding
    label: i % 5 === 0 ? `Day ${i + 1}` : "",
    completion: day.tasksCreated > 0
      ? Math.round((day.tasksCompleted / day.tasksCreated) * 100)
      : 0,
  }));
}

export default function WeeklyChart({ days }: WeeklyChartProps) {
  const [view, setView] = useState<ViewRange>("week");

  const activeData =
    view === "week"  ? days :
    view === "month" ? extendData(days, 30) :
                       extendData(days, 90);

  const barData  = buildBarData(activeData);
  const lineData = buildLineData(activeData);

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-4">

      {/* Header + toggle */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-1">
            Activity
          </p>
          <h3 className="text-base font-bold text-[#2d3328]">
            {view === "week" ? "This Week" : view === "month" ? "Last 30 Days" : "Full Cycle"}
          </h3>
        </div>

        {/* Toggle pills */}
        <div className="flex items-center gap-1 bg-[#F1F3E0] rounded-xl p-1 border border-[#D2DCB6]">
          {toggleOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150
                ${view === key
                  ? "bg-white text-[#2d3328] shadow-[2px_2px_0px_0px_#d2dcb6]"
                  : "text-[#778873] hover:text-[#2d3328]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart — This Week only */}
      {view === "week" && (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barCategoryGap="8%" barGap={2}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#778873", fontWeight: 500 }}
            />
            <Tooltip content={<BarTooltip />} cursor={false} />
            <Bar dataKey="value" shape={<RoundedBar />} maxBarSize={80}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Line chart — Last 30 Days and Full Cycle */}
      {view !== "week" && (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid stroke="#F1F3E0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#778873" }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#778873" }}
              tickFormatter={(v) => `${v}%`}
              width={36}
            />
            <Tooltip content={<LineTooltip />} cursor={{ stroke: "#D2DCB6", strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="completion"
              stroke="#A1BC98"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#A1BC98", stroke: "white", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Legend — only for bar chart view */}
      {view === "week" && (
        <div className="flex items-center gap-4 pt-3 border-t border-[#F1F3E0] flex-wrap">
          {(Object.keys(statusLabels) as DayStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: statusColors[s] }}
              />
              <span className="text-[10px] font-medium text-[#778873]">
                {statusLabels[s]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Line chart caption */}
      {view !== "week" && (
        <p className="text-[10px] text-[#a1bc98] text-center pt-1 border-t border-[#F1F3E0]">
          Daily completion % over {view === "month" ? "30" : "90"} days
        </p>
      )}
    </div>
  );
}