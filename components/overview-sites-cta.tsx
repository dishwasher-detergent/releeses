import CreateOrg from "@/components/ui/create-org";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function OverviewSitesCTA() {
  const session = await getSession();
  if (!session) {
    return 0;
  }
  const sites = 1;

  return sites > 0 ? (
    <Link
      href="/organizations"
      className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-slate-100 dark:border-slate-700 dark:hover:border-slate-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-slate-800"
    >
      View All Organizations
    </Link>
  ) : (
    <CreateOrg />
  );
}
