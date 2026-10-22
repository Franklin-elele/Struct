"use client";

// app/dashboard/profile/page.tsx
// Real user, real snapshot. Edit, avatar upload and dark mode wait on backend/theme work.

import { useState, useEffect, useCallback } from "react";
import {
  LogOut, Layers, CheckSquare, CalendarDays, Moon, Lock, ArrowRight, UserX,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import ToggleSwitch from "@/app/components/Dashboard/ToggleSwitch";
import LogoutModal from "@/app/components/Dashboard/logoutModal";
import Loader from "@/app/components/Loader";
import EmptyState from "@/app/components/Dashboard/EmptyState";
import { getCurrentUser } from "@/lib/services/auth.service";
import { getStructures } from "@/lib/services/structure.service";
import { getTodayTasks } from "@/lib/services/task.service";
import { getDayNumber } from "@/lib/dates";
import ProfileEditModal, { type ProfileUser } from "@/app/components/Dashboard/ProfileEditModal";
import { Pencil } from "lucide-react";
import { useUser } from "@/app/components/Dashboard/UserContext";


// Everyone is on the free plan until billing exists
// TODO: read this from the user's subscriptionTier once that field is added
const isPremium: boolean = false;

type ApiUser = { firstname: string; lastname: string; email: string };
type ApiStructure = {
  _id: string;
  title: string;
  startDate: string;
  status: "active" | "archived";
  isCurrent: boolean;
};
type ApiTask = { completed: boolean };

// ─────────────────────────────────────────────
// ProfileCard — avatar initials, name, email, plan
// ─────────────────────────────────────────────
function ProfileCard({ user, onEdit }: { user: ProfileUser; onEdit: () => void }) {
  const router = useRouter();
  const initials = `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-6 flex flex-col sm:flex-row items-center gap-5">

      <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center
        flex-shrink-0 text-2xl font-bold bg-[#F1F3E0] text-[#778873]">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="text-lg font-bold text-[#2d3328] truncate">
          {user.firstname} {user.lastname}
        </p>
        <p className="text-sm text-[#778873] truncate mt-0.5">{user.email}</p>
        <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-widest
            px-2.5 py-1 rounded-full bg-[#F1F3E0] text-[#778873]">
            {isPremium ? "Premium" : "Free plan"}
          </span>
          {!isPremium && (
            <button
              onClick={() => router.push("/upgrade")}
              className="flex items-center gap-1 text-[10px] font-semibold
                text-[#A1BC98] hover:text-[#2d3328] transition-colors duration-150"
            >
              Upgrade <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
          border border-[#D2DCB6] text-[#778873] bg-[#F1F3E0]
          hover:border-[#A1BC98] hover:text-[#2d3328] transition-all duration-150
          self-start sm:self-center"
      >
        <Pencil size={13} /> Edit
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// SystemSnapshotCard — quick numbers at a glance
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

function SystemSnapshotCard({
  activeCount,
  dayNumber,
  done,
  total,
}: {
  activeCount: number;
  dayNumber: number | null;
  done: number;
  total: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] p-5 flex flex-col gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a1bc98]">
        System Snapshot
      </p>
      <div className="flex items-start divide-x divide-[#F1F3E0]">
        <SnapshotCell icon={Layers} value={`${activeCount}`} label="Active structures" />
        <SnapshotCell
          icon={CalendarDays}
          value={dayNumber ? `Day ${dayNumber}` : "—"}
          label="Current structure"
        />
        <SnapshotCell icon={CheckSquare} value={`${done}/${total}`} label="Done today" />
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
// PreferencesCard
// ─────────────────────────────────────────────
function PreferencesCard() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-[#D2DCB6]
      shadow-[4px_4px_0px_0px_#d2dcb6] px-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest
        text-[#a1bc98] pt-4 pb-2">
        Preferences
      </p>

      {/* Dark mode: placeholder until the theme work is done */}
      <SettingsRow
        icon={Moon}
        label="Dark mode"
        description="Switch appearance"
        right={
          <span className="text-[10px] font-semibold uppercase tracking-widest
            text-[#a1bc98] bg-[#F1F3E0] border border-[#D2DCB6] rounded-lg px-2.5 py-1.5">
            Soon
          </span>
        }
      />

      {/* Multiple structures: Premium only */}
      <SettingsRow
        icon={Layers}
        label="Multiple structures"
        description={isPremium ? "Run parallel structures" : "Premium feature"}
        right={
          isPremium ? (
            <ToggleSwitch
              enabled={true}
              onToggle={() => { }}
              ariaLabel="Toggle multiple structures"
            />
          ) : (
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
      {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
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
  // const [user, setUser] = useState<ProfileUser | null>(null);
  const { user, loading: userLoading, setUser, refresh } = useUser();
  const [editing, setEditing] = useState(false);
  const [structures, setStructures] = useState<ApiStructure[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Separate try blocks so one failing call can't hide the others
  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await getStructures();
      setStructures(res.data.structures);
    } catch (error) {
      console.error("Error loading structures: ", error);
    }

    try {
      const res = await getTodayTasks();
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error loading tasks: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const active = structures.filter((s) => s.status === "active");
  const primary = active.find((s) => s.isCurrent) ?? active[0];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 max-w-lg mx-auto">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2d3328]">Profile</h2>
          <p className="text-sm mt-0.5 text-[#778873]">
            Manage your account and preferences.
          </p>
        </div>

        {editing && user && (
          <ProfileEditModal
            user={user}
            onSaved={(updated) => setUser(updated)}
            onClose={() => setEditing(false)}
          />
        )}

        {isLoading || userLoading ? (
          <Loader />
        ) : !user ? (
          <EmptyState
            icon={UserX}
            title="Couldn't load your profile"
            description="Something went wrong while loading your account."
            actionLabel="Try again"
            onAction={() => {
              refresh();
              load();
            }}
          />
        ) : (
          <>
            <ProfileCard user={user} onEdit={() => setEditing(true)} />
            <SystemSnapshotCard
              activeCount={active.length}
              dayNumber={primary ? getDayNumber(primary.startDate) : null}
              done={tasks.filter((t) => t.completed).length}
              total={tasks.length}
            />
            <PreferencesCard />
            <AccountCard />
          </>
        )}

        <p className="text-center text-[10px] font-medium tracking-widest uppercase pb-2 text-[#D2DCB6]">
          Struct V1 · MVP
        </p>
      </div>
    </DashboardLayout>
  );
}