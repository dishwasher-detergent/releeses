import BlurImage from "@/components/ui/blur-image";
import MDX from "@/components/ui/mdx";
import ReleaseCard from "@/components/ui/release-card";
import { Separator } from "@/components/ui/separator";
import { getReleaseData } from "@/lib/fetchers";
import { placeholderBlurhash } from "@/lib/utils";
import { Tables } from "@/types/supabase";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}): Promise<Metadata> {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const release = await getReleaseData(domain, slug);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN as string),
    title: `${release?.data?.organization?.name} - ${release?.data?.title}`,
    description: release?.data?.description,
    openGraph: {
      title: `${release?.data?.organization?.name} - ${release?.data?.title}`,
      description: release?.data?.description ?? "",
      url: new URL(process.env.NEXT_PUBLIC_DOMAIN as string),
      siteName:
        release?.data?.organization?.customDomain ??
        release?.data?.organization?.subdomain,
      locale: "en_US",
      type: "website",
      images: [release?.data?.image ?? ""],
    },
    twitter: {
      card: "summary_large_image",
      title: `${release?.data?.organization?.name} - ${release?.data?.title}`,
      description: release?.data?.description ?? "",
      images: [release?.data?.image ?? ""],
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
  const release = await getReleaseData(domain, slug);

  if (!release?.data) {
    notFound();
  }

  const createdAt = new Date(release?.data?.created_at!).toLocaleDateString(
    "en-us",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <>
      <section className="relative m-auto mb-8 h-80 w-full max-w-screen-lg overflow-hidden md:rounded-2xl">
        <BlurImage
          alt={release?.data?.title ?? "Post image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={release?.data?.imageBlurhash ?? placeholderBlurhash}
          src={release?.data?.image ?? "/placeholder.png"}
        />
      </section>
      <section className="mb-8 w-full px-4">
        <h1 className="truncate text-xl font-bold">{release?.data?.title}</h1>
        <p className="text-sm font-semibold text-foreground/80">{createdAt}</p>
      </section>
      <section className="mb-8 w-full flex-1 px-4">
        <MDX source={release?.mdxSource} />
      </section>

      {release?.adjacentReleases && (
        <>
          <div className="flex h-[52px] w-full items-center justify-between px-4 py-2">
            <p className="text-xl font-bold">Recent Releases</p>
          </div>
          <Separator />
          <section className="grid w-full grid-cols-2 border-l lg:grid-cols-3">
            {release?.adjacentReleases.data?.map(
              (item: Tables<"release">, index: number) => (
                <ReleaseCard
                  key={index}
                  data={item}
                  org={release?.data?.organization!}
                  blog
                />
              ),
            )}
          </section>
        </>
      )}
    </>
  );
}
