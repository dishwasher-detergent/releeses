import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Hero from "@/components/ui/marketing/hero";
import Nav from "@/components/ui/marketing/nav";
import Pricing from "@/components/ui/marketing/prices";
import Releases from "@/components/ui/marketing/releases";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import {
  LucideBuilding2,
  LucideGlobe,
  LucideRocket,
  LucideSparkles,
} from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*, prices(id, *, products(id, *))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  return (
    <>
      <Nav />
      <section className="mx-auto my-24 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        <div className="mx-4 flex justify-center md:col-start-2">
          <Badge className="rounded-full py-1">
            <LucideSparkles className="size-4" />
            <Separator orientation="vertical" className="mx-2 h-3" />
            Releeses was just Released
          </Badge>
        </div>
        <Hero />
        <div className="mx-4 flex justify-center md:col-start-2">
          <Button size="lg" asChild className="md:w-full">
            <a
              href={`${process.env.NEXT_PUBLIC_DOMAIN?.split("//").join(
                "//app.",
              )}`}
            >
              <LucideRocket className="mr-2 size-4" />
              Get Started
            </a>
          </Button>
        </div>
      </section>
      <section className="grid-col-1 mx-auto my-24 grid w-full max-w-5xl gap-4 md:grid-cols-3">
        <p className="mx-4 font-semibold text-muted-foreground md:row-start-1">
          Recent Releases
        </p>
        <h2 className="mx-4 mb-12  text-5xl font-black md:col-span-2 md:row-start-2">
          See what everyone else is releasing!
        </h2>
        <div className="md:col-span-3 md:row-start-3">
          <Releases limit={3} />
        </div>
      </section>
      <section className="grid-col-1 mx-auto my-24 grid w-full max-w-5xl gap-4 md:grid-cols-3">
        <p className="mx-4 font-semibold text-muted-foreground md:row-start-1">
          Features
        </p>
        <h2 className="mx-4 mb-12  text-5xl font-black md:col-span-2 md:row-start-2">
          Here&apos;s what we offer!
        </h2>
        <div className="mx-4 grid grid-cols-1 gap-8 md:col-span-3 md:row-start-3 md:grid-cols-3">
          <div>
            <LucideBuilding2 className="mb-2 size-8 rounded-xl bg-primary p-2 text-primary-foreground" />
            <h4 className="font-bold">Organizations</h4>
            <p>Right off the bat, you can create 1 organization, for free!</p>
          </div>
          <div>
            <LucideRocket className="mb-2 size-8 rounded-xl bg-primary p-2 text-primary-foreground" />
            <h4 className="font-bold">Releases</h4>
            <p>
              Feel free to create as many releases as you want! We don&apos;t
              limit.
            </p>
          </div>
          <div>
            <LucideGlobe className="mb-2 size-8 rounded-xl bg-primary p-2 text-primary-foreground" />
            <h4 className="font-bold">Domains</h4>
            <p>
              Free subdomains on the releeses.com domain, or bring your own!
            </p>
          </div>
        </div>
      </section>
      <section>
        <Pricing
          user={user}
          products={products ?? []}
          subscription={subscription}
        />
      </section>
    </>
  );
}
