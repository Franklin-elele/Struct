import { UserProvider } from "@/app/components/Dashboard/UserContext";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}