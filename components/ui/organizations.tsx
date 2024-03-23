import OrgCard from "@/components/ui/org-card";
import { Organization } from "@/interfaces/organization";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export default async function Organizations({ limit }: { limit?: number }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const organizations = await db.list<Organization>(
    ORGANIZATION_COLLECTION_ID,
    [Query.equal("userId", session.user.id), Query.orderAsc("$createdAt")],
  );

  return organizations.documents.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {organizations.documents.map((org) => (
        <OrgCard key={org.$id} data={org} />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Organizations Yet</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any organizations yet. Create one to get started.
      </p>
    </div>
  );
}
