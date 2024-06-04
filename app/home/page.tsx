import { Button } from "@/components/ui/button";
import Pricing from "@/components/ui/marketing/prices";
import Releases from "@/components/ui/marketing/releases";
import { createClient } from "@/lib/supabase/server";
import {
  LucideBuilding2,
  LucideGlobe,
  LucideMap,
  LucideRocket,
} from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("unit_amount", { ascending: true, referencedTable: "prices" });

  return (
    <>
      <section className="mb-24 mt-12 w-full px-8">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
          Releeses is the best way to manager your changelog and roadmap.
        </h1>
        <p className="mb-12 text-white md:text-lg">
          Easily manage and publish public changelogs for your applications,
          keeping your audience informed and engaged with every update.
        </p>
        <div className="flex items-center justify-center">
          <Button
            size="lg"
            className="w-full bg-emerald-600 ring-2 ring-emerald-400 transition-all hover:bg-emerald-700 hover:ring-4 hover:ring-emerald-500 md:w-[30%]"
            asChild
          >
            <a
              href={`${process.env.NEXT_PUBLIC_DOMAIN?.split("//").join(
                "//app.",
              )}`}
            >
              Get Started
            </a>
          </Button>
        </div>
      </section>
      <section className="mb-12 w-full rounded-[48px] bg-emerald-950/50 px-8 py-12">
        <h2 className="text-white">Recent Releases</h2>
        <p className="mb-6 text-xl font-bold text-white md:text-3xl">
          See what everyone else is releasing!
        </p>
        <Releases />
      </section>
      <section className="mb-12 w-full px-8 py-12">
        <h2 className="text-white">Features</h2>
        <p className="mb-6 text-xl font-bold text-white md:text-3xl">
          Here&apos;s what we offer!
        </p>
        <div className="mx-4 grid grid-cols-1 gap-8 md:col-span-3 md:row-start-3 md:grid-cols-3">
          <div>
            <LucideBuilding2 className="mb-2 size-8 rounded-xl bg-emerald-600 p-2 text-white" />
            <h4 className="font-bold text-white">Organizations</h4>
            <p className="text-white">
              Right off the bat, you can create 1 organization, for free!
            </p>
          </div>
          <div>
            <LucideRocket className="mb-2 size-8 rounded-xl bg-emerald-600 p-2 text-white" />
            <h4 className="font-bold text-white">Releases</h4>
            <p className="text-white">
              Feel free to create as many releases as you want! We don&apos;t
              limit.
            </p>
          </div>
          <div>
            <LucideMap className="mb-2 size-8 rounded-xl bg-emerald-600 p-2 text-white" />
            <h4 className="font-bold text-white">Roadmap</h4>
            <p className="text-white">
              Let everyone know what you&apos;ve got planned!
            </p>
          </div>
          <div>
            <LucideGlobe className="mb-2 size-8 rounded-xl bg-emerald-600 p-2 text-white" />
            <h4 className="font-bold text-white">Domains</h4>
            <p className="text-white">
              Free subdomains on the releeses.com domain, or bring your own!
            </p>
          </div>
        </div>
      </section>
      <section className="mb-12 w-full rounded-[48px] bg-emerald-950/50 px-8 py-12">
        <h2 className="text-white">Pricing</h2>
        <p className="mb-6 text-xl font-bold text-white md:text-3xl">
          Simple, we only have one plan!
        </p>
        <Pricing products={products ?? []} />
      </section>
    </>
  );
}
