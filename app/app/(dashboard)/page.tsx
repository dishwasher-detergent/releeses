import LoadingCard from "@/components/loading/card";
import Organizations from "@/components/ui/organizations";
import OverviewOrgsCTA from "@/components/ui/overview-orgs-cta";
import Releases from "@/components/ui/releases";
import { LucideGlobe, LucideNewspaper } from "lucide-react";
import { Suspense } from "react";

export default function Overview() {
  return (
    <>
      <section className="relative md:h-1/2 md:overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b bg-background/90 px-4 backdrop-blur-md lg:h-[60px] lg:px-6">
          <div className="flex flex-row items-center gap-2">
            <LucideGlobe className="size-4" />
            <p className="font-bold">New Organizations</p>
          </div>
          <OverviewOrgsCTA />
        </header>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          }
        >
          <Organizations limit={4} />
        </Suspense>
      </section>
      <section className="relative md:h-1/2 md:overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-y bg-background/90 px-4 backdrop-blur-md lg:h-[60px] lg:px-6">
          <LucideNewspaper className="size-4" />
          <p className="font-bold">Recent Releases</p>
        </header>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          }
        >
          <Releases limit={4} />
        </Suspense>
      </section>
    </>
  );
}
