"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export default function OrgSettingsNav() {
  const { org_id } = useParams() as { org_id?: string };
  const segment = useSelectedLayoutSegment();

  const items = [
    {
      name: "General",
      href: `/organizations/${org_id}/settings`,
      isActive: segment == null,
    },
    {
      name: "Domains",
      href: `/organizations/${org_id}/settings/domains`,
      isActive: segment == "domains",
    },
    {
      name: "Appearance",
      href: `/organizations/${org_id}/settings/appearance`,
      isActive: segment == "appearance",
    },
    {
      name: "Git",
      href: `/organizations/${org_id}/settings/git`,
      isActive: segment == "git",
    },
  ];

  return (
    <>
      <div className="flex p-2">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              item.isActive && "bg-foreground text-background",
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}
