"use client";

import { Loader } from "@/components/loading/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteRelease } from "@/lib/actions";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

interface DeleteReleaseFormProps {
  releaseName: string;
  orgId: number | null;
}

export default function DeleteReleaseForm({
  releaseName,
  orgId,
}: DeleteReleaseFormProps) {
  const { id } = useParams() as { id?: number };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        deleteRelease(data, id!, "delete").then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Deleted Release");
            router.refresh();
            router.push(`/organization/${orgId}`);
            toast.success(`Successfully deleted release!`);
          }
        })
      }
    >
      <div className="relative flex flex-col space-y-4 p-4">
        <h2 className="text-xl font-bold text-destructive">Delete Release</h2>
        <p className="text-sm">
          Deletes your release permanently. Type in the name of your release{" "}
          <b>{releaseName}</b> to confirm.
        </p>

        <Input
          name="confirm"
          type="text"
          required
          pattern={releaseName}
          placeholder={releaseName}
          className="max-w-sm"
        />
      </div>

      <div className="flex flex-row items-center justify-between border-t bg-destructive/10 px-4 py-2">
        <p className="text-sm text-destructive">
          This action is irreversible. Please proceed with caution.
        </p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  const [confirm, setConfirm] = useState(false);

  return !confirm ? (
    <Button
      disabled={pending}
      variant="destructive"
      size="sm"
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setConfirm(!confirm);
      }}
    >
      Delete Release
    </Button>
  ) : (
    <Button disabled={pending} variant="destructive" type="submit" size="sm">
      {pending && <Loader className="mr-2 size-4 text-white" />}
      Confirm Delete
    </Button>
  );
}
