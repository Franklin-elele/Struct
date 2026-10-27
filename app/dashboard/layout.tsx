import { UserProvider } from "@/app/components/Dashboard/UserContext";
import DashboardShell from "@/app/components/Dashboard/DashboardShell";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}