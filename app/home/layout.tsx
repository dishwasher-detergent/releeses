import Footer from "@/components/ui/marketing/footer";
import Nav from "@/components/ui/marketing/nav";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col bg-black">
      <Nav />
      <div className="relative z-10 mx-auto max-w-7xl py-4">{children}</div>
      <Footer />
      <div className="space-between absolute inset-0 z-0 h-full">
        <div className="mx-auto flex h-full max-w-5xl flex-row flex-nowrap justify-between px-4">
          <div className="border-l border-white/20" />
          <div className="hidden border-l border-dashed border-white/20 md:block" />
          <div className="hidden border-l border-dashed border-white/20 lg:block" />
          <div className="border-l border-white/20" />
        </div>
      </div>
    </main>
  );
}
