import Editor from "@/components/editor";
import { Release } from "@/interfaces/release";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { RELEASE_COLLECTION_ID } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await db.get<Release>(
    RELEASE_COLLECTION_ID,
    decodeURIComponent(params.id),
  );
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return <Editor post={data} />;
}
