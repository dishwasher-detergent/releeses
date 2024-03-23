import BlurImage from "@/components/ui/blur-image";
import MDX from "@/components/ui/mdx";
import ReleaseCard from "@/components/ui/release-card";
import { Separator } from "@/components/ui/separator";
import { Release } from "@/interfaces/release";
import { getPostData, getSiteData } from "@/lib/fetchers";
import { placeholderBlurhash } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, siteData] = await Promise.all([
    getPostData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return null;
  }
  const { title, description } = data.documents[0] as Release;

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
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

// export async function generateStaticParams() {
//   const allPosts = await prisma.post.findMany({
//     select: {
//       slug: true,
//       site: {
//         select: {
//           subdomain: true,
//           customDomain: true,
//         },
//       },
//     },
//     // feel free to remove this filter if you want to generate paths for all posts
//     where: {
//       site: {
//         subdomain: "demo",
//       },
//     },
//   });

//   const allPaths = allPosts
//     .flatMap(({ site, slug }) => [
//       site?.subdomain && {
//         domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//         slug,
//       },
//       site?.customDomain && {
//         domain: site.customDomain,
//         slug,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const data = await getPostData(domain, slug);

  if (!data) {
    notFound();
  }

  const createdAt = new Date(data.documents[0].$createdAt).toLocaleDateString(
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
          alt={data.documents[0].title ?? "Post image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={data.documents[0].imageBlurhash ?? placeholderBlurhash}
          src={data.documents[0].image ?? "/placeholder.png"}
        />
      </section>
      <section className="mb-8 w-full px-4">
        <h1 className="text-3xl font-bold">{data.documents[0].title}</h1>
        <p className="text-sm font-semibold text-foreground/80">{createdAt}</p>
      </section>
      <section className="mb-8 w-full flex-1 px-4">
        <MDX source={data.mdxSource} />
      </section>
      {data.adjacentPosts.documents.length > 0 && (
        <>
          <div className="flex h-[52px] w-full items-center justify-between px-4 py-2">
            <p className="text-xl font-bold">Recent Releases</p>
          </div>
          <Separator />
        </>
      )}
      {data.adjacentPosts && (
        <section className="grid w-full grid-cols-2 border-l lg:grid-cols-3">
          {data.adjacentPosts.documents.map((data: Release, index: number) => (
            <ReleaseCard key={index} data={data} org={data.organization} blog />
          ))}
        </section>
      )}
    </>
  );
}
