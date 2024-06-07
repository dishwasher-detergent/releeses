import { Badge } from "@/components/ui/badge";
import BlurImage from "@/components/ui/blur-image";
import MDX from "@/components/ui/mdx";
import ReleaseCard from "@/components/ui/release-card";
import { getReleaseData } from "@/lib/fetchers";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import { Tables } from "@/types/supabase";
import { LucideArrowLeft, LucideCalendar } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  const createdAt = toDateString(release?.data?.created_at!);

  return (
    <>
      <div className="p-4">
        <Link
          href={"/"}
          className="group/link group flex flex-row items-center gap-2 text-sm text-primary"
        >
          <LucideArrowLeft className="size-4 transition-all group-hover/link:-translate-x-0.5" />
          Back to overview
        </Link>
      </div>
      {release?.data?.imageBlurhash && release?.data?.image ? (
        <section className="relative m-auto mb-8 h-80 w-full max-w-screen-lg overflow-hidden md:rounded-2xl">
          <BlurImage
            alt={release?.data?.title ?? "Post image"}
            width={1200}
            height={630}
            className="h-full w-full object-cover"
            placeholder="blur"
            blurDataURL={release?.data?.imageBlurhash ?? placeholderBlurhash}
            src={release?.data?.image}
          />
        </section>
      ) : null}
      <section className="mb-8 w-full px-4">
        <h1 className="truncate pb-2 text-3xl font-bold">
          {release?.data?.title}
        </h1>
        <div className="mb-4">
          <Badge variant="secondary">
            <LucideCalendar className="mr-2 size-3" />
            <p>{createdAt}</p>
          </Badge>
        </div>
        <p>
          {release?.data?.description ?? (
            <span className="italic text-muted-foreground">No Description</span>
          )}
        </p>
      </section>
      <section className="mb-8 w-full flex-1 px-4">
        <MDX source={release?.mdxSource} />
      </section>

      {release?.adjacentReleases && (
        <section className="w-full px-4">
          {release?.adjacentReleases?.data &&
            release?.adjacentReleases?.data.length > 0 && (
              <div className="flex h-[52px] w-full items-center justify-between px-4 py-2">
                <p className="text-xl font-bold">Recent Releases</p>
              </div>
            )}
          <div className="grid w-full grid-cols-1 gap-4 rounded-xl border border-dashed border-slate-300 md:grid-cols-2">
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
          </div>
        </section>
      )}
    </>
  );
}
