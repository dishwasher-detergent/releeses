import { replaceTweets } from "@/lib/remark-plugins";
import { createClient } from "@/lib/supabase/server";
import { serialize } from "next-mdx-remote/serialize";
import { unstable_cache } from "next/cache";

export async function getOrgData(domain: string) {
  const supabase = createClient();
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      let query = supabase.from("organization").select();
      query = subdomain
        ? query.eq("subdomain", subdomain)
        : query.eq("customDomain", domain);

      return query.single();
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getReleaseData(domain: string, slug: string) {
  const supabase = createClient();
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      let query = supabase
        .from("release")
        .select(
          "*, organization!inner(subdomain, customDomain), organization(*)",
        );
      query = subdomain
        ? query.eq("organization.subdomain", subdomain)
        : query.eq("organization.customDomain", domain);

      query.eq("slug", slug).eq("published", true);

      const response = await query.single();

      if (response.count === 0) return null;

      const [mdxSource, adjacentReleases] = await Promise.all([
        getMdxSource(response.data?.content ?? ""),
        await query.neq("id", response.data?.id),
      ]);

      return {
        ...response.data,
        mdxSource,
        adjacentReleases,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}

export async function getMdxSource(releaseContent: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    releaseContent?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets],
    },
  });

  return mdxSource;
}
