import LoadingCard from "@/components/loading/card";
import Releases from "@/components/ui/releases";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function OrgReleases({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const session = await getSession();

  if (!session.data.user) {
    redirect("/signin");
  }

  const { data, error } = await supabase
    .from("organization")
    .select()
    .eq("id", decodeURIComponent(params.id))
    .eq("user_id", session?.data?.user?.id)
    .single();

  if (error || !data) {
    notFound();
  }

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
        <Releases orgId={params.id} />
      </Suspense>
    </section>
  );
}
