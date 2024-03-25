import LoadingCard from "@/components/loading/card";
import Organizations from "@/components/ui/organizations";
import OverviewOrgsCTA from "@/components/ui/overview-orgs-cta";
import Releases from "@/components/ui/releases";
import { Suspense } from "react";

export default function Overview() {
  return (
    <>
      <section className="relative h-1/2 overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur-md lg:h-[60px] lg:px-6">
          <p className="font-bold">New Organizations</p>
          <OverviewOrgsCTA />
        </header>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          }
        >
          <Organizations limit={4} />
        </Suspense>
      </section>
      <section className="relative h-1/2 overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-y bg-background/90 px-4 backdrop-blur-md lg:h-[60px] lg:px-6">
          <p className="font-bold">Recent Releases</p>
        </header>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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
