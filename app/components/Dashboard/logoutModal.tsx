"use client";

// LogoutModal — confirmation modal before logging out
// Import and use in ProfilePage — wire onConfirm to auth logout later

import { LogOut, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/services/auth.service";
import { useState } from "react";
import loading from "@/app/components/Loader";
import Loader from "@/app/components/Loader";

type LogoutModalProps = {
    onClose: () => void;
};

export default function LogoutModal({ onClose }: LogoutModalProps) {

    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsLoggingOut(true);
            await toast.promise(logout(), {
                loading: "Logging out...",
                success: "Logged out successfully",
                error: (err) =>
                    err?.response?.data?.message || "Logout failed",
            });

            onClose();
            router.push("/Auth/login");
        } catch (error) {
            console.error("Logout error: ", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2d3328]/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl border border-[#D2DCB6]
          shadow-[5px_5px_0px_0px_#d2dcb6] p-6 w-full max-w-sm flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="text-base font-bold text-[#2d3328]">Log out?</h3>
                        <p className="text-sm text-[#778873] mt-1">
                            You'll need to log back in to access your structures.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg
              text-[#D2DCB6] hover:text-[#778873] hover:bg-[#F1F3E0]
              transition-all duration-150 flex-shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border-2 border-[#D2DCB6] text-[#778873]
      text-sm font-semibold hover:border-[#A1BC98] hover:text-[#2d3328]
      hover:bg-[#F1F3E0] transition-all duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoggingOut}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold'
                            flex items-center justify-center gap-2
      bg-red-400 text-white hover:bg-red-500
      disabled:opacity-70 disabled:cursor-not-allowed
      transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader variant="inline" size={19} />
                                Logging out...
                            </>
                        ) : (
                            <>
                                <LogOut size={16} />
                                Log out
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}