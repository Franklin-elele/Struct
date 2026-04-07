import React, { ForwardedRef, forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  buttonType?: "primary" | "bordered" | "ghost";
  customClass?: string;
  loading?: boolean;
  onClick?: (e?: any) => void;
  disabled?: boolean;
  ref?: ForwardedRef<HTMLButtonElement>;
  title?: string;
  type?: "reset" | "submit" | "button";
};

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  {
    buttonType = "primary",
    customClass,
    children,
    loading,
    onClick,
    disabled,
    title,
    type,
  },
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  // ── Variant base styles ──────────────────────────────────────────────
  // Primary: forest-dark bg, cream text — the main CTA
  // Bordered: transparent bg, sage-dark border — secondary action
  // Ghost: sage-light bg, forest text — tertiary / low-emphasis

  const variantMap: Record<string, string> = {
    primary: [
      "bg-[#2d3328] text-[#f1f3e0]",
      // offset shadow: x=5 y=4, 1px spread, sage-mid colour
      "shadow-[5px_4px_1px_1px_#a1bc98]",
      // hover: shadow collapses + button nudges down-right (simulate press)
      "hover:shadow-[2px_2px_0px_1px_#778873] hover:translate-x-[3px] hover:translate-y-[2px]",
    ].join(" "),

    bordered: [
      "bg-transparent text-[#2d3328] border-2 border-[#778873]",
      "shadow-[5px_4px_1px_1px_#d2dcb6]",
      "hover:shadow-[2px_2px_0px_1px_#a1bc98] hover:translate-x-[3px] hover:translate-y-[2px]",
    ].join(" "),

    ghost: [
      "bg-[#d2dcb6] text-[#2d3328]",
      "shadow-[5px_4px_0px_1px_rgba(0,0,0,0.08)]",
      "hover:shadow-[2px_2px_0px_1px_rgba(0,0,0,0.06)] hover:translate-x-[3px] hover:translate-y-[2px]",
    ].join(" "),
  };

  const variantClass = variantMap[buttonType] ?? variantMap.primary;

  // ── State overrides ──────────────────────────────────────────────────
  const stateClass = loading && !disabled
    ? "!cursor-not-allowed opacity-50"
    : !loading && disabled
    ? "!cursor-not-allowed !bg-[#d2dcb6] !text-[#778873] !shadow-none !translate-x-0 !translate-y-0"
    : "";

  return (
    <button
      title={title}
      ref={ref}
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        // layout
        "relative flex items-center justify-center gap-2",
        "px-6 h-10 rounded-lg",
        // typography
        "font-ubuntu font-medium text-sm tracking-wide",
        // transition — shadow + transform together
        "transition-all duration-150 ease-out",
        // variant
        variantClass,
        // state
        stateClass,
        // consumer overrides
        customClass ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Loading spinner — inherits text colour */}
      {loading && (
        <span
          className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

export default forwardRef(Button);