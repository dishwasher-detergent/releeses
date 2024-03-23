import PlaceholderCard from "@/components/placeholder-card";
import CreateOrg from "@/components/ui/create-org";
import OrgCard from "@/components/ui/org-card";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { LucideGhost } from "lucide-react";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";
import { Suspense } from "react";

export default async function AllOrganizations({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const organizations = await db.list<Organization>(
    ORGANIZATION_COLLECTION_ID,
    [Query.equal("userId", session.user.id), Query.orderAsc("$createdAt")],
  );

  return (
    <>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">All Organizations</h1>
        <CreateOrg />
      </div>
      <Separator />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PlaceholderCard key={i} />
            ))}
          </div>
        }
      >
        <div className="p-4">
          {organizations.documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {organizations.documents.map((org) => (
                <OrgCard key={org.$id} data={org} />
              ))}
            </div>
          ) : (
            <div className="bg-secondary flex h-24 w-full flex-row items-center justify-center gap-4 rounded-3xl">
              <LucideGhost className="bg-primary-foreground text-primary dark:bg-primary dark:text-primary-foreground h-10 w-10 flex-none rounded-xl p-2" />
              <p>You've not got any organizations, yet!</p>
            </div>
          )}
        </div>
      </Suspense>
    </>
  );
}
