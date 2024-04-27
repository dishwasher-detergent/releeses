import OrgCard from "@/components/ui/org-card";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LucideGhost } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export default async function Organizations({
  limit = 50,
}: {
  limit?: number;
}) {
  const supabase = createClient();
  const session = await getSession();

  if (!session.data.user) {
    redirect("/signin");
  }

  const { data, error } = await supabase
    .from("organization")
    .select("*, release(id)")
    .eq("user_id", session?.data?.user?.id)
    .order("created_at", {
      ascending: true,
    })
    .limit(limit);

  if (error || !data) {
    notFound();
  }

  return data.length > 0 ? (
    <div className="m-4 grid grid-cols-1 gap-4 rounded-xl border border-dashed border-slate-300 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.map((org) => (
        <OrgCard key={org.id} org={org} />
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-row items-center justify-center gap-4 pt-24">
      <LucideGhost className="h-10 w-10 flex-none rounded-xl bg-primary-foreground p-2 text-primary dark:bg-primary dark:text-primary-foreground" />
      <p>Looks like you&apos;ve not got any organizations, yet!</p>
    </div>
  );
}
