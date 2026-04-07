// InputField — reusable input with optional lucide-react icon support
// Icon sits inside the left side of the input when provided

import { useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

type InputFieldProps = {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  autoComplete?: string;
  icon?: LucideIcon; // optional lucide icon component
};

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  icon: Icon,
}: InputFieldProps) {
  // tracks password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#4f5c49]">{label}</label>
      <div className="relative flex items-center">

        {/* Left icon */}
        {Icon && (
          <span className="absolute left-3 text-[#a1bc98] pointer-events-none">
            <Icon size={16} />
          </span>
        )}

        <input
          type={resolvedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full py-3 pr-4 rounded-xl border border-[#D2DCB6] bg-white
            text-[#2d3328] text-sm placeholder:text-[#a1bc98]
            focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent
            transition-all duration-150
            ${Icon ? "pl-10" : "pl-4"}`}
        />

        {/* Right — show/hide password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 text-[#778873] hover:text-[#2d3328] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}