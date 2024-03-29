import NotFound from "@/components/ui/not-found";
import { getOrgData } from "@/lib/fetchers";
import { headers } from "next/headers";

export default async function ContentNotFound() {
  const headersList = headers();
  const domain = headersList
    .get("host")
    ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const data = await getOrgData(domain as string);

  return <NotFound message={data.data?.message404!} />;
}
