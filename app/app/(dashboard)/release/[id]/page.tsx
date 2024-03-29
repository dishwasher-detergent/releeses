import Editor from "@/components/ui/editor";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ReleasePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("release")
    .select("*, organization(subdomain, customDomain)")
    .eq("id", decodeURIComponent(params.id))
    .single();

  if (error || !data) {
    notFound();
  }

  return <Editor release={data} />;
}
