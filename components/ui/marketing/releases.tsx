import ReleaesCard from "@/components/ui/marketing/release-card";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function Releases({
  orgId,
  limit = 4,
}: {
  orgId?: string;
  limit?: number;
}) {
  const supabase = createClient();

  let query = supabase
    .from("release")
    .select("*, organization(*)")
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (orgId) {
    query.eq("organizationId", orgId);
  }

  const { data, error } = await query;

  if (error || !data) {
    notFound();
  }

  return data.length > 0 ? (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data.map((release) => (
        <ReleaesCard
          marketing={true}
          key={release.id}
          data={release}
          org={release.organization!}
        />
      ))}
    </div>
  ) : null;
}
