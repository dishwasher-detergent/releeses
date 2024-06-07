import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="relative z-10 h-14 w-full border-b border-white/20">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center px-12">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo variant="light" />
          <span className="text-xl font-black text-white">Releeses</span>
        </Link>
        <ul className="flex flex-1 flex-row items-center justify-end gap-2">
          <li>
            <Button asChild size="sm" variant="secondary">
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
