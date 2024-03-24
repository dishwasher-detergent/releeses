import LoadingCard from "@/components/loading/card";
import Organizations from "@/components/ui/organizations";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AllOrganizations() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
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
        <Organizations />
      </Suspense>
    </section>
  );
}
