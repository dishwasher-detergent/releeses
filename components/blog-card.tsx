import BlurImage from "@/components/ui/blur-image";
import Link from "next/link";

import { Release } from "@/interfaces/release";
import { placeholderBlurhash, toDateString } from "@/lib/utils";

interface BlogCardProps {
  data: Release;
}

export default function BlogCard({ data }: BlogCardProps) {
  return (
    <Link href={`/${data.slug}`}>
      <div className="ease overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800">
        <BlurImage
          src={data.image!}
          alt={data.title ?? "Blog Post"}
          width={500}
          height={400}
          className="h-64 w-full object-cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="h-36 border-t border-slate-200 px-5 py-8 dark:border-slate-700 dark:bg-black">
          <h3 className="text-xl tracking-wide dark:text-white">
            {data.title}
          </h3>
          <p className="text-md my-2 truncate italic text-slate-600 dark:text-slate-400">
            {data.description}
          </p>
          <p className="my-2 text-sm text-slate-600 dark:text-slate-400">
            Published {toDateString(data.$createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
