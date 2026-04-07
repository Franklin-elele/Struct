// NotificationBell — bell icon with optional unread dot indicator
// hasNotification prop controls whether the red dot is shown

"use client";

import { Bell } from "lucide-react";

type NotificationBellProps = {
  // true = show unread indicator dot
  hasNotification: boolean;
  onClick?: () => void;
};

export default function NotificationBell({
  hasNotification,
  onClick,
}: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl
        text-[#778873] hover:bg-[#F1F3E0] hover:text-[#2d3328]
        transition-all duration-150"
      aria-label={hasNotification ? "Notifications (unread)" : "Notifications"}
    >
      <Bell size={18} />

      {/* Unread indicator — only rendered when hasNotification is true */}
      {hasNotification && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#778873] border-2 border-white" />
      )}
    </button>
  );
}