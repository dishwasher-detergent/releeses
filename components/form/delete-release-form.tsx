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
  postName: string;
  orgId: string;
}

export default function DeleteReleaseForm({
  postName,
  orgId,
}: DeleteReleaseFormProps) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        deleteRelease(data, id, "delete").then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Deleted Post");
            router.refresh();
            router.push(`/organization/${orgId}`);
            toast.success(`Successfully deleted release!`);
          }
        })
      }
      className="p-4"
    >
      <div className="relative flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-destructive">Delete Post</h2>
        <p className="text-sm">
          Deletes your post permanently. Type in the name of your post{" "}
          <b>{postName}</b> to confirm.
        </p>

        <Input
          name="confirm"
          type="text"
          required
          pattern={postName}
          placeholder={postName}
          className="max-w-sm"
        />
      </div>

      <div className="flex flex-row items-center justify-between pt-4">
        <p className="text-sm">
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
    <Button disabled={pending} variant="destructive" size="sm" type="submit">
      {pending && <Loader className="mr-2 size-4 text-white" />}
      Confirm Delete
    </Button>
  );
}
