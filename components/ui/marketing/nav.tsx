import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LucideRocket } from "lucide-react";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="h-14 w-full border-b">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center px-4">
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
  );
}
