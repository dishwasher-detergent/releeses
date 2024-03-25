import OrgSettingsNav from "@/components/ui/org-settings-nav";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function OrgSettingsLayout({
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

  return (
    <>
      <OrgSettingsNav />
      <div className="flex flex-1 flex-col overflow-y-auto bg-background">
        {children}
      </div>
    </>
  );
}
