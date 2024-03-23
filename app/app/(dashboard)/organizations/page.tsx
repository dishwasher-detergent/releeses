import LoadingCard from "@/components/loading/card";
import CreateOrg from "@/components/ui/create-org";
import Organizations from "@/components/ui/organizations";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AllOrganizations() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">All Organizations</h1>
        <CreateOrg />
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
        <Organizations />
      </Suspense>
    </>
  );
}
