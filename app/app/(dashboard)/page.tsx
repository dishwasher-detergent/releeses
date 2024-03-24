import LoadingCard from "@/components/loading/card";
import Organizations from "@/components/ui/organizations";
import OverviewOrgsCTA from "@/components/ui/overview-orgs-cta";
import Releases from "@/components/ui/releases";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function Overview() {
  return (
    <>
      <section className="relative h-1/2 overflow-y-auto">
        <div className="sticky top-0 z-10 flex h-[52px] items-center justify-between bg-background/90 px-4 py-2 backdrop-blur-sm">
          <h1 className="text-xl font-bold">New Organizations</h1>
          <OverviewOrgsCTA />
        </div>
        <Separator />
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
        <div className="sticky top-0 z-10 flex h-[52px] items-center justify-between bg-background/90 px-4 py-2 backdrop-blur-sm">
          <h1 className="text-xl font-bold">Recent Releases</h1>
        </div>
        <Separator />
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
