"use client";

// app/dashboard/home/page.tsx
// Desktop: StructureCard (wider) + StatsCard side by side, equal height
// Mobile: Embla carousel with peek effect and dot indicators

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import StructureCard from "@/app/components/Dashboard/StructureCard";
import StatsCard from "@/app/components/Dashboard/StatsCard";
import TaskSection from "@/app/components/Dashboard/Task/TaskSection";
import { Info, ArrowRight } from "lucide-react";
import {
  mockStructures,
  mockTasks,
  mockStats,
  MAX_STRUCTURES,
} from "@/app/components/config/mockData";
import Loader from "@/app/components/Loader";
import { getCurrentUser } from "@/lib/services/auth.service";

// ── Mobile swipeable carousel ──
function MobileCarousel({ children }: { children: React.ReactNode[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    // Update dot indicator when card snaps
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
      {/* 88% width creates the peek effect — next card's edge is visible */}
      <div ref={emblaRef} className="overflow-hidden pb-2.5">
        <div className="flex gap-3">
          {children.map((child, i) => (
            <div key={i} className="flex-none w-[88%]">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators — active dot stretches to a pill shape */}
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

  // Home always focuses on the primary (first) structure
  const primaryStructure = mockStructures[0];
  const hasMultiple = mockStructures.length > 1;

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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-bold text-[#2d3328] tracking-tight">
            Hello {userName}, ready to execute?
          </h2>
          <p className="text-sm text-[#778873] mt-0.5">
            Here's what you have to execute today.
          </p>
        </div>

        {/* Focus banner — shown only when user is at structure limit */}
        {mockStructures.length >= MAX_STRUCTURES && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F1F3E0] border border-[#D2DCB6]">
            <Info size={16} className="text-[#778873] flex-shrink-0 mt-0.5" />
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
              onView={(id) => router.push(`/dashboard/structure/${id}`)}
            />
            <StatsCard stats={mockStats} daysRemaining={90} />
          </MobileCarousel>
        </div>

        {/* ── DESKTOP: two-column grid, items-stretch makes both cards equal height ── */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_300px] gap-4 items-stretch">
          {/* StructureCard takes the wider left column */}
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
                  Running {mockStructures.length} → View all{" "}
                  <ArrowRight size={10} />
                </button>
              )}
            </div>

            <StructureCard
              structure={primaryStructure}
              onView={(id) => router.push(`/dashboard/structure/${id}`)}
            />
          </section>

          {/* StatsCard takes the narrower right column */}
          <section className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
              Statistics
            </p>
            <StatsCard stats={mockStats} daysRemaining={90} />
          </section>
        </div>

        {/* Today's tasks — same on both layouts */}
        <TaskSection
          initialTasks={mockTasks.map((task) => ({
            ...task,
            structureTitle:
              mockStructures.find((s) => s.id === task.structureId)?.title ||
              "",
          }))}
          onViewAll={() => router.push("/dashboard/tasks")}
        />
      </div>
    </DashboardLayout>
  );
}
