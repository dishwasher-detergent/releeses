import { buttonVariants } from "@/components/ui/button";
import CreateOrg from "@/components/ui/create-org";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function OverviewOrgsCTA() {
  const supabase = createClient();

  const { count } = await supabase
    .from("organization")
    .select("*", { count: "exact" });

  return count ?? 0 > 0 ? (
    <Link
      href="/organizations"
      className={buttonVariants({ variant: "default", size: "sm" })}
    >
      View All Organizations
    </Link>
  ) : (
    <CreateOrg />
  );
}
