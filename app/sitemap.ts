import { getOrgData } from "@/lib/fetchers";
import { headers } from "next/headers";

export default async function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "vercel.pub";

  const org = await getOrgData(domain);

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...org.documents[0].release.map((release) => ({
      url: `https://${domain}/${release.slug}`,
      lastModified: new Date(),
    })),
  ];
}
