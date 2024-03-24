import OrgCard from "@/components/ui/org-card";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { LucideGhost } from "lucide-react";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export default async function Organizations({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const organizations = await db.list<Organization>(
    ORGANIZATION_COLLECTION_ID,
    [Query.equal("userId", session.user.id), Query.orderAsc("$createdAt")],
  );

  return organizations.documents.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {organizations.documents.map((org) => (
        <OrgCard key={org.$id} data={org} />
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-row items-center justify-center gap-4 pt-24">
      <LucideGhost className="h-10 w-10 flex-none rounded-xl bg-primary-foreground p-2 text-primary dark:bg-primary dark:text-primary-foreground" />
      <p>Looks like you&apos;ve not got any organizations, yet!</p>
    </div>
  );
}
