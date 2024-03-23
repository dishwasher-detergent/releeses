import { buttonVariants } from "@/components/ui/button";
import CreateOrg from "@/components/ui/create-org";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import Link from "next/link";
import { Query } from "node-appwrite";

export default async function OverviewOrgsCTA() {
  const session = await getSession();
  if (!session) {
    return 0;
  }

  const organizations = await db.list(ORGANIZATION_COLLECTION_ID, [
    Query.equal("userId", session.user.id),
  ]);

  return organizations.total > 0 ? (
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
