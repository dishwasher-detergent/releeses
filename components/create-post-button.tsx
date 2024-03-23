"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Release } from "@/interfaces/release";
import { createRelease } from "@/lib/actions";
import { cn } from "@/lib/utils";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CreatePostButton() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          console.log("test");
          const release: Release = await createRelease(null, id, null);
          console.log(release);
          va.track("Created Post");
          router.refresh();
          router.push(`/post/${release.$id}`);
        })
      }
      className={cn(
        "flex h-8 w-36 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none sm:h-9",
        isPending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-slate-100 dark:border-slate-700 dark:hover:border-slate-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-slate-800",
      )}
      disabled={isPending}
    >
      {isPending ? <LoadingDots color="#808080" /> : <p>Create New Post</p>}
    </button>
  );
}
