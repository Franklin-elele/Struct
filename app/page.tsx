"use client";

// app/page.tsx — Struct Landing Page
// Sections: Hero, How It Works, Features, 90-Day Cycle, Pricing, CTA, Footer
// Uses: GradientWaves (hero bg), CardSwap (feature showcase)
// Vibe: Power, control, focus. Dark, bold, intentional.

import { useRouter } from "next/navigation";
import { useState } from "react";
import GradientWaves from "@/app/components/Landing/GradientWaves";
import CardSwap, { Card } from "@/app/components/Landing/CardSwap";
import {
  Flame, CheckCircle2, Layers, ArrowRight,
  BarChart2, Users, Zap, Lock, Check
} from "lucide-react";

// ── Reusable section label ──
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A1BC98] mb-3">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function Hero() {
  const router = useRouter();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* GradientWaves background — sage palette */}
      <div className="absolute inset-0 z-0">
        <GradientWaves
          horizonColor="#0d1a0d"
          waveColor="#2D3328"
          crestColor="#2D3328"
          speed={0.3}
          amplitude={4.0}
          waveScale={0.6}
          waveRatio={0.9}
          swell={40}
          turbulence={25}
          tilt={1.11}
          opacity={1.0}
          brightness={1.0}
          fogDepth={10}
          mouseInteraction={true}
          grain={true}
          grainIntensity={0.03}
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-10 " />

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

        {/* Brand */}
        <p className="text-[#A1BC98] text-sm font-semibold uppercase tracking-[0.3em] mb-6">
          Struct•
        </p>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Stop planning.
          <br />
          <span className="text-[#A1BC98]">Start executing.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-[#414b39] max-w-xl leading-relaxed mb-10">
          Struct is a discipline system — not a todo app. Commit to your structures,
          execute your habits daily, and let consistency compound.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => router.push("/Auth/onboard")}
            className="flex items-center gap-2 px-8 py-4 rounded-xl
              bg-[#A1BC98] text-[#2D3328] text-sm font-bold
              shadow-[5px_5px_0px_0px_#778873]
              hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[3px] hover:translate-y-[3px]
              transition-all duration-150"
          >
            Start building your system <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
           className="flex items-center gap-2 px-8 py-4 rounded-xl
              bg-[#90a08a] text-[#3f4838] text-sm font-bold
              shadow-[5px_5px_0px_0px_#0d1a0d]
              hover:shadow-[2px_2px_0px_0px_#0d1a0d] hover:translate-x-[3px] hover:translate-y-[3px]
              transition-all duration-150"
          >
            See how it works
          </button>
        </div>

        {/* Social proof hint */}
        <p className="mt-8 text-xs text-[#687565]">
          Free to start · No credit card required
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-[#2D3328]/90" />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Define your Structure",
      description: "A Structure is a long-term life system — Study Daily, Build Every Day, Stay Fit. You commit to max 2 at a time. The limit is intentional.",
      icon: Layers,
    },
    {
      number: "02",
      title: "Set your Habits",
      description: "Each Structure holds a set of daily habits. These are the repeatable actions that define execution. Not goals — systems.",
      icon: CheckCircle2,
    },
    {
      number: "03",
      title: "Execute every day",
      description: "Struct generates your tasks automatically each morning. Check them off. Build your streak. Watch consistency compound.",
      icon: Flame,
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#2D3328] py-24 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-4xl font-black text-[#F1F3E0] tracking-tight">
            Identity → Habits → Execution
          </h2>
          <p className="text-[#778873] mt-4 max-w-lg mx-auto">
            Three layers. Everything in Struct flows from this philosophy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#F1F3E0]/5 border border-[#A1BC98]/20 rounded-2xl p-6
                hover:border-[#A1BC98]/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold text-[#A1BC98] uppercase tracking-widest">
                  {step.number}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#A1BC98]/10 flex items-center justify-center">
                  <step.icon size={15} className="text-[#A1BC98]" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#F1F3E0] mb-2">{step.title}</h3>
              <p className="text-sm text-[#778873] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FEATURES — CardSwap showcase
// ─────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Layers,
      title: "Structures, not tasks",
      description: "Max 2 active structures at a time. The constraint is the feature — it forces you to choose what actually matters.",
      tag: null,
    },
    {
      icon: Flame,
      title: "Per-structure streaks",
      description: "Every structure tracks its own streak independently. Hit 70% completion daily to keep it alive.",
      tag: null,
    },
    {
      icon: BarChart2,
      title: "90-day cycles",
      description: "Every structure runs on a rolling 90-day cycle from your start date. Progress is measured in consistency, not perfection.",
      tag: null,
    },
    {
      icon: Zap,
      title: "Focus Mode",
      description: "One task at a time. No distractions. A 60-second exit timer keeps you honest when you want to bail early.",
      tag: null,
    },
    {
      icon: Users,
      title: "Friends & Accountability",
      description: "See your friends' streaks and progress. React, encourage, and stay accountable to each other.",
      tag: "Coming soon",
    },
    {
      icon: BarChart2,
      title: "AI-Kaizen coaching",
      description: "An AI psychologist-style guide that adapts your next micro-step based on your performance. Never lets you quit.",
      tag: "Coming soon",
    },
  ];

  return (
    <section className="bg-[#F1F3E0] py-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-4xl font-black text-[#2D3328] tracking-tight mb-6">
              Built for discipline.
              <br />
              Not motivation.
            </h2>
            <p className="text-[#778873] leading-relaxed mb-8">
              Motivation fades. Struct is designed around systems, streaks,
              and daily execution — the only things that actually build a disciplined life.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3">
              {features.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#A1BC98]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon size={13} className="text-[#778873]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D3328]">{feature.title}</p>
                    <p className="text-xs text-[#778873] mt-0.5 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coming soon */}
            <div className="mt-6 pt-6 border-t border-[#D2DCB6]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98] mb-3">
                On the roadmap
              </p>
              <div className="flex flex-col gap-2">
                {features.slice(4).map((feature) => (
                  <div key={feature.title} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D2DCB6]" />
                    <p className="text-xs text-[#a1bc98] font-medium">{feature.title}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider
                      bg-[#D2DCB6] text-[#778873] px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — CardSwap */}
          <div className="relative h-[400px] hidden lg:block">
            <CardSwap
              width={340}
              height={200}
              cardDistance={50}
              verticalDistance={60}
              delay={3000}
              pauseOnHover
              easing="elastic"
            >
              {/* Card 1 — Structure preview */}
              <Card customClass="bg-white border-[#D2DCB6] shadow-[4px_4px_0px_0px_#d2dcb6] p-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#a1bc98] mb-2">Structure</p>
                <p className="text-base font-bold text-[#2d3328] mb-1">Study Daily</p>
                <p className="text-[10px] text-[#a1bc98] mb-3">Day 12 of 90</p>
                <div className="flex flex-col gap-1.5">
                  {["Read for 1 hour", "Flashcard review", "Practice problems"].map((h) => (
                    <div key={h} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A1BC98]" />
                      <span className="text-xs text-[#4f5c49]">{h}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#F1F3E0] flex justify-between">
                  <span className="text-xs text-[#778873]">Today's progress</span>
                  <span className="text-xs font-bold text-[#2d3328]">2/3 done</span>
                </div>
              </Card>

              {/* Card 2 — Stats preview */}
              <Card customClass="bg-[#2D3328] border-[#778873] shadow-[4px_4px_0px_0px_#778873] p-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A1BC98] mb-3">Today's Progress</p>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                      <circle cx="36" cy="36" r="28" fill="none" stroke="#778873" strokeWidth="6" />
                      <circle cx="36" cy="36" r="28" fill="none" stroke="#A1BC98" strokeWidth="6"
                        strokeLinecap="round" strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * 0.33} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#F1F3E0]">67%</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-around">
                  {[["7d", "Streak"], ["4/6", "Done"], ["83d", "Left"]].map(([v, l]) => (
                    <div key={l} className="flex flex-col items-center">
                      <span className="text-sm font-bold text-[#F1F3E0]">{v}</span>
                      <span className="text-[9px] text-[#778873]">{l}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 3 — Focus Mode preview */}
              <Card customClass="bg-[#F1F3E0] border-[#D2DCB6] shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col items-center justify-center text-center">
                <Zap size={20} className="text-[#778873] mb-2" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#a1bc98] mb-2">Focus Mode</p>
                <p className="text-base font-bold text-[#2d3328] mb-4">Read for 1 hour</p>
                <div className="w-full py-2.5 rounded-xl bg-[#2d3328] text-[#F1F3E0] text-xs font-semibold
                  flex items-center justify-center gap-2">
                  <CheckCircle2 size={13} />
                  Mark as done
                </div>
                <p className="text-[9px] text-[#a1bc98] mt-3">3 tasks remaining</p>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 90-DAY CYCLE
// ─────────────────────────────────────────────
function CycleSection() {
  return (
    <section className="bg-[#2D3328] py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <SectionLabel>The 90-day cycle</SectionLabel>
        <h2 className="text-4xl font-black text-[#F1F3E0] tracking-tight mb-6">
          Discipline runs in cycles,
          <br />not forever.
        </h2>
        <p className="text-[#778873] leading-relaxed mb-12 max-w-xl mx-auto">
          Every structure you create runs for 90 days from the day you start —
          not locked to any calendar. At the end, you reflect, reset, and recommit.
          Or start fresh. The cycle keeps execution grounded in reality.
        </p>

        {/* Cycle visual */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: 90 }).map((_, i) => {
            const isToday = i === 11;
            const isDone = i < 11;
            return (
              <div
                key={i}
                className={`rounded-sm transition-all duration-100 ${isToday ? "w-3 h-3 bg-[#A1BC98]" :
                    isDone ? "w-2 h-2 bg-[#778873]" :
                      "w-2 h-2 bg-[#F1F3E0]/10"
                  }`}
              />
            );
          })}
        </div>
        <p className="text-xs text-[#778873] mt-4">Day 12 of 90 — 78 days remaining</p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────
function Pricing() {
  const router = useRouter();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "One structure. Full execution. No excuses.",
      features: [
        "1 active Structure",
        "Unlimited Habits",
        "Daily task generation",
        "Streak tracking",
        "Statistics & History",
        "Focus Mode",
      ],
      cta: "Get started free",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "$7",
      period: "per month",
      description: "For those who run multiple systems in parallel.",
      features: [
        "Everything in Free",
        "Multiple parallel Structures",
        "Friends & Accountability",
        "Priority support",
        "Early access to new features",
        "AI-Kaizen coaching (coming soon)",
      ],
      cta: "Start Premium",
      highlighted: true,
    },
  ];

  return (
    <section className="bg-[#F1F3E0] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="text-4xl font-black text-[#2D3328] tracking-tight">
            Simple. No tricks.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col gap-6 border
                ${plan.highlighted
                  ? "bg-[#2D3328] border-[#778873] shadow-[6px_6px_0px_0px_#778873]"
                  : "bg-white border-[#D2DCB6] shadow-[6px_6px_0px_0px_#d2dcb6]"
                }`}
            >
              {/* Plan header */}
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2
                  ${plan.highlighted ? "text-[#A1BC98]" : "text-[#a1bc98]"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className={`text-4xl font-black
                    ${plan.highlighted ? "text-[#F1F3E0]" : "text-[#2D3328]"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1.5
                    ${plan.highlighted ? "text-[#778873]" : "text-[#a1bc98]"}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.highlighted ? "text-[#778873]" : "text-[#778873]"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Check size={13} className="text-[#A1BC98] flex-shrink-0" />
                    <span className={`text-sm ${plan.highlighted ? "text-[#D2DCB6]" : "text-[#4f5c49]"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => router.push("/Auth/onboard")}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-150
                  ${plan.highlighted
                    ? "bg-[#A1BC98] text-[#2D3328] shadow-[4px_4px_0px_0px_#778873] hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]"
                    : "bg-[#2D3328] text-[#F1F3E0] shadow-[4px_4px_0px_0px_#a1bc98] hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]"
                  }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────
function FinalCTA() {
  const router = useRouter();
  return (
    <section className="bg-[#2D3328] py-24 px-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-[#A1BC98]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-[#F1F3E0] tracking-tight mb-6">
          The system won't
          <br />
          <span className="text-[#A1BC98]">build itself.</span>
        </h2>
        <p className="text-[#778873] mb-10 leading-relaxed">
          Stop collecting productivity tools. Pick your structures, commit to your habits,
          and execute daily. That's it. That's the whole system.
        </p>
        <button
          onClick={() => router.push("/Auth/onboard")}
          className="flex items-center gap-2 px-10 py-4 rounded-xl mx-auto
            bg-[#A1BC98] text-[#2D3328] text-sm font-bold
            shadow-[5px_5px_0px_0px_#778873]
            hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[3px] hover:translate-y-[3px]
            transition-all duration-150"
        >
          Start for free <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#2D3328] border-t border-[#F1F3E0]/10 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-bold text-[#A1BC98]">Struct.</p>
        <p className="text-xs text-[#778873]">
          Built for execution. Not planning.
        </p>
        <div className="flex items-center gap-6">
          <button className="text-xs text-[#778873] hover:text-[#D2DCB6] transition-colors duration-150">
            Privacy
          </button>
          <button className="text-xs text-[#778873] hover:text-[#D2DCB6] transition-colors duration-150">
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE — assembles all sections
// ─────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <CycleSection />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}