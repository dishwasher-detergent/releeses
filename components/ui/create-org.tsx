"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrganization } from "@/lib/actions";
import va from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function CreateOrg() {
  const router = useRouter();

  const [data, setData] = useState({
    name: "",
    subdomain: "",
    description: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      subdomain: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lets create a new organization!</DialogTitle>
        </DialogHeader>
        <form
          action={async (data: FormData) =>
            createOrganization(data).then((res: any) => {
              if (res.error) {
                toast.error(res.error);
              } else {
                va.track("Created Organization");
                const { $id } = res;
                router.refresh();
                router.push(`/organization/${$id}`);
                toast.success(`Successfully created organization!`);
              }
            })
          }
          className="space-y-4"
        >
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="My Awesome organization"
              autoFocus
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              maxLength={32}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex w-full">
              <Input
                name="subdomain"
                type="text"
                placeholder="subdomain"
                value={data.subdomain}
                onChange={(e) =>
                  setData({ ...data, subdomain: e.target.value })
                }
                autoCapitalize="off"
                pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
                maxLength={255}
                required
                className="flex-1 rounded-r-none"
              />
              <div className="flex flex-none items-center rounded-r-md border border-none bg-foreground px-3 text-sm font-semibold text-background ">
                .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              placeholder="Description about why my organization is so awesome"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              maxLength={140}
              rows={3}
            />
          </div>
          <Submit />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" variant="default" disabled={pending}>
      {pending ? <p>Loading</p> : <p>Create Organization</p>}
    </Button>
  );
}
