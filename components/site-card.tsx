import BlurImage from "@/components/blur-image";
import { Organization } from "@/interfaces/organization";
import { placeholderBlurhash, random } from "@/lib/utils";
import { BarChart } from "lucide-react";
import Link from "next/link";

export default function SiteCard({ data }: { data: Organization }) {
  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  return (
    <div className="relative rounded-lg border border-slate-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-slate-700 dark:hover:border-white">
      <Link
        href={`/organization/${data.$id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <BlurImage
          alt={data.name ?? "Card thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <h3 className="font-cal my-0 truncate text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-slate-500 dark:text-slate-400">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          {url} ↗
        </a>
        <Link
          href={`/site/${data.$id}/analytics`}
          className="flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400 dark:hover:bg-green-800 dark:hover:bg-opacity-50"
        >
          <BarChart height={16} />
          <p>{random(10, 40)}%</p>
        </Link>
      </div>
    </div>
  );
}
