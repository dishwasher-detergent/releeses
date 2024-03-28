import ReleaesCard from "@/components/ui/release-card";
import { Release } from "@/interfaces/release";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { RELEASE_COLLECTION_ID } from "@/lib/constants";
import { LucideGhost } from "lucide-react";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export default async function Releases({
  orgId,
  limit,
}: {
  orgId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const baseQueries = orgId
    ? [
        Query.equal("organizationId", orgId),
        Query.equal("userId", session.user.id),
        Query.orderDesc("$createdAt"),
      ]
    : [];

  const limitQuery = limit ? [Query.limit(limit)] : [];

  const releases = await db.list<Release>(RELEASE_COLLECTION_ID, [
    ...baseQueries,
    ...limitQuery,
  ]);

  return releases.documents.length > 0 ? (
    <div className="grid grid-cols-1 overflow-y-auto sm:grid-cols-2 xl:grid-cols-4">
      {releases.documents.map((release) => (
        <ReleaesCard
          key={release.$id}
          data={release}
          org={release.organization}
        />
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-row items-center justify-center gap-4 pt-24">
      <LucideGhost className="h-10 w-10 flex-none rounded-xl bg-primary-foreground p-2 text-primary dark:bg-primary dark:text-primary-foreground" />
      <p>Time to start releasing stuff!</p>
    </div>
  );
}
