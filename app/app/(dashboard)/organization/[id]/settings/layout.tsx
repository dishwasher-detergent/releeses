import OrgSettingsNav from "@/components/ui/org-settings-nav";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function OrgSettingsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organization")
    .select()
    .eq("id", decodeURIComponent(params.id))
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <>
      <OrgSettingsNav />
      <div className="flex flex-1 flex-col overflow-y-auto bg-background">
        {children}
      </div>
    </>
  );
}
