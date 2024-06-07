import { Nav } from "@/components/ui/content/nav";
import { Logo } from "@/components/ui/logo";
import { getOrgData } from "@/lib/fetchers";
import { cn } from "@/lib/utils";
import { fontMapper } from "@/styles/fonts";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function OrgLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const org = await getOrgData(domain);

  if (!org) {
    notFound();
  }

  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    org.data?.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${org.data.customDomain}`);
  }

  return (
    org.data && (
      <main
        className={cn(fontMapper[org.data?.font], "h-full min-h-screen")}
        style={{
          fontFamily: `var(--${org.data?.font})`,
        }}
      >
        <div className="mx-auto flex h-full max-w-3xl flex-col">
          <Nav name={org.data.name} logo={org.data.logo} />
          <div className="flex w-full flex-1 flex-col pb-8 md:pt-4">
            {children}
          </div>
          <footer className="grid w-full place-items-center py-8">
            <p className="flex flex-row items-center text-sm">
              Powered by
              <a
                className="inline-flex flex-row items-center"
                href={process.env.NEXT_PUBLIC_DOMAIN}
                target="_blank"
              >
                <Logo className="ml-2 size-4" />
                <span className="font-bold">Releeses</span>
              </a>
            </p>
          </footer>
        </div>
      </main>
    )
  );
}
