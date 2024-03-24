import { InlineSnippet } from "@/components/form/domain-configuration";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <h1 className="text-white">
        Edit this page on{" "}
        <InlineSnippet className="ml-2 bg-blue-900 text-blue-100">
          app/home/page.tsx
        </InlineSnippet>
      </h1>
    </div>
  );
}
