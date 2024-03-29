import BlurImage from "@/components/ui/blur-image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrgData } from "@/lib/fetchers";
import { createClient } from "@/lib/supabase/server";
import { placeholderBlurhash } from "@/lib/utils";
import { LucideArrowRight, LucideCalendar } from "lucide-react";
import { notFound } from "next/navigation";

export default async function OrgHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const supabase = createClient();
  const domain = decodeURIComponent(params.domain);
  const org = await getOrgData(domain);

  if (!org) {
    notFound();
  }

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  let query = supabase.from("organization").select("*, release(*)");
  query = subdomain
    ? query.eq("subdomain", subdomain)
    : query.eq("customDomain", domain);

  const response = await query.eq("release.published", true).single();

  return (
    <>
      <section>
        <div className="relative m-auto h-60 w-full max-w-screen-lg overflow-hidden md:rounded-2xl">
          <BlurImage
            alt={response.data?.name ?? "Organization Image"}
            width={1200}
            height={630}
            className="h-full w-full object-cover"
            placeholder="blur"
            blurDataURL={response.data?.imageBlurhash ?? placeholderBlurhash}
            src={response.data?.image ?? "/placeholder.png"}
          />
        </div>
        <div className="-mt-16 ml-4 pb-8">
          <div className="relative z-10 mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-background">
            <BlurImage
              alt={response.data?.logo ?? "Organization Logo"}
              width={50}
              height={50}
              className="h-full w-full object-cover"
              placeholder="blur"
              blurDataURL={placeholderBlurhash}
              src={response.data?.logo ?? "/placeholder.png"}
            />
          </div>
          <h1 className="truncate pb-2 text-2xl font-bold">
            {response.data?.name}
          </h1>
          <p className="text-sm">{response.data?.description}</p>
        </div>
      </section>
      <section className="px-4 pb-2">
        <h1 className="text-2xl font-bold">Changelog</h1>
      </section>
      <section className="flex w-full flex-col px-4">
        {response.data?.release.map((release) => {
          const createdAt = new Date(release.created_at).toLocaleDateString(
            "en-us",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          );
          return (
            <article key={release.id} className="group">
              <div className="flex flex-row items-center gap-2 pb-2">
                <LucideCalendar className="size-4 flex-none text-foreground/80" />
                <p className="text-sm font-semibold text-foreground/80">
                  {createdAt}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex w-4 flex-none items-center justify-center pb-2">
                  <Separator orientation="vertical" />
                </div>
                <Card className="mb-8 flex-1 shadow-none group-last:mb-0">
                  <CardHeader>
                    <CardTitle className="text-xl">{release.title}</CardTitle>
                  </CardHeader>
                  {release.description && (
                    <CardContent>{release.description}</CardContent>
                  )}
                  <CardFooter>
                    <a
                      href={release.slug ?? "/"}
                      className="group/link flex flex-row items-center gap-2 text-sm text-primary"
                    >
                      Read More
                      <LucideArrowRight className="size-4 transition-all group-hover/link:translate-x-0.5" />
                    </a>
                  </CardFooter>
                </Card>
              </div>
            </article>
          );
        })}
        {response.data?.release.length === 0 && (
          <div className="w-full rounded-xl bg-muted p-8 text-center font-bold">
            No releases, yet!
          </div>
        )}
      </section>
    </>
  );
}
