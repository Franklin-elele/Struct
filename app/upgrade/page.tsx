"use client";

// app/upgrade/page.tsx
// Placeholder upgrade page — payment not yet implemented
// Shows Free vs Premium feature breakdown
// Back button returns to previous page (not home)

import { useRouter } from "next/navigation";
import { Check, ArrowLeft, Lock } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "One structure. Full execution. No excuses.",
    highlighted: false,
    features: [
      "1 active Structure",
      "Unlimited Habits",
      "Daily task generation",
      "Per-structure streak tracking",
      "90-day cycle system",
      "Focus Mode",
      "Statistics & History",
      "Basic insights",
    ],
  },
  {
    name: "Premium",
    price: "Coming soon",
    period: "",
    description: "For those who run multiple systems in parallel.",
    highlighted: true,
    features: [
     "Everything in Free",
      "Multiple parallel Structures",
      "Friends & Accountability",
      "Streak visibility to friends",
      "AI-Kaizen coaching (Premium Plus)",
    ],
  },
];

export default function UpgradePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F1F3E0] flex flex-col">

      {/* Header */}
      <div className="flex items-center px-6 py-5 border-b border-[#D2DCB6] bg-white">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#778873]
            hover:text-[#2d3328] transition-colors duration-150"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full mx-auto">

          {/* Page header */}
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A1BC98] mb-3">
              Upgrade
            </p>
            <h1 className="text-4xl font-black text-[#2d3328] tracking-tight mb-4">
              Choose your plan
            </h1>
            <p className="text-[#778873] max-w-md mx-auto">
              Payment is not yet available. Join the waitlist and we'll notify you
              when Premium launches.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#A1BC98]">
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1.5 mb-2">
                    <span className={`text-3xl font-black
                      ${plan.highlighted ? "text-[#F1F3E0]" : "text-[#2D3328]"}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm mb-1
                        ${plan.highlighted ? "text-[#778873]" : "text-[#a1bc98]"}`}>
                        /{plan.period}
                      </span>
                    )}
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
                      <span className={`text-sm
                        ${plan.highlighted ? "text-[#D2DCB6]" : "text-[#4f5c49]"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.highlighted ? (
                  // Premium — waitlist button
                  <button
                    onClick={() => {/* wire to waitlist later */}}
                    className="w-full py-3 rounded-xl text-sm font-bold
                      bg-[#A1BC98] text-[#2D3328]
                      shadow-[4px_4px_0px_0px_#778873]
                      hover:shadow-[2px_2px_0px_0px_#778873]
                      hover:translate-x-[2px] hover:translate-y-[2px]
                      transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    <Lock size={13} />
                    Join the waitlist
                  </button>
                ) : (
                  // Free — already on this plan
                  <div className="w-full py-3 rounded-xl text-sm font-semibold
                    bg-[#F1F3E0] text-[#a1bc98] text-center border border-[#D2DCB6]">
                    Your current plan
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-[#a1bc98]">
            Pricing will be confirmed at launch. Early waitlist members may receive a discount.
          </p>

        </div>
      </div>
    </div>
  );
}