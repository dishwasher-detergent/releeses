"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export default function OrgSettingsNav() {
  const { id } = useParams() as { id?: string };
  const segment = useSelectedLayoutSegment();

  const items = [
    {
      name: "General",
      href: `/organizations/${id}/settings`,
      isActive: segment == null,
    },
    {
      name: "Domains",
      href: `/organizations/${id}/settings/domains`,
      isActive: segment == "domains",
    },
    {
      name: "Appearance",
      href: `/organizations/${id}/settings/appearance`,
      isActive: segment == "appearance",
    },
    {
      name: "Git",
      href: `/organizations/${id}/settings/git`,
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
