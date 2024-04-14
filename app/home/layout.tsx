import { HueProvider } from "@/providers/hue-provider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HueProvider>{children}</HueProvider>;
}
