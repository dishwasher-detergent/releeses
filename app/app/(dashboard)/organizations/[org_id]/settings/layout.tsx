import OrgSettingsNav from "@/components/ui/org-settings-nav";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function OrgSettingsLayout({
  params,
  children,
}: {
  params: { org_id: string };
  children: ReactNode;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organization")
    .select()
    .eq("id", decodeURIComponent(params.org_id))
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <>
      <OrgSettingsNav />
      <div className="m-2 flex flex-col gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-900 md:m-4 md:p-4">
        {children}
      </div>
    </>
  );
}
