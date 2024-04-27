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
      <div className="m-4 flex flex-col gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-4">
        {children}
      </div>
    </>
  );
}
