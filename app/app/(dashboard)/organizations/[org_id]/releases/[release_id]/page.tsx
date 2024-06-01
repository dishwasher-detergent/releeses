import Editor from "@/components/ui/editor";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function ReleasePage({
  params,
}: {
  params: { release_id: string };
}) {
  const supabase = createClient();
  const session = await getSession();

  if (!session.data.user) {
    redirect("/signin");
  }

  const { data, error } = await supabase
    .from("release")
    .select(
      "*, organization(subdomain, customDomain, organization, repository)",
    )
    .eq("id", decodeURIComponent(params.release_id))
    .eq("user_id", session?.data?.user?.id)
    .single();

  if (error || !data) {
    notFound();
  }

  // @ts-ignore
  return <Editor release={data} />;
}
