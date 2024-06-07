"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Profile from "@/components/ui/profile";
import { Separator } from "@/components/ui/separator";
import { Nav as NavItems } from "@/interfaces/nav";
import { cn } from "@/lib/utils";
import {
  LucideArrowLeft,
  LucideEdit3,
  LucideGlobe,
  LucideLayout,
  LucideMap,
  LucideNewspaper,
  LucideSettings,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useMemo } from "react";

interface NavProps {
  children?: ReactNode;
}

export default function Nav({ children }: NavProps) {
  const segments = useSelectedLayoutSegments();
  const { org_id, release_id } = useParams() as {
    org_id?: number;
    release_id?: number;
  };

  const tabs = useMemo<NavItems[]>(() => {
    if (segments[2] === "releases" && org_id && release_id) {
      return [
        {
          name: "Back to All Releases",
          href: org_id ? `/organizations/${org_id}` : "/organizations",
          icon: LucideArrowLeft,
        },
        {
          name: "Editor",
          href: `/organizations/${org_id}/releases/${release_id}`,
          isActive: segments.length === 2,
          icon: LucideEdit3,
        },
        {
          name: "Settings",
          href: `/organizations/${org_id}/releases/${release_id}/settings`,
          isActive: segments.includes("settings"),
          icon: LucideSettings,
        },
      ];
    }

    if (segments[0] === "organizations" && org_id) {
      return [
        {
          name: "Back to All Orgs",
          href: "/organizations",
          icon: LucideArrowLeft,
        },
        {
          name: "Releases",
          href: `/organizations/${org_id}`,
          isActive: segments[1] != "roadmaps" && segments.length === 2,
          icon: LucideNewspaper,
        },
        {
          name: "Roadmap",
          href: `/organizations/${org_id}/roadmap`,
          isActive: segments[1] === "roadmap",
          icon: LucideMap,
        },
        {
          name: "Settings",
          href: `/organizations/${org_id}/settings`,
          isActive: segments.includes("settings"),
          icon: LucideSettings,
        },
      ];
    }

    return [
      {
        name: "Overview",
        href: "/",
        isActive: segments.length === 0,
        icon: LucideLayout,
      },
      {
        name: "Organizations",
        href: "/organizations",
        isActive: segments[0] === "organizations",
        icon: LucideGlobe,
      },
    ];
  }, [segments, org_id, release_id]);

  return (
    <div className="flex flex-1 flex-col gap-2 py-2">
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {tabs.map((link, index) => (
          <Button
            key={index}
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              "justify-start text-foreground",
              link.isActive && "bg-primary text-background",
            )}
          >
            <Link key={index} href={link.disabled ? "#" : link.href}>
              <span className="flex flex-1 flex-row items-center gap-1">
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </span>
              {link.badge && (
                <Badge variant="secondary" className="rounded-full">
                  {link.badge}
                </Badge>
              )}
            </Link>
          </Button>
        ))}
        {children}
      </nav>
      <Separator />
      <div className="flex flex-row items-center gap-2 px-2">
        <Profile />
      </div>
    </div>
  );
}
