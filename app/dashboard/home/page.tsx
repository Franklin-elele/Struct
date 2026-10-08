"use client";

// app/dashboard/home/page.tsx
// Desktop: StructureCard (wider) + StatsCard side by side, equal height
// Mobile: Embla carousel with peek effect and dot indicators

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import StructureCard from "@/app/components/Dashboard/StructureCard";
import StatsCard from "@/app/components/Dashboard/StatsCard";
import TaskSection from "@/app/components/Dashboard/Task/TaskSection";
import { Info, ArrowRight, Layers } from "lucide-react"; import {
  getStructures,
  getStructureById,
} from "@/lib/services/structure.service"; 
import { getTodayTasks } from "@/lib/services/task.service";
import { getCurrentUser } from "@/lib/services/auth.service"; 
import {
  MAX_STRUCTURES,
  type Structure as CardStructure,
  type Stats,
} from "@/app/components/config/mockData";
import Loader from "@/app/components/Loader";

// ── Shapes of what the backend actually returns ──
type ApiStructure = {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "active" | "archived";
  isCurrent: boolean;
};

type ApiHabit = {
  _id: string;
  title: string;
  duration?: string;
};

type ApiTask = {
  _id: string;
  habitId: string;
  structureId: string;
  title: string;
  completed: boolean;
};



// ── Mobile swipeable carousel (unchanged) ──
function MobileCarousel({ children }: { children: React.ReactNode[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="flex flex-col gap-3">
      <div ref={emblaRef} className="overflow-hidden pb-2.5">
        <div className="flex gap-3">
          {children.map((child, i) => (
            <div key={i} className="flex-none w-[88%]">
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {children.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${activeIndex === i
              ? "w-4 h-1.5 bg-[#A1BC98]"
              : "w-1.5 h-1.5 bg-[#D2DCB6]"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [structures, setStructures] = useState<ApiStructure[]>([]);
  const [habits, setHabits] = useState<ApiHabit[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);

  // ── Fetch structures + today's tasks, then the primary structure's habits ──
  useEffect(() => {
    const loadHome = async () => {
  try {
    const structuresRes = await getStructures();
    const list: ApiStructure[] = structuresRes.data.structures;
    setStructures(list);

    const primary = list.find((s) => s.isCurrent && s.status === "active");
    if (primary) {
      const detailRes = await getStructureById(primary._id);
      setHabits(detailRes.data.habits);
    }
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
};
    loadHome();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data) {
          setUserName(res.data.user.firstname);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserName();
  }, []);

  // ── Work out what to show ──
  const primary = structures.find((s) => s.isCurrent && s.status === "active");
  const activeCount = structures.filter((s) => s.status === "active").length;
  const hasMultiple = activeCount > 1;

  // Convert real data into the shape your existing StructureCard expects
  type HomePrimaryStructure = CardStructure & {
    todayCompleted: number;
  };

  const primaryStructure: HomePrimaryStructure | null = primary
    ? {
        id: primary._id,
        title: primary.title,
        streakEnabled: true,
        currentStreak: 0,
        lastCompletedDate: "",
        todayCompleted: habits.filter((h) =>
          tasks.some((t) => t.habitId === h._id && t.completed),
        ).length,
        habits: habits.map((h) => ({
          id: h._id,
          title: h.title,
          timeTarget: h.duration,
          completed: tasks.some((t) => t.habitId === h._id && t.completed),
        })),
      }
    : null;

  // Days left comes from the real endDate
 const MS_PER_DAY = 86400000;
// Compare calendar days, not exact times, so the number doesn't change by time of day
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const today = startOfDay(new Date());

const dayNumber = primary
  ? Math.min(
      90,
      Math.floor((today - startOfDay(new Date(primary.startDate))) / MS_PER_DAY) + 1,
    )
  : 1;

const daysRemaining = primary
  ? Math.max(
      0,
      Math.round((startOfDay(new Date(primary.endDate)) - today) / MS_PER_DAY),
    )
  : 0;

    

  // Stats we can calculate from today's tasks (streak stays 0 for now)
  const completedToday = tasks.filter((t) => t.completed).length;
  const totalToday = tasks.length;
  const stats: Stats = {
    streakDays: 0,
    completedToday,
    totalToday,
    overallPercent: totalToday
      ? Math.round((completedToday / totalToday) * 100)
      : 0,
  };

  // Tasks in the shape TaskSection expects
  const taskListForSection = tasks.map((t) => ({
    id: t._id,
    title: t.title,
    completed: t.completed,
    structureId: t.structureId,
    structureTitle:
      structures.find((s) => s._id === t.structureId)?.title ?? "",
  }));

  return (  
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">
            Hello <i>{userName}</i>, ready to execute?
          </h2>
          <p className="text-sm text-[#778873] mt-0.5">
            Here's what you have to execute today.
          </p>
        </div>

        {isLoading ? (
          <Loader />
        ) : !primaryStructure ? (
          <div className="flex flex-col items-center text-center gap-4 bg-white rounded-2xl border border-[#D2DCB6] shadow-[4px_4px_0px_0px_#d2dcb6] px-6 py-12">
            <div className="w-16 h-16 rounded-2xl bg-[#D2DCB6] flex items-center justify-center">
              <Layers size={28} className="text-[#778873]" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#2d3328] tracking-tight">
                No active structure yet
              </h3>
              <p className="text-base text-[#778873] mt-2 max-w-sm">
                A structure turns your goal into 90 days of daily action. Create one
                and start executing.
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard/structure")}
              className="mt-2 flex items-center gap-2 py-3 px-6 rounded-xl bg-[#2d3328] text-[#F1F3E0] text-sm font-semibold
        shadow-[5px_4px_0px_1px_#a1bc98]
        hover:shadow-[2px_2px_0px_1px_#778873] hover:translate-x-[3px] hover:translate-y-[2px]
        transition-all duration-150"
            >
              Create a structure <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Focus banner — shown only when user is at structure limit */}
            {activeCount >= MAX_STRUCTURES && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F1F3E0] border border-[#D2DCB6]">
                <Info
                  size={16}
                  className="text-[#778873] flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-[#4f5c49] leading-relaxed">
                  <span className="font-semibold text-[#2d3328]">
                    Struct is designed for focus.
                  </span>{" "}
                  You can only run 2 structures at a time.
                </p>
              </div>
            )}

            {/* ── MOBILE: swipeable carousel (hidden on lg+) ── */}
            <div className="lg:hidden">
              <MobileCarousel>
                <StructureCard
                  structure={primaryStructure}
                />
                <StatsCard stats={stats} daysRemaining={daysRemaining} />
              </MobileCarousel>
            </div>

            {/* ── DESKTOP: two-column grid ── */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_300px] gap-4 items-stretch">
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
                    Your Structure
                  </p>
                  {hasMultiple && (
                    <button
                      onClick={() => router.push("/dashboard/structure")}
                      className="flex items-center gap-1 text-[10px] font-semibold text-[#778873] hover:text-[#2d3328] transition-colors duration-150"
                    >
                      Running {activeCount} → View all{" "}
                      <ArrowRight size={10} />
                    </button>
                  )}
                </div>

                <StructureCard
                  structure={primaryStructure}
                  // onView={(id) => router.push(`/dashboard/structure/${id}`)}
                />
              </section>

              <section className="flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
                  Statistics
                </p>
                <StatsCard stats={stats} daysRemaining={daysRemaining} />
              </section>
            </div>

            {/* Today's tasks */}
            <TaskSection
              initialTasks={taskListForSection}
              onViewAll={() => router.push("/dashboard/tasks")}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}