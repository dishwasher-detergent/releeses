import PlaceholderCard from "@/components/placeholder-card";
import { Badge } from "@/components/ui/badge";
import CreateRelease from "@/components/ui/create-release";
import ReleaseCard from "@/components/ui/release-card";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { LucideExternalLink, LucideGhost } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SitePosts({
  params,
}: {
  params: { id: string };
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
          All Releases{" "}
          <Badge className="z-10 px-2 py-1">
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
          {data.release.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.release.map((release) => (
                <ReleaseCard key={release.$id} data={release} org={data} />
              ))}
            </div>
          ) : (
            <div className="bg-secondary flex h-24 w-full flex-row items-center justify-center gap-4 rounded-3xl">
              <LucideGhost className="bg-primary-foreground text-primary dark:bg-primary dark:text-primary-foreground h-10 w-10 flex-none rounded-xl p-2" />
              <p>This organization has no releases!</p>
            </div>
          )}
        </div>
      </Suspense>
    </>
  );
}
