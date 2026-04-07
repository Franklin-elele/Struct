"use client";

// app/dashboard/profile/page.tsx
// Three inlined sub-components: ProfileCard, PreferencesCard, AccountCard
// Kept inline — each is used exactly once and small enough to not justify separate files
// ToggleSwitch stays external (reused elsewhere)

import { useState, useRef } from "react";
import {
  Pencil, Camera, Sun, Moon, Bell,
  LogOut, LucideIcon,
} from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import ToggleSwitch from "@/app/components/Dashboard/ToggleSwitch";

// ── Mock user ── replace with auth context later
const mockUser = {
  firstName: "Ebuka",
  lastName:  "Elele",
  email:     "eleleebuka555@gmail.com",
};

// ─────────────────────────────────────────────
// ProfileCard
// ─────────────────────────────────────────────
function ProfileCard() {
  // avatarSrc — null means show initials fallback
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  // hidden file input ref — triggered by clicking the camera button
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials  = `${mockUser.firstName[0]}${mockUser.lastName[0]}`.toUpperCase();
  const fullName  = `${mockUser.firstName} ${mockUser.lastName}`;

  // read selected image file and convert to data URL for preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5
        border shadow-[4px_4px_0px_0px_var(--border)]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* ── Avatar ── */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center
          justify-center text-2xl font-bold"
          style={{ background: "var(--card-subtle)", color: "var(--text-muted)" }}
        >
          {avatarSrc
            ? <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            : initials
          }
        </div>

        {/* Camera button — triggers hidden file input */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full
            flex items-center justify-center shadow-md
            transition-all duration-150 hover:scale-110"
          style={{ background: "var(--accent-dark)", color: "var(--card)" }}
          aria-label="Change profile photo"
        >
          <Camera size={13} />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* ── Name + email ── */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="text-lg font-bold truncate" style={{ color: "var(--text)" }}>
          {fullName}
        </p>
        <p className="text-sm truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
          {mockUser.email}
        </p>
        <span
          className="inline-block mt-2 text-[10px] font-semibold uppercase
            tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: "var(--card-subtle)", color: "var(--text-faint)" }}
        >
          Active · Streak going
        </span>
      </div>

      {/* ── Edit button ── */}
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
          border transition-all duration-150 self-start sm:self-center
          hover:opacity-80"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-muted)",
          background: "var(--card-subtle)",
        }}
        aria-label="Edit profile"
      >
        <Pencil size={13} />
        Edit
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// SettingsRow — shared layout for preference rows
// ─────────────────────────────────────────────
function SettingsRow({
  icon: Icon,
  label,
  description,
  right,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-4
        border-b last:border-none"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--card-subtle)" }}
        >
          <Icon size={16} style={{ color: "var(--text-muted)" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {label}
          </p>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{right}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PreferencesCard
// ─────────────────────────────────────────────
function PreferencesCard() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div
      className="rounded-2xl px-5 border shadow-[4px_4px_0px_0px_var(--border)]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-widest pt-4 pb-2"
        style={{ color: "var(--text-faint)" }}
      >
        Preferences
      </p>


      <SettingsRow
        icon={Bell}
        label="Reminders"
        description="Morning and night nudges"
        right={
          <ToggleSwitch
            enabled={notifications}
            onToggle={() => setNotifications((n) => !n)}
            ariaLabel="Toggle reminders"
          />
        }
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// AccountCard
// ─────────────────────────────────────────────
function AccountCard() {
  return (
    <div
      className="rounded-2xl px-5 border shadow-[4px_4px_0px_0px_var(--border)]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-widest pt-4 pb-2"
        style={{ color: "var(--text-faint)" }}
      >
        Account
      </p>

      <SettingsRow
        icon={LogOut}
        label="Log out"
        description="Sign out of your account"
        right={
          <button
            onClick={() => {/* wire to auth signout later */}}
            className="flex items-center gap-1.5 text-xs font-semibold
              text-red-400 hover:text-red-500 transition-colors duration-150
              px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut size={13} />
            Log out
          </button>
        }
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// ProfilePage — assembles all three cards
// ─────────────────────────────────────────────
export default function ProfilePage() {
  // useDarkMode handles state + localStorage + <html> class toggle

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 max-w-lg mx-auto">

        {/* Header */}
        <div>
          <h2
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Profile
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Manage your account and preferences.
          </p>
        </div>

        <ProfileCard />
        <PreferencesCard />
        <AccountCard />

        <p
          className="text-center text-[10px] font-medium tracking-widest uppercase pb-2"
          style={{ color: "var(--border)" }}
        >
          Struct V1 · MVP
        </p>

      </div>
    </DashboardLayout>
  );
}