import LoadingCard from "@/components/loading/card";
import { Badge } from "@/components/ui/badge";
import CreateRelease from "@/components/ui/create-release";
import Releases from "@/components/ui/releases";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { LucideExternalLink } from "lucide-react";
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
    <section className="relative h-full overflow-y-auto">
      <div className="sticky top-0 z-10 flex h-[52px] items-center justify-between bg-background/90 px-4 py-2 backdrop-blur-sm">
        <h1 className="text-xl font-bold">
          All Releases
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
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        }
      >
        <Releases siteId={params.id} />
      </Suspense>
    </section>
  );
}
