import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <h1 className="text-white">
        Edit this page on <Badge className="ml-2">app/home/page.tsx</Badge>
      </h1>
    </div>
  );
}
