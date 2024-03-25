"use client";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export default function OrgSettingsNav() {
  const { id } = useParams() as { id?: string };
  const segment = useSelectedLayoutSegment();

  const items = [
    {
      name: "General",
      href: `/organization/${id}/settings`,
      isActive: segment == null,
    },
    {
      name: "Domains",
      href: `/organization/${id}/settings/domains`,
      isActive: segment == "domains",
    },
    {
      name: "Appearance",
      href: `/organization/${id}/settings/appearance`,
      isActive: segment == "appearance",
    },
  ];

  return (
    <>
      <div className="flex bg-background p-2">
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
      <Separator />
    </>
  );
}
