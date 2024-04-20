import { HueProvider } from "@/providers/hue-provider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HueProvider>
      <main className="relative z-10 flex min-h-screen flex-col">
        {children}
      </main>
      <div className="fixed inset-0 z-0 mx-auto grid max-w-4xl grid-cols-1 border-x md:grid-cols-3">
        <div className="hidden h-full border-r border-dashed md:block" />
        <div className="hidden h-full border-r border-dashed md:block" />
      </div>
    </HueProvider>
  );
}
