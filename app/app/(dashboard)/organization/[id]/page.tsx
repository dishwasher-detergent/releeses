import LoadingCard from "@/components/loading/card";
import Releases from "@/components/ui/releases";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function OrgReleases({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  let data: Organization;

  try {
    data = await db.get<Organization>(
      ORGANIZATION_COLLECTION_ID,
      decodeURIComponent(params.id),
    );
  } catch (error: any) {
    notFound();
  }

  return (
    <section className="relative h-full overflow-y-auto">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        }
      >
        <Releases orgId={params.id} />
      </Suspense>
    </section>
  );
}
