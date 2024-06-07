import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export default async function Sitemap() {
  const supabase = createClient();
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "vercel.pub";

  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  let query = supabase.from("organization").select("*, release(*), roadmap(*)");
  query = subdomain
    ? query.eq("subdomain", subdomain)
    : query.eq("customDomain", domain);

  const response = await query.eq("release.published", true).single();

  const { data, error } = response;

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...(data?.release.map((release) => ({
      url: `https://${domain}/${release.slug}`,
      lastModified: new Date(),
    })) || []),
  ];
}
