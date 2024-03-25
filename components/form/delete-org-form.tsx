"use client";

import { Loader } from "@/components/loading/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteOrganization } from "@/lib/actions";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function DeleteOrgForm({
  organizationName,
}: {
  organizationName: string;
}) {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <form
      action={async (data: FormData) =>
        deleteOrganization(data, id, "delete")
          .then(async (res) => {
            if (res.error) {
              toast.error(res.error);
            } else {
              va.track("Deleted Organization");
              router.refresh();
              router.push("/organizations");
              toast.success(`Successfully deleted organization!`);
            }
          })
          .catch((err: Error) => toast.error(err.message))
      }
    >
      <div className="relative flex flex-col space-y-4 p-4">
        <h2 className="text-xl font-bold text-destructive">
          Delete Organization
        </h2>
        <p className="text-sm">
          Deletes your organization and all releases associated with it. Type in
          the name of your organization <b>{organizationName}</b> to confirm.
        </p>

        <Input
          name="confirm"
          type="text"
          required
          pattern={organizationName}
          placeholder={organizationName}
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
      Delete Org
    </Button>
  ) : (
    <Button disabled={pending} variant="destructive" type="submit" size="sm">
      {pending && <Loader className="mr-2 size-4 text-white" />}
      Confirm Delete
    </Button>
  );
}
