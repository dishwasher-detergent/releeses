import { Button } from "@/components/ui/button";
import Nav from "@/components/ui/marketing/nav";
import { HueProvider } from "@/providers/hue-provider";
import { LucideGithub } from "lucide-react";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HueProvider>
      <main className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        {children}
        <footer className="w-full bg-primary px-4 py-12 text-white">
          <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
            <div className="flex w-full flex-row items-center">
              <Link className="text-3xl font-bold" href="/">
                Releeses.com
              </Link>
              <div className="flex flex-1 items-center justify-end">
                <Button asChild variant="ghost" size="icon">
                  <a
                    href="https://github.com/dishwasher-detergent/releeses"
                    target="_blank"
                  >
                    <span className="sr-only">Github</span>
                    <LucideGithub className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-row gap-8">
              <ul>
                <li>
                  <p className="pb-2 text-lg font-bold">Pages</p>
                </li>
                <li>
                  <a
                    className="text-sm"
                    href={`${process.env.NEXT_PUBLIC_DOMAIN?.split("//").join(
                      "//app.",
                    )}`}
                  >
                    Login
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <p className="pb-2 text-lg font-bold">Legal</p>
                </li>
                <li>
                  <Link className="text-sm" href="/privacy">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <p className="text-sm">
              All copyrighted content (i.e. cover images, logos, etc) on
              releeses.com are owned by their respective owners. Data is
              provided by the each respective user.
            </p>
          </div>
        </footer>
      </main>
      <div
        className="fixed inset-0 z-0 mx-auto hidden max-w-5xl grid-cols-1 border-x md:grid md:grid-cols-3"
        style={{ left: "15px" }}
      >
        <div className="col-start-2 h-full border-x border-dashed border-muted border-slate-300 dark:border-slate-900" />
      </div>
    </HueProvider>
  );
}
