"use client";

// ProfileEditModal — edit name and profile photo

import { useState, useEffect } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { updateProfile } from "@/lib/services/auth.service";

export type ProfileUser = {
  firstname: string;
  lastname: string;
  email: string;
  avatarUrl?: string | null;
};

type Props = {
  user: ProfileUser;
  onSaved: (user: ProfileUser) => void;
  onClose: () => void;
};

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export default function ProfileEditModal({ user, onSaved, onClose }: Props) {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Local preview of the chosen photo; freed when it changes or the modal closes
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Escape closes, but not while saving
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, saving]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = ""; // lets the same file be picked again
    if (!picked) return;
    if (!ALLOWED.includes(picked.type)) return toast.error("Use a JPEG, PNG or WebP image");
    if (picked.size > MAX_BYTES) return toast.error("Photo must be 2 MB or smaller");
    setFile(picked);
  };

  const nameOk = firstname.trim().length >= 3 && lastname.trim().length >= 3;
  const changed =
    firstname.trim() !== user.firstname || lastname.trim() !== user.lastname || !!file;
  const canSave = nameOk && changed && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      // send only what changed
      const form = new FormData();
      if (firstname.trim() !== user.firstname) form.append("firstname", firstname.trim());
      if (lastname.trim() !== user.lastname) form.append("lastname", lastname.trim());
      if (file) form.append("avatar", file);

      const res = await updateProfile(form);
      onSaved(res.data.user);
      toast.success("Profile updated");
      onClose();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Could not update profile"
          : "Could not update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const shown = preview ?? user.avatarUrl ?? null;
  const initials = `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[#D2DCB6] bg-[#F1F3E0] text-sm text-[#2d3328] " +
    "placeholder:text-[#a1bc98] focus:outline-none focus:ring-2 focus:ring-[#A1BC98] " +
    "focus:border-transparent transition-all duration-150";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d3328]/30 backdrop-blur-sm"
      onClick={() => !saving && onClose()}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[5px_5px_0px_0px_#d2dcb6] p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#2d3328]">Edit profile</h3>
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#778873]
              hover:bg-[#F1F3E0] hover:text-[#2d3328] disabled:opacity-40 transition-all duration-150"
          >
            <X size={15} />
          </button>
        </div>

        {/* Photo */}
        <div className="flex flex-col items-center gap-2">
          <label className="relative cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center
              text-3xl font-bold bg-[#F1F3E0] text-[#778873]">
              {shown ? (
                <img src={shown} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center
              justify-center bg-[#2d3328] text-[#F1F3E0] shadow-md">
              <Camera size={14} />
            </span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={handleFile} />
          </label>
          <p className="text-[11px] text-[#a1bc98]">JPEG, PNG or WebP, up to 2 MB</p>
        </div>

        {/* Names */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4f5c49] uppercase tracking-wider">
              First name
            </label>
            <input value={firstname} onChange={(e) => setFirstname(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4f5c49] uppercase tracking-wider">
              Last name
            </label>
            <input value={lastname} onChange={(e) => setLastname(e.target.value)} className={inputClass} />
          </div>
          {!nameOk && (
            <p className="text-xs text-red-400">Names need at least 3 characters.</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#D2DCB6] text-sm font-semibold
              text-[#778873] hover:border-[#A1BC98] hover:text-[#2d3328]
              disabled:opacity-50 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center
              justify-center gap-2 transition-all duration-150
              ${canSave
                ? "bg-[#2d3328] text-[#F1F3E0] shadow-[4px_4px_0px_0px_#a1bc98] hover:shadow-[2px_2px_0px_0px_#778873] hover:translate-x-[2px] hover:translate-y-[2px]"
                : "bg-[#D2DCB6] text-[#a1bc98] cursor-not-allowed"}`}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}