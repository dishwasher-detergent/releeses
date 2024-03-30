import {
  remarkBitbucket,
  remarkGithub,
  remarkGitlab,
  replaceTweets,
} from "@/lib/remark-plugins";
import { createClient } from "@/lib/supabase/server";
import { serialize } from "next-mdx-remote/serialize";
import { unstable_cache } from "next/cache";
import remarkGfm from "remark-gfm";

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
      let data = supabase.from("release").select("*, organization!inner(*)");
      data = subdomain
        ? data.eq("organization.subdomain", subdomain)
        : data.eq("organization.customDomain", domain);

      let adj = supabase.from("release").select("*, organization!inner(*)");
      adj = subdomain
        ? adj.eq("organization.subdomain", subdomain)
        : adj.eq("organization.customDomain", domain);

      const response = await data
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (response.count === 0) return null;

      const [mdxSource, adjacentReleases] = await Promise.all([
        getMdxSource(response.data?.content ?? ""),
        adj.neq("id", response.data?.id).eq("published", true),
      ]);

      return {
        data: response.data,
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
  const content =
    releaseContent?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        replaceTweets,
        remarkGithub,
        remarkGfm,
        remarkGitlab,
        remarkBitbucket,
      ],
    },
  });

  return mdxSource;
}
