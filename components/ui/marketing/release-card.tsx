import BlurImage from "@/components/ui/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { Tables } from "@/types/supabase";

interface ReleaseCardProps {
  data: Tables<"release">;
  org: Tables<"organization">;
  blog?: boolean;
  marketing?: boolean;
}

export default function ReleaseCard({
  data,
  org,
  blog = false,
  marketing = false,
}: ReleaseCardProps) {
  const url = `${org?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`;
  const rootUrl = `${
    org?.customDomain
      ? org?.customDomain
      : `${org?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  }`;

  let link = `/release/${data.id}`;

  if (blog) {
    link = `${data.id}`;
  }

  if (marketing) {
    link = url;
  }

  return (
    <article className="relative flex flex-row flex-wrap gap-4">
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-emerald-800 lg:aspect-[5/4]">
        <BlurImage
          alt={
            data.image && data.title
              ? data.title
              : "Upload your own image at /settings"
          }
          width={600}
          height={600}
          className="h-full object-cover"
          src={data.image}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
      </div>
      <div>
        <h4 className="truncate font-bold text-white md:text-lg">
          {data.title}
        </h4>
        <p className="relative z-50 truncate text-sm text-white md:text-base">
          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${rootUrl}`
                : `http://${org?.subdomain}.localhost:3000/`
            }
            target="_blank"
          >
            @
            {org?.customDomain
              ? org?.customDomain
              : `${org?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
          </a>
        </p>
      </div>
      <a
        target="_blank"
        href={
          process.env.NEXT_PUBLIC_VERCEL_ENV
            ? `https://${url}`
            : `http://${org?.subdomain}.localhost:3000/${data.slug}`
        }
        className="absolute inset-0 z-0"
      />
    </article>
  );
}
