import Image from "next/image";
import Link from "next/link";

interface NavProps {
  name: string;
  logo: string;
}

export function Nav({ name, logo }: NavProps) {
  return (
    <header className="flex h-14 w-full flex-none items-center justify-between border-b">
      <Link href="/" className="flex items-center justify-center">
        <div className="inline-block h-8 w-8 overflow-hidden align-middle">
          <Image
            alt={name || ""}
            height={40}
            src={logo || ""}
            width={40}
            className="object-cover"
          />
        </div>
        <span className="font-title ml-3 inline-block truncate font-bold">
          {name}
        </span>
      </Link>
    </header>
  );
}
