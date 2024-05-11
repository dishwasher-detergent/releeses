import DashboardLayoutComponent from "@/components/layouts/dashboardLayout";
import { getSession } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard | Releeses",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: user, error: user_error } = await getSession();

  if (user_error || !user?.user) {
    redirect("/signin");
  }

  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}
