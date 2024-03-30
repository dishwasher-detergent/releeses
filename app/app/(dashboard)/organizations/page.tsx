import LoadingCard from "@/components/loading/card";
import Organizations from "@/components/ui/organizations";
import { Suspense } from "react";

export default async function AllOrganizations() {
  return (
    <section className="relative h-full overflow-y-auto">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
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
