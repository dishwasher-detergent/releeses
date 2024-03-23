import { Badge } from "@/components/ui/badge";
import CreateRelease from "@/components/ui/create-release";
import OrgSettingsNav from "@/components/ui/org-settings-nav";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { LucideExternalLink } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SiteAnalyticsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await db.get<Organization>(
    ORGANIZATION_COLLECTION_ID,
    decodeURIComponent(params.id),
  );
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">
          Organization Settings
          <Badge className="z-10 ml-6 px-2 py-1" variant="secondary">
            <a
              href={
                process.env.NEXT_PUBLIC_VERCEL_ENV
                  ? `https://${url}`
                  : `http://${data.subdomain}.localhost:3000`
              }
              target="_blank"
              rel="noreferrer"
              className="flex flex-row items-center gap-2"
            >
              {url}
              <LucideExternalLink className="size-4" />
            </a>
          </Badge>
        </h1>
        <CreateRelease />
      </div>
      <Separator />
      <OrgSettingsNav />
      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
    </>
  );
}
