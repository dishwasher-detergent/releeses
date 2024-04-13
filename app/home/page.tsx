import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Releases from "@/components/ui/marketing/releases";
import { Separator } from "@/components/ui/separator";
import { LucideRocket, LucideSparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="h-14 w-full border-b">
        <div className="mx-auto flex h-full w-full max-w-4xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <LucideRocket className="size-6 rounded-lg text-foreground" />
            <span className="text-xl font-black">Releeses</span>
          </Link>
          <ul className="flex flex-1 flex-row justify-end">
            <li>
              <Button asChild size="sm">
                <a
                  href={`${process.env.NEXT_PUBLIC_DOMAIN?.split("//").join(
                    "//app.",
                  )}`}
                >
                  Login
                </a>
              </Button>
            </li>
          </ul>
        </div>
      </header>
      <section className="mx-auto w-full max-w-4xl p-4">
        <div className="flex w-full flex-col items-center justify-center pb-24 pt-12">
          <Badge variant="secondary" className="py-1">
            <LucideSparkles className="size-4 text-primary" />
            <Separator orientation="vertical" className="mx-2 h-3" />
            Releeses was just Released
          </Badge>
          <h1 className="my-8 max-w-3xl text-center text-4xl font-bold md:text-5xl lg:text-6xl">
            Releeses is the best way to manage your changelog
          </h1>
          <p className="mb-8 max-w-2xl text-center md:text-lg">
            Easily manage and publish public changelogs for your applications,
            keeping your audience informed and engaged with every update.
          </p>
          <Button size="lg" asChild>
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
      <section>
        <p className="mb-2 text-center">Recent</p>
        <h2 className="text-center text-5xl font-black">Releases</h2>
        <div className="mx-auto mt-8 w-full max-w-4xl border-l border-t">
          <Releases limit={3} />
        </div>
      </section>
    </main>
  );
}
