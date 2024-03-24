import { Nav } from "@/components/ui/content/nav";
import { getSiteData } from "@/lib/fetchers";
import { cn } from "@/lib/utils";
import { fontMapper } from "@/styles/fonts";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  const organization = data.documents[0];

  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.documents[0].customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.documents[0].customDomain}`);
  }

  return (
    organization && (
      <main
        className={cn(
          fontMapper[data.documents[0]?.font],
          "h-full min-h-screen",
        )}
        style={{
          fontFamily: `var(--${data.documents[0]?.font})`,
        }}
      >
        <div className="mx-auto flex h-full max-w-3xl flex-col">
          <Nav name={organization.name} logo={organization.logo} />
          <div className="flex w-full flex-1 flex-col pb-8 md:pt-8">
            {children}
          </div>
        </div>
      </main>
    )
  );
}
