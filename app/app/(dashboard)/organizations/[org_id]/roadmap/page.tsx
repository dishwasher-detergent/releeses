import { RoadmapForm } from "@/components/form/roadmap-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function RoadmapPage({
  params,
}: {
  params: { org_id: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("organization")
    .select("roadmap(*)")
    .eq("id", decodeURIComponent(params.org_id))
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <section className="relative h-full overflow-y-auto">
      <div className="m-2 flex flex-col gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-900 md:m-4 md:p-4">
        <RoadmapForm data={data.roadmap} />
      </div>
    </section>
  );
}
