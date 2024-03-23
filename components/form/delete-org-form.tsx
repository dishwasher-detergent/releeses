"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteOrganization } from "@/lib/actions";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function DeleteOrgForm({ siteName }: { siteName: string }) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        window.confirm("Are you sure you want to delete your organization?") &&
        deleteOrganization(data, id, "delete")
          .then(async (res) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              va.track("Deleted Organization");
              router.refresh();
              router.push("/organizations");
              toast.success(`Successfully deleted site!`);
            }
          })
          .catch((err: Error) => toast.error(err.message))
      }
      className="p-4"
    >
      <div className="relative flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-destructive dark:text-white">
          Delete Site
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Deletes your site and all posts associated with it. Type in the name
          of your site <b>{siteName}</b> to confirm.
        </p>

        <Input
          name="confirm"
          type="text"
          required
          pattern={siteName}
          placeholder={siteName}
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
