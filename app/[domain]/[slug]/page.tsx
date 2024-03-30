import BlurImage from "@/components/ui/blur-image";
import MDX from "@/components/ui/mdx";
import ReleaseCard from "@/components/ui/release-card";
import { Separator } from "@/components/ui/separator";
import { getOrgData, getReleaseData } from "@/lib/fetchers";
import { placeholderBlurhash } from "@/lib/utils";
import { Tables } from "@/types/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, orgData] = await Promise.all([
    getReleaseData(domain, slug),
    getOrgData(domain),
  ]);
  if (!data || !orgData) {
    return null;
  }
  const { title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vercel",
    },
  };
}

export default async function OrgReleasePage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const data = await getReleaseData(domain, slug);

  if (!data) {
    notFound();
  }

  const createdAt = new Date(data.created_at!).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <section className="relative m-auto mb-8 h-80 w-full max-w-screen-lg overflow-hidden md:rounded-2xl">
        <BlurImage
          alt={data.title ?? "Post image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          src={data.image ?? "/placeholder.png"}
        />
      </section>
      <section className="mb-8 w-full px-4">
        <h1 className="truncate text-xl font-bold">{data.title}</h1>
        <p className="text-sm font-semibold text-foreground/80">{createdAt}</p>
      </section>
      <section className="mb-8 w-full flex-1 px-4">
        <MDX source={data.mdxSource} />
      </section>
      {data.adjacentReleases.count! > 0 && (
        <>
          <div className="flex h-[52px] w-full items-center justify-between px-4 py-2">
            <p className="text-xl font-bold">Recent Releases</p>
          </div>
          <Separator />
        </>
      )}
      {data.adjacentReleases && (
        <section className="grid w-full grid-cols-2 border-l lg:grid-cols-3">
          {data.adjacentReleases.data?.map(
            (release: Tables<"release">, index: number) => (
              <ReleaseCard
                key={index}
                data={release}
                org={data.organization!}
                blog
              />
            ),
          )}
        </section>
      )}
    </>
  );
}
