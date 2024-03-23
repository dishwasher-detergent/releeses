import DashboardLayoutComponent from "@/components/layouts/dashboardLayout";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}
