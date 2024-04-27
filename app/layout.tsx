import { Providers } from "@/app/providers";
import { spaceGrotesk } from "@/styles/fonts";
import "@/styles/globals.css";
import { Metadata } from "next";

const title = "Releeses";
const description =
  "Easily manage and publish public changelogs for your applications, keeping your audience informed and engaged with every update.";

export const metadata: Metadata = {
  icons: {
    icon: "/rocket.png",
  },
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
        className={`${spaceGrotesk.className} relative h-lvh w-screen overflow-x-hidden bg-background`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
