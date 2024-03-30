import Image from "next/image";
import Link from "next/link";

interface NavProps {
  name: string;
  logo?: string | null;
}

export function Nav({ name, logo }: NavProps) {
  return (
    <header className="flex h-14 w-full flex-none items-center justify-between border-b px-4">
      <Link href="/" className="flex items-center justify-center">
        {logo && (
          <div className="inline-block size-8 overflow-hidden rounded-full align-middle">
            <Image
              alt={name || ""}
              height={40}
              src={logo || ""}
              width={40}
              className="size-8 object-cover"
            />
          </div>
        )}
        <span className="font-title ml-3 inline-block truncate font-bold">
          {name}
        </span>
      </Link>
    </header>
  );
}
