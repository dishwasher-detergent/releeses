"use client";

import { Button } from "@/components/ui/button";
import { Release } from "@/interfaces/release";
import { createRelease } from "@/lib/actions";
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
          const release: Release = await createRelease(null, id, null);
          va.track("Created Release");
          router.refresh();
          router.push(`/release/${release.$id}`);
        })
      }
      disabled={isPending}
    >
      {isPending ? "Loading" : <p>Create New Release</p>}
    </Button>
  );
}
