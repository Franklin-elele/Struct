"use client";

// OnboardingContainer — manages step state, shared data, and navigation
// All state lives here and is passed down as props

import { useState } from "react";
import Step1SignupForm, { SignupData } from "@/app/components/StepOne";
import Step2StructureTitle from "@/app/components/StepTwo";
import Step3HabitSetup from "@/app/components/StepThree";
import Step4ReminderSettings from "@/app/components/StepFour";
import { Habit } from "@/app/components/Inputs/HabitInputRow";
import { ReminderConfig } from "@/app/components/Inputs/ReminderSettings";
import { MoveLeft, MoveRight } from 'lucide-react';
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";


// ── Shared onboarding state shape ──
type OnboardingState = {
  signup: SignupData;
  structureTitle: string;
  habits: Habit[];
  reminders: ReminderConfig;
};

const STEPS = ["Account", "Structure", "Habits", "Reminders"];

const INITIAL_STATE: OnboardingState = {
  signup: { firstName: "", lastName: "", email: "", password: "" },
  structureTitle: "",
  habits: [{ id: "h1", title: "", timeEnabled: false, timeTarget: "08:00" }],
  reminders: {
    morningEnabled: false,
    morningTime: "08:00",
    nightEnabled: false,
    nightTime: "21:00",
  },
};

// ── Step progress indicator ──
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${i < current
              ? "bg-[#778873] w-8"
              : i === current
                ? "bg-[#A1BC98] w-8"
                : "bg-[#D2DCB6] w-4"
              }`}
          />
        </div>
      ))}
      <span className="text-xs text-[#778873] ml-1 font-medium">
        {current + 1} / {total}
      </span>
    </div>
  );
}

// ── Completion screen ──
function CompletionScreen({ name }: { name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinish = () => {
    setLoading(true);
    router.push("/dashboard/home");
  }

  return (
    <div>
      {loading && <Loader variant="page" />}
      <div className="flex flex-col items-center gap-6 py-6 text-center">

        <div className="w-16 h-16 rounded-2xl bg-[#D2DCB6] flex items-center justify-center text-3xl">
          ◈
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">
            You're all set{name ? `, ${name}` : ""}!
          </h2>
          <p className="text-sm text-[#778873] mt-2 max-w-xs">
            Your first structure is ready. Time to stop planning and start executing.
          </p>
        </div>
        <button
          type="button"
          className="w-full py-3 rounded-xl bg-[#2d3328] text-[#F1F3E0] text-sm font-semibold
          shadow-[5px_4px_0px_1px_#a1bc98]
          hover:shadow-[2px_2px_0px_1px_#778873] hover:translate-x-[3px] hover:translate-y-[2px]
          transition-all duration-150"
          onClick={handleFinish}
        >
          Continue to Dashboard →
        </button>
      </div>
    </div>
  );
}

// ── Main container ──
export default function OnboardingContainer() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [done, setDone] = useState(false);

  const totalSteps = STEPS.length;

  const update = <K extends keyof OnboardingState>(key: K, val: OnboardingState[K]) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const canAdvance = (): boolean => {
    if (step === 0) {
      const { firstName, lastName, email, password } = state.signup;
      return !!(firstName && lastName && email && password.length >= 8);
    }
    if (step === 1) return state.structureTitle.trim().length > 0;
    if (step === 2) return state.habits.some((h) => h.title.trim().length > 0);
    return true; // step 3 reminders are optional
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else setDone(true);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-[#F1F3E0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <div className="mb-6 text-center">
          <span className="text-3xl font-bold text-[#778873] tracking-tight">Struct.</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6] shadow-[5px_4px_0px_1px_#d2dcb6] p-6 sm:p-8">

          {done ? (
            <CompletionScreen name={state.signup.firstName} />
          ) : (
            <>
              {/* Progress */}
              <div className="mb-6">
                <StepIndicator current={step} total={totalSteps} />
                <p className="text-xs text-[#a1bc98] mt-2 uppercase tracking-wider font-medium">
                  {STEPS[step]}
                </p>
              </div>

              {/* Step content */}
              <div className="mb-8">
                {step === 0 && (
                  <Step1SignupForm
                    data={state.signup}
                    onChange={(v) => update("signup", v)}
                  />
                )}
                {step === 1 && (
                  <Step2StructureTitle
                    title={state.structureTitle}
                    onChange={(v) => update("structureTitle", v)}
                  />
                )}
                {step === 2 && (
                  <Step3HabitSetup
                    habits={state.habits}
                    onChange={(v) => update("habits", v)}
                  />
                )}
                {step === 3 && (
                  <Step4ReminderSettings
                    reminders={state.reminders}
                    onChange={(v) => update("reminders", v)}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 rounded-xl border-2 border-[#D2DCB6] text-[#778873]
    text-sm font-semibold flex items-center justify-center gap-2
    hover:border-[#A1BC98] hover:text-[#2d3328] transition-all duration-150"
                  >
                    <MoveLeft size={18} /> Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold
    flex items-center justify-center gap-2
    transition-all duration-150
    ${canAdvance()
                      ? "bg-[#2d3328] text-[#F1F3E0] shadow-[5px_4px_0px_1px_#a1bc98] hover:shadow-[2px_2px_0px_1px_#778873] hover:translate-x-[3px] hover:translate-y-[2px]"
                      : "bg-[#D2DCB6] text-[#a1bc98] cursor-not-allowed"
                    }`}
                >
                  {step === totalSteps - 1 ? "Finish setup" : "Continue"}
                  <MoveRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Login link */}
        {!done && (
          <p className="text-center text-xs text-[#778873] mt-4">
            Already have an account?{" "}
            <a href="/Auth/login" className="font-medium text-[#2d3328] hover:underline">
              Log in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}