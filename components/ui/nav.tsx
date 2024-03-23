"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Nav } from "@/interfaces/nav";
import { getOrganizationFromReleaseId } from "@/lib/actions";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Edit3,
  Globe,
  LayoutDashboard,
  Newspaper,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface NavProps {
  children: ReactNode;
  isCollapsed: boolean;
}

export default function Nav({ children, isCollapsed }: NavProps) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();

  useEffect(() => {
    if (segments[0] === "release" && id) {
      getOrganizationFromReleaseId(id).then((id) => {
        setSiteId(id);
      });
    }
  }, [segments, id]);

  const tabs = useMemo<Nav[]>(() => {
    if (segments[0] === "organization" && id) {
      return [
        {
          name: "Back to All Orgs",
          href: "/organizations",
          icon: ArrowLeft,
        },
        {
          name: "Releases",
          href: `/organization/${id}`,
          isActive: segments.length === 2,
          icon: Newspaper,
        },
        {
          name: "Settings",
          href: `/organization/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: Settings,
        },
      ];
    } else if (segments[0] === "release" && id) {
      return [
        {
          name: "Back to All Posts",
          href: siteId ? `/organization/${siteId}` : "/organization",
          icon: ArrowLeft,
        },
        {
          name: "Editor",
          href: `/release/${id}`,
          isActive: segments.length === 2,
          icon: Edit3,
        },
        {
          name: "Settings",
          href: `/release/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: Settings,
        },
      ];
    }
    return [
      {
        name: "Overview",
        href: "/",
        isActive: segments.length === 0,
        icon: LayoutDashboard,
      },
      {
        name: "Organizations",
        href: "/organizations",
        isActive: segments[0] === "organizations",
        icon: Globe,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: Settings,
      },
    ];
  }, [segments, id, siteId]);

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {tabs.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    link.isActive && "bg-foreground text-white",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.name}
                {link.badge && <Badge>{link.badge}</Badge>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                link.isActive && "bg-foreground text-white",
                "justify-start",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
              {link.badge && <Badge>{link.badge}</Badge>}
            </Link>
          ),
        )}
        {children}
      </nav>
    </div>
  );
}
