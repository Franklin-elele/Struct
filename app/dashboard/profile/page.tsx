"use client";

// app/dashboard/profile/page.tsx
// Added: SystemSnapshotCard, dark mode toggle, multiple structures toggle (Premium), Free Plan badge

import { useState, useRef } from "react";
import {
  Pencil, Camera, Bell, LogOut, LucideIcon,
  Flame, CheckSquare, Layers, Moon, Lock, ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import ToggleSwitch from "@/app/components/Dashboard/ToggleSwitch";
import LogoutModal from "@/app/components/Dashboard/logoutModal";

const mockUser = {
  firstName: "Ebuka",
  lastName:  "Elele",
  email:     "eleleebuka555@gmail.com",
  plan:      "free", // "free" | "premium"
};

// mock snapshot — replace with real data later
const mockSnapshot = {
  activeStructures: 2,
  currentStreak:    7,
  todayCompleted:   3,
  todayTotal:       7,
};

// ─────────────────────────────────────────────
// ProfileCard — avatar, name, email, plan badge
// ─────────────────────────────────────────────
function ProfileCard() {
  const router = useRouter();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = `${mockUser.firstName[0]}${mockUser.lastName[0]}`.toUpperCase();
  const fullName = `${mockUser.firstName} ${mockUser.lastName}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-6 flex flex-col sm:flex-row items-center gap-5">

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center
          justify-center text-2xl font-bold bg-[#F1F3E0] text-[#778873]">
          {avatarSrc
            ? <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            : initials
          }
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full
            flex items-center justify-center bg-[#2d3328] text-[#F1F3E0]
            shadow-md hover:scale-110 transition-all duration-150"
          aria-label="Change profile photo"
        >
          <Camera size={13} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Name + email + plan */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="text-lg font-bold text-[#2d3328] truncate">{fullName}</p>
        <p className="text-sm text-[#778873] truncate mt-0.5">{mockUser.email}</p>
        <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-widest
            px-2.5 py-1 rounded-full bg-[#F1F3E0] text-[#778873]">
            Active · Streak going
          </span>
          {/* Free plan badge + upgrade link */}
          {mockUser.plan === "free" && (
            <button
              onClick={() => router.push("/upgrade")}
              className="flex items-center gap-1 text-[10px] font-semibold
                text-[#A1BC98] hover:text-[#2d3328] transition-colors duration-150"
            >
              Free Plan · Upgrade <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Edit button */}
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
          border border-[#D2DCB6] text-[#778873] bg-[#F1F3E0]
          hover:border-[#A1BC98] hover:text-[#2d3328] transition-all duration-150
          self-start sm:self-center"
      >
        <Pencil size={13} />
        Edit
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// SystemSnapshotCard — quick stats at a glance
// ─────────────────────────────────────────────
function SnapshotCell({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 py-3">
      <div className="w-9 h-9 rounded-xl bg-[#F1F3E0] flex items-center justify-center">
        <Icon size={16} className="text-[#778873]" />
      </div>
      <span className="text-base font-bold text-[#2d3328] leading-none">{value}</span>
      <span className="text-[10px] text-[#778873] font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function SystemSnapshotCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
        System Snapshot
      </p>
      <div className="flex items-start divide-x divide-[#F1F3E0]">
        <SnapshotCell
          icon={Layers}
          value={`${mockSnapshot.activeStructures}`}
          label="Active structures"
        />
        <SnapshotCell
          icon={Flame}
          value={`${mockSnapshot.currentStreak}d`}
          label="Current streak"
        />
        <SnapshotCell
          icon={CheckSquare}
          value={`${mockSnapshot.todayCompleted}/${mockSnapshot.todayTotal}`}
          label="Done today"
        />
      </div>
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
    <div className="flex items-center justify-between gap-4 py-4
      border-b border-[#F1F3E0] last:border-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#F1F3E0] flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-[#778873]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#2d3328]">{label}</p>
          {description && (
            <p className="text-xs text-[#a1bc98] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{right}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PreferencesCard — reminders, dark mode, multiple structures
// ─────────────────────────────────────────────
function PreferencesCard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode]           = useState(false);
  const isPremium = mockUser.plan === "premium";

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] px-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest
        text-[#a1bc98] pt-4 pb-2">
        Preferences
      </p>

      {/* Reminders */}
     

      {/* Dark mode */}
      <SettingsRow
        icon={Moon}
        label="Dark Mode"
        description="Switch appearance"
        right={
          <ToggleSwitch
            enabled={darkMode}
            onToggle={() => setDarkMode((d) => !d)}
            ariaLabel="Toggle dark mode"
          />
        }
      />

      {/* Multiple structures — Premium only */}
      <SettingsRow
        icon={Layers}
        label="Multiple Structures"
        description={isPremium ? "Run parallel structures" : "Premium feature"}
        right={
          isPremium ? (
            <ToggleSwitch
              enabled={true}
              onToggle={() => {}}
              ariaLabel="Toggle multiple structures"
            />
          ) : (
            // locked for free users — redirect to upgrade
            <button
              onClick={() => router.push("/upgrade")}
              className="flex items-center gap-1.5 text-[10px] font-semibold
                text-[#a1bc98] hover:text-[#2d3328] transition-colors duration-150
                bg-[#F1F3E0] border border-[#D2DCB6] rounded-lg px-2.5 py-1.5"
            >
              <Lock size={10} />
              Upgrade
            </button>
          )
        }
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// AccountCard
// ─────────────────────────────────────────────
function AccountCard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] px-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest
        text-[#a1bc98] pt-4 pb-2">
        Account
      </p>
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
        />
      )}
      <SettingsRow
        icon={LogOut}
        label="Log out"
        description="Sign out of your account"
        right={
          <button
            onClick={() => setShowLogoutModal(true)}
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
// ProfilePage
// ─────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 max-w-lg mx-auto">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2d3328]">Profile</h2>
          <p className="text-sm mt-0.5 text-[#778873]">Manage your account and preferences.</p>
        </div>

        <ProfileCard />
        <SystemSnapshotCard />
        <PreferencesCard />
        <AccountCard />

        <p className="text-center text-[10px] font-medium tracking-widest uppercase pb-2 text-[#D2DCB6]">
          Struct V1 · MVP
        </p>
      </div>
    </DashboardLayout>
  );
}