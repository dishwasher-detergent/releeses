import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { LucideGithub } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-pink-950/30 py-12 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-12">
        <div className="flex w-full flex-row items-center">
          <Link
            className="flex flex-row items-center gap-2 text-3xl font-bold"
            href="/"
          >
            <Logo />
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
          releeses.com are owned by their respective owners. Data is provided by
          the each respective user.
        </p>
      </div>
    </footer>
  );
}
