import ReleaesCard from "@/components/ui/release-card";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LucideGhost } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export default async function Releases({
  orgId,
  limit = 50,
}: {
  orgId?: string;
  limit?: number;
}) {
  const supabase = createClient();
  const session = await getSession();

  if (!session.data.user) {
    redirect("/signin");
  }

  let query = supabase
    .from("release")
    .select("*, organization(*)")
    .eq("user_id", session?.data?.user?.id)
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
    <div className="m-2 flex flex-col gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-900 md:m-4 md:p-4">
      {data.map((release) => (
        <ReleaesCard
          key={release.id}
          data={release}
          org={release.organization!}
        />
      ))}
    </div>
  ) : (
    <div className="m-2 flex flex-col items-center justify-center gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-900 md:m-4 md:p-4">
      <LucideGhost className="h-10 w-10 flex-none rounded-xl bg-primary p-2 text-primary-foreground" />
      <p>Time to start releasing stuff!</p>
    </div>
  );
}
