import { Release } from "@/interfaces/release";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { RELEASE_COLLECTION_ID } from "@/lib/constants";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";
import PostCard from "./post-card";

export default async function Posts({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const queries = siteId
    ? [
        Query.equal("organizationId", siteId),
        Query.equal("userId", session.user.id),
        Query.orderAsc("$createdAt"),
      ]
    : [];

  const releases = await db.list<Release>(RELEASE_COLLECTION_ID, queries);

  return releases.documents.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {releases.documents.map((release) => (
        <PostCard key={release.$id} data={release} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Posts Yet</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        You do not have any posts yet. Create one to get started.
      </p>
    </div>
  );
}
