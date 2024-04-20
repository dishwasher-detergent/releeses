import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Hero from "@/components/ui/marketing/hero";
import Nav from "@/components/ui/marketing/nav";
import Releases from "@/components/ui/marketing/releases";
import { Separator } from "@/components/ui/separator";
import { LucideRocket, LucideSparkles } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Nav />
      <section className="mx-auto my-24 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
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
      <section className="grid-col-1 mx-auto my-24 grid w-full max-w-4xl gap-4 md:grid-cols-3">
        <p className="mx-4  mb-2 font-semibold text-muted-foreground md:row-start-1">
          Recent Releases
        </p>
        <h2 className="mx-4 mb-12  text-5xl font-black md:col-span-2 md:row-start-2">
          See what everyone else is releasing!
        </h2>
        <div className="md:col-span-3 md:row-start-3">
          <Releases limit={3} />
        </div>
      </section>
    </>
  );
}
