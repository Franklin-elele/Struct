// LoginForm — email + password form with icon inputs
// UI only — no auth logic. Wire onChange/onSubmit to backend later.
"use client";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import InputField from "../Inputs/index";
import { login } from "@/lib/services/auth.service";
import { useNavigate } from "@/hooks/useNavigate";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/app/components/Loader";
import { getBrowserTimezone } from "@/lib/dates";
import axios from "axios";


type LoginData = {
  email: string;
  password: string;
};

type LoginFormProps = {
  data: LoginData;
  onChange: (updated: LoginData) => void;
  onBack: () => void;
};

export default function LoginForm({
  data,
  onChange,
  onBack,
}: LoginFormProps) {
  const { navigate } = useNavigate();
  const { email, password } = data;
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const set = (field: keyof LoginData) => (val: string) =>
    onChange({ ...data, [field]: val });

  // basic check — both fields must have content to enable the button
  const canSubmit = data.email.length > 0 && data.password.length > 0;

  const handleSubmit = async () => {
  if (isLoggingIn || !canSubmit) return;
  setIsLoggingIn(true);
  const toastId = toast.loading("Logging in...");
  try {
    await login({ email, password, timezone: getBrowserTimezone() });
    toast.success("Logged in. Opening your dashboard...", { id: toastId, duration: 5000 });
    navigate("/dashboard/home");
    // isLoggingIn stays true: the button keeps its spinner until the page changes
  } catch (error) {
    toast.error(
      axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Login failed"
        : "Login failed",
      { id: toastId },
    );
    setIsLoggingIn(false);
  }
};

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSubmit(); // Trigger your login logic
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header row — back button + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
            transition-all duration-150"
          aria-label="Back to landing"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-[#778873]">Log in to your Struct account</p>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <InputField
          label="Email"
          type="email"
          value={data.email}
          onChange={set("email")}
          placeholder="john@example.com"
          autoComplete="email"
          icon={Mail}
        />
        <InputField
          label="Password"
          type="password"
          value={data.password}
          onChange={set("password")}
          placeholder="Your password"
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
          icon={Lock}
        />
      </div>

      {/* Forgot password — placeholder link */}
      <div className="text-right -mt-2">
        <a
          href="#"
          className="text-xs text-[#778873] hover:text-[#2d3328] hover:underline transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isLoggingIn}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150
    flex items-center justify-center gap-2
    ${canSubmit
            ? "bg-[#2d3328] text-[#F1F3E0] shadow-[5px_4px_0px_1px_#a1bc98] hover:shadow-[2px_2px_0px_1px_#778873] hover:translate-x-[3px] hover:translate-y-[2px]"
            : "bg-[#D2DCB6] text-[#a1bc98] cursor-not-allowed"
          }`}
      >
        {isLoggingIn ? (
          <>
            <Loader variant="inline" size={19} />
            <span>Logging in...</span>
          </>
        ) : (
          "Log in"
        )}
      </button>

      {/* Sign up link */}
      <p className="text-center text-xs text-[#778873]">
        Don't have an account?{" "}
        <a href="/Auth/onboard" className="font-medium text-[#2d3328] hover:underline">
          Get started free
        </a>
      </p>
    </div>
  );
}

export type { LoginData };