import { Organization } from "@/interfaces/organization";
import { Release } from "@/interfaces/release";
import { db } from "@/lib/appwrite";
import {
  ORGANIZATION_COLLECTION_ID,
  RELEASE_COLLECTION_ID,
} from "@/lib/constants";
import { replaceTweets } from "@/lib/remark-plugins";
import { serialize } from "next-mdx-remote/serialize";
import { unstable_cache } from "next/cache";
import { Query } from "node-appwrite";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const queries = [
    subdomain
      ? Query.equal("subdomain", subdomain)
      : Query.equal("customDomain", domain),
  ];

  return await unstable_cache(
    async () => {
      return db.list<Organization>(ORGANIZATION_COLLECTION_ID, queries);
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getPostData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const queries = [
    subdomain
      ? Query.equal("subdomain", subdomain)
      : Query.equal("customDomain", domain),
  ];

  console.log(slug);

  return await unstable_cache(
    async () => {
      const data = await db.list<Release>(RELEASE_COLLECTION_ID, [
        ...queries,
        Query.equal("slug", slug),
        Query.equal("published", true),
      ]);

      if (data.documents.length === 0) return null;

      console.log(data);

      const [mdxSource, adjacentPosts] = await Promise.all([
        getMdxSource(data.documents[0].content!),
        await db.list<Release>(RELEASE_COLLECTION_ID, [
          ...queries,
          Query.notEqual("slug", slug),
          Query.equal("published", true),
        ]),
      ]);

      return {
        ...data,
        mdxSource,
        adjacentPosts,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}

async function getMdxSource(postContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    postContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets],
    },
  });

  return mdxSource;
}
