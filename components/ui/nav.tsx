"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Nav } from "@/interfaces/nav";
import { getOrganizationFromReleaseId } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
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
import {
  useParams,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface NavProps {
  children?: ReactNode;
}

export default function Nav({ children }: NavProps) {
  const router = useRouter();
  const supabase = createClient();
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: number };

  const [orgId, setOrgId] = useState<number | null>();

  useEffect(() => {
    if (segments[0] === "release" && id) {
      getOrganizationFromReleaseId(id).then((res) => {
        setOrgId(res?.organizationId);
      });
    }
  }, []);

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
          name: "Back to All Releases",
          href: orgId ? `/organization/${orgId}` : "/organizations",
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
    ];
  }, [segments, id, orgId]);

  return (
    <div className="flex flex-1 flex-col gap-4 py-2">
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {tabs.map((link, index) => (
          <Button
            key={index}
            asChild
            variant="ghost"
            className={cn(
              "justify-start text-foreground",
              link.isActive && "bg-foreground text-background",
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
      <div className="px-2">
        <button
          onClick={async () => {
            await supabase.auth.signOut();

            router.push("/signin");
          }}
        >
          Sign Out
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
