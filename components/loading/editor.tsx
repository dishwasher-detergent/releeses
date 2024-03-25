import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingEditor() {
  return (
    <>
      <div className="space-y-4 border-b p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="h-full w-full p-10">
        <Skeleton className="h-full w-full" />
      </div>
    </>
  );
}
