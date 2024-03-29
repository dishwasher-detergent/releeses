"use client";

import { Loader } from "@/components/loading/loader";
import { Button } from "@/components/ui/button";
import { createRelease } from "@/lib/actions";
import { Tables } from "@/types/supabase";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CreateRelease() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      onClick={() =>
        startTransition(async () => {
          const release: Tables<"release"> = await createRelease(
            null,
            id,
            null,
          );
          va.track("Created Release");
          router.refresh();
          router.push(`/release/${release.id}`);
        })
      }
      disabled={isPending}
    >
      {isPending && <Loader className="mr-2 size-4 text-white" />}
      Create New Release
    </Button>
  );
}
