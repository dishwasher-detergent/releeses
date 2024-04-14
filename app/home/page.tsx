import { Button } from "@/components/ui/button";
import Hero from "@/components/ui/marketing/hero";
import { Hue } from "@/components/ui/marketing/hue";
import Releases from "@/components/ui/marketing/releases";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LucideRocket } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <main className="relative z-10 flex min-h-screen flex-col">
        <header className="h-14 w-full border-b">
          <div className="mx-auto flex h-full w-full max-w-4xl items-center px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <LucideRocket className="size-6 rounded-lg text-foreground" />
              <span className="text-xl font-black">Releeses</span>
            </Link>
            <ul className="flex flex-1 flex-row items-center justify-end gap-2">
              <li>
                <ThemeToggle />
              </li>
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
          <Hero />
        </section>
        <section className="mx-auto w-full max-w-4xl">
          <div className="px-4">
            <p className="mb-2 font-semibold text-muted-foreground">Recent</p>
            <h2 className="text-5xl font-black">Releases</h2>
          </div>
          <div className="mx-auto mt-8 w-full max-w-4xl border-l border-t">
            <Releases limit={3} />
          </div>
        </section>
      </main>
      <div className="absolute inset-0 z-0 mx-auto grid max-w-4xl grid-cols-1 border-x md:grid-cols-3">
        <div className="hidden h-full border-r border-dashed md:block" />
        <div className="hidden h-full border-r border-dashed md:block" />
      </div>
      <Hue />
    </>
  );
}
