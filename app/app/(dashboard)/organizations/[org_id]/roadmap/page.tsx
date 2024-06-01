import Roadmap from "@/components/ui/roadmap";

export default function RoadmapPage() {
  return (
    <section className="relative h-full overflow-y-auto">
      <div className="m-2 flex flex-col gap-4 overflow-y-auto rounded-xl border border-dashed border-slate-300 p-2 dark:border-slate-900 md:m-4 md:p-4">
        <Roadmap />
      </div>
    </section>
  );
}
