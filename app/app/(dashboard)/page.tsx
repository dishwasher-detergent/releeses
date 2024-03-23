import OverviewSitesCTA from "@/components/overview-sites-cta";
import PlaceholderCard from "@/components/placeholder-card";
import Organizations from "@/components/ui/organizations";
import Releases from "@/components/ui/releases";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function Overview() {
  return (
    <>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">New Organizations</h1>
        <OverviewSitesCTA />
      </div>
      <Separator />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaceholderCard key={i} />
            ))}
          </div>
        }
      >
        <Organizations limit={4} />
      </Suspense>
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">Recent Releases</h1>
      </div>
      <Separator />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaceholderCard key={i} />
            ))}
          </div>
        }
      >
        <Releases limit={4} />
      </Suspense>
    </>
  );
}
