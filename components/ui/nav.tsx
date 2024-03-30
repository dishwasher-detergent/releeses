"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/interfaces/nav";
import { getOrganizationFromReleaseId } from "@/lib/actions";
import { cn } from "@/lib/utils";
import {
  LucideArrowLeft,
  LucideEdit3,
  LucideGlobe,
  LucideLayout,
  LucideNewspaper,
  LucideSettings,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Profile from "./profile";

interface NavProps {
  children?: ReactNode;
}

export default function Nav({ children }: NavProps) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: number };

  const [orgId, setOrgId] = useState<number | null>();

  useEffect(() => {
    if (segments[0] === "release" && id) {
      getOrganizationFromReleaseId(id).then((res) => {
        setOrgId(res?.organizationId);
      });
    }
  }, [id]);

  const tabs = useMemo<Nav[]>(() => {
    if (segments[0] === "organization" && id) {
      return [
        {
          name: "Back to All Orgs",
          href: "/organizations",
          icon: LucideArrowLeft,
        },
        {
          name: "Releases",
          href: `/organization/${id}`,
          isActive: segments.length === 2,
          icon: LucideNewspaper,
        },
        {
          name: "Settings",
          href: `/organization/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: LucideSettings,
        },
      ];
    } else if (segments[0] === "release" && id) {
      return [
        {
          name: "Back to All Releases",
          href: orgId ? `/organization/${orgId}` : "/organizations",
          icon: LucideArrowLeft,
        },
        {
          name: "Editor",
          href: `/release/${id}`,
          isActive: segments.length === 2,
          icon: LucideEdit3,
        },
        {
          name: "Settings",
          href: `/release/${id}/settings`,
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
  }, [segments, id, orgId]);

  return (
    <div className="flex flex-1 flex-col gap-2 py-2">
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {tabs.map((link, index) => (
          <Button
            key={index}
            asChild
            variant="ghost"
            className={cn(
              "justify-start text-foreground",
              link.isActive && "bg-primary text-background",
            )}
          >
            <Link key={index} href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
              {link.badge && <Badge>{link.badge}</Badge>}
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
