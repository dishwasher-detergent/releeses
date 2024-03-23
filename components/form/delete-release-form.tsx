"use client";

import { deleteRelease } from "@/lib/actions";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function DeleteReleaseForm({ postName }: { postName: string }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        window.confirm("Are you sure you want to delete your post?") &&
        deleteRelease(data, id, "delete").then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Deleted Post");
            router.refresh();
            router.push(`/site/${res.siteId}`);
            toast.success(`Successfully deleted post!`);
          }
        })
      }
      className="p-4"
    >
      <div className="relative flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-destructive">Delete Post</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This action is irreversible. Please proceed with caution.
        </p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} variant="destructive" size="sm">
      {pending ? "Loading" : <p>Confirm Delete</p>}
    </Button>
  );
}
