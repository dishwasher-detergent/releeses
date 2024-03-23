import BlurImage from "@/components/blur-image";
import { Release } from "@/interfaces/release";
import { placeholderBlurhash } from "@/lib/utils";
import Link from "next/link";

export default function PostCard({ data }: { data: Release }) {
  const url = `${data.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;

  return (
    <div className="relative rounded-lg border border-slate-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-slate-700 dark:hover:border-white">
      <Link
        href={`/post/${data.$id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="relative h-44 overflow-hidden">
          <BlurImage
            alt={data.title ?? "Card thumbnail"}
            width={500}
            height={400}
            className="h-full object-cover"
            src={data.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          />
          {!data.published && (
            <span className="absolute bottom-2 right-2 rounded-md border border-slate-200 bg-white px-3 py-0.5 text-sm font-medium text-slate-600 shadow-md">
              Draft
            </span>
          )}
        </div>
        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <h3 className="font-cal my-0 truncate text-xl font-bold tracking-wide dark:text-white">
            {data.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug text-slate-500 dark:text-slate-400">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.organization?.subdomain}.localhost:3000/${data.slug}`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          {url} ↗
        </a>
      </div>
    </div>
  );
}
