import { Providers } from "@/app/providers";
import { cn } from "@/lib/utils";
import { inter, nunito } from "@/styles/fonts";
import "@/styles/globals.css";
import { Metadata } from "next";

const title = "Releaser.xyz - The easiest place to host your changelogs.";
const description = "Releaser is a way to host your applications changelog.";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cn(inter.variable, nunito.variable)} ${
          nunito.className
        } h-screen w-screen overflow-x-hidden bg-background`}
      >
        <Providers>
          {children}
          {/* <Analytics /> */}
        </Providers>
      </body>
    </html>
  );
}
