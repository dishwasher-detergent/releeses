import CreateOrg from "@/components/ui/create-org";
import Organizations from "@/components/ui/organizations";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export default async function AllOrganizations({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const organizations = await db.list<Organization>(
    ORGANIZATION_COLLECTION_ID,
    [Query.equal("userId", session.user.id), Query.orderAsc("$createdAt")],
  );

  return (
    <>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">All Organizations</h1>
        <CreateOrg />
      </div>
      <Separator />
      <Organizations />
    </>
  );
}
