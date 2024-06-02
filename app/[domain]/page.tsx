import { Badge } from "@/components/ui/badge";
import BlurImage from "@/components/ui/blur-image";
import Roadmap from "@/components/ui/roadmap";
import { getOrgData } from "@/lib/fetchers";
import { createClient } from "@/lib/supabase/server";
import { placeholderBlurhash } from "@/lib/utils";
import { LucideArrowRight, LucideCalendar } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const domain = decodeURIComponent(params.domain);
  const org = await getOrgData(domain);

  return {
    icons: {
      icon: org.data?.logo ?? "/rocket.png",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN as string),
    title: `${org?.data?.name}`,
    description: `${org?.data?.description}`,
    openGraph: {
      title: `${org?.data?.name}`,
      description: `${org?.data?.description}`,
      url: new URL(process.env.NEXT_PUBLIC_DOMAIN as string),
      siteName: org?.data?.customDomain ?? org?.data?.subdomain,
      locale: "en_US",
      type: "website",
      images: [org?.data?.image ?? ""],
    },
    twitter: {
      card: "summary_large_image",
      title: `${org?.data?.name}`,
      description: `${org?.data?.description}`,
      images: [org?.data?.image ?? ""],
    },
  };
}

export default async function OrgHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const supabase = createClient();
  const domain = decodeURIComponent(params.domain);
  const org = await getOrgData(domain);

  if (!org || org.error) {
    notFound();
  }

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  let query = supabase.from("organization").select("*, release(*), roadmap(*)");
  query = subdomain
    ? query.eq("subdomain", subdomain)
    : query.eq("customDomain", domain);

  const response = await query.eq("release.published", true).single();

  return (
    <>
      <section className="mb-8">
        {response.data?.image && response.data?.imageBlurhash ? (
          <div className="relative m-auto h-96 w-full max-w-screen-lg overflow-hidden md:rounded-2xl">
            <BlurImage
              alt={response.data?.name ?? "Organization Image"}
              width={1200}
              height={630}
              className="h-full w-full object-cover"
              placeholder="blur"
              blurDataURL={response.data?.imageBlurhash ?? placeholderBlurhash}
              src={response.data?.image}
            />
          </div>
        ) : null}
      </section>
      <section className="mb-8">
        <h1 className="truncate pb-4 text-4xl font-bold">
          {response.data?.name ?? (
            <span className="italic text-muted-foreground">No Name</span>
          )}
        </h1>
        <p>
          {response.data?.description ?? (
            <span className="italic text-muted-foreground">No Description</span>
          )}
        </p>
      </section>
      {response.data?.roadmap && (
        <section className="mb-8">
          <h2 className="mb-4 text-3xl font-bold">Roadmap</h2>
          <div className="rounded-xl border border-dashed border-slate-300 bg-primary-foreground p-4 dark:border-slate-900">
            <Roadmap data={response.data?.roadmap} />
          </div>
        </section>
      )}
      <section className="mb-8">
        <h2 className="mb-4 text-3xl font-bold">Changelog</h2>
        <ul className="flex flex-col gap-8">
          {response.data?.release
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((release) => {
              const createdAt = new Date(release.created_at).toLocaleDateString(
                "en-us",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              );
              return (
                <li
                  key={release.id}
                  className="group/link group flex flex-row flex-nowrap gap-2 px-4"
                >
                  <div className="-mt-16 flex w-6 flex-col pb-6 group-first:m-0">
                    <div className="h-full border-l-2" />
                    <div className="size-6 rounded-bl-xl border-b-2 border-l-2" />
                  </div>
                  <div className="relative flex-1 rounded-xl border border-dashed border-slate-300 p-4 group-hover/link:bg-primary-foreground dark:border-slate-900">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-2xl font-bold">
                          {release.title}
                        </h3>
                        <div className="mb-2">
                          <Badge variant="secondary">
                            <LucideCalendar className="mr-2 size-3" />
                            <p>{createdAt}</p>
                          </Badge>
                        </div>
                      </div>
                      <p className="max-w-2xl">
                        {release.description ?? (
                          <span className="italic text-muted-foreground">
                            No Description
                          </span>
                        )}
                      </p>
                      <Link
                        href={release.slug ?? "/"}
                        className="flex flex-row items-center gap-2 text-sm text-primary"
                      >
                        Read More
                        <LucideArrowRight className="size-4 transition-all group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                    <Link
                      href={release.slug ?? "/"}
                      className="absolute inset-0"
                    />
                  </div>
                </li>
              );
            })}
        </ul>
        {response.data?.release.length === 0 && (
          <div className="w-full rounded-xl bg-muted p-8 text-center font-bold">
            No releases, yet!
          </div>
        )}
      </section>
    </>
  );
}
