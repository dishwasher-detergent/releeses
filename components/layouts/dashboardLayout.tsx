"use client";

import Nav from "@/components/ui/nav";
import { LucideBoxes, LucideMenu } from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { Button } from "../ui/button";
import CreateOrg from "../ui/create-org";
import CreateRelease from "../ui/create-release";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export default function DashboardLayoutComponent({
  children,
}: {
  children: ReactNode;
}) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const title = useMemo<React.ReactNode>(() => {
    if (segments.length === 0) {
      return <p className="text-xl font-bold">Overview</p>;
    }

    if (segments[0] === "settings") {
      return <p className="text-xl font-bold">Settings</p>;
    }

    if (segments[0] === "organizations") {
      return (
        <div className="flex flex-1 flex-row items-center justify-between">
          <p className="text-xl font-bold">Organizations</p>
          <CreateOrg />
        </div>
      );
    }

    if (segments[0] === "release" && id) {
      if (segments.includes("settings"))
        return <p className="text-xl font-bold">Release Settings</p>;

      return <p className="text-xl font-bold">Release</p>;
    }

    if (segments[0] === "organization" && id) {
      if (segments.includes("settings"))
        return <p className="text-xl font-bold">Organization Settings</p>;

      return (
        <div className="flex flex-1 flex-row items-center justify-between">
          <p className="text-xl font-bold">Organization</p>
          <CreateRelease />
        </div>
      );
    }

    return "";
  }, [segments, id]);

  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <LucideBoxes className="h-6 w-6" />
              <span className="">Releaser</span>
            </Link>
          </div>
          <Nav />
        </div>
      </div>
      <div className="flex h-full max-h-screen flex-col overflow-hidden">
        <header className="flex h-14 flex-none items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <LucideMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Nav />
            </SheetContent>
          </Sheet>
          {title}
        </header>
        <main className="relative flex flex-1 flex-col overflow-hidden bg-muted">
          {children}
        </main>
      </div>
    </div>
  );
}
