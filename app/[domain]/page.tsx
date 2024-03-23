import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/ui/blur-image";
import { getSiteData } from "@/lib/fetchers";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// export async function generateStaticParams() {
//   const allSites = await prisma.site.findMany({
//     select: {
//       subdomain: true,
//       customDomain: true,
//     },
//     // feel free to remove this filter if you want to generate paths for all sites
//     where: {
//       subdomain: "demo",
//     },
//   });

//   const allPaths = allSites
//     .flatMap(({ subdomain, customDomain }) => [
//       subdomain && {
//         domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//       },
//       customDomain && {
//         domain: customDomain,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  const releases = data.documents[0].release;

  return (
    <>
      <div className="mb-20 w-full">
        {releases.length > 0 ? (
          <div className="mx-auto w-full max-w-screen-xl md:mb-28 lg:w-5/6">
            <Link href={`/${releases[0].slug}`}>
              <div className="sm:h-150 group relative mx-auto h-80 w-full overflow-hidden lg:rounded-xl">
                <BlurImage
                  alt={releases[0].title ?? ""}
                  blurDataURL={releases[0].imageBlurhash ?? placeholderBlurhash}
                  className="h-full w-full object-cover group-hover:scale-105 group-hover:duration-300"
                  width={1300}
                  height={630}
                  placeholder="blur"
                  src={releases[0].image ?? "/placeholder.png"}
                />
              </div>
              <div className="mx-auto mt-10 w-5/6 lg:w-full">
                <h2 className="font-title my-10 text-4xl dark:text-white md:text-6xl">
                  {releases[0].title}
                </h2>
                <p className="w-full text-base dark:text-white md:text-lg lg:w-2/3">
                  {releases[0].description}
                </p>
                <div className="flex w-full items-center justify-start space-x-4">
                  <div className="relative h-8 w-8 flex-none overflow-hidden rounded-full">
                    {data.documents[0].user?.image ? (
                      <BlurImage
                        alt={data.documents[0].user?.name ?? "User Avatar"}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                        src={data.documents[0].user?.image}
                      />
                    ) : (
                      <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-slate-500">
                        ?
                      </div>
                    )}
                  </div>
                  <p className="ml-3 inline-block whitespace-nowrap align-middle text-sm font-semibold dark:text-white md:text-base">
                    {data.documents[0].user?.name}
                  </p>
                  <div className="h-6 border-l border-slate-600 dark:border-slate-400" />
                  <p className="m-auto my-5 w-10/12 text-sm font-light text-slate-500 dark:text-slate-400 md:text-base">
                    {toDateString(releases[0].$createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
              className="dark:hidden"
            />
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/white/success.svg"
              width={400}
              height={400}
              className="hidden dark:block"
            />
            <p className="font-title text-2xl text-slate-600 dark:text-slate-400">
              No posts yet.
            </p>
          </div>
        )}
      </div>

      {releases.length > 1 && (
        <div className="mx-5 mb-20 max-w-screen-xl lg:mx-24 2xl:mx-auto">
          <h2 className="font-title mb-10 text-4xl dark:text-white md:text-5xl">
            More stories
          </h2>
          <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
            {releases.slice(1).map((metadata: any, index: number) => (
              <BlogCard key={index} data={metadata} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
