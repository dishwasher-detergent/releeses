import LoadingCard from "@/components/loading/card";
import Releases from "@/components/ui/releases";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function OrgReleases({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organization")
    .select()
    .eq("id", decodeURIComponent(params.id))
    .single();

  if (error || !data) {
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
