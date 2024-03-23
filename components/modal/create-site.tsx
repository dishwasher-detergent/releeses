"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { createOrganization } from "@/lib/actions";
import { cn } from "@/lib/utils";
import va from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useModal } from "./provider";

export default function CreateSiteModal() {
  const router = useRouter();
  const modal = useModal();

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
    <form
      action={async (data: FormData) =>
        createOrganization(data).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Site");
            const { $id } = res;
            router.refresh();
            router.push(`/site/${$id}`);
            modal?.hide();
            toast.success(`Successfully created site!`);
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-slate-200 md:shadow dark:md:border-slate-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="text-2xl dark:text-white">Create a new site</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            Site Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="My Awesome Site"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-slate-600 dark:bg-black dark:text-white dark:placeholder-slate-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-slate-500"
          >
            Subdomain
          </label>
          <div className="flex w-full max-w-md">
            <input
              name="subdomain"
              type="text"
              placeholder="subdomain"
              value={data.subdomain}
              onChange={(e) => setData({ ...data, subdomain: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="w-full rounded-l-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-black dark:border-slate-600 dark:bg-black dark:text-white dark:placeholder-slate-700 dark:focus:ring-white"
            />
            <div className="flex items-center rounded-r-lg border border-l-0 border-slate-200 bg-slate-100 px-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-500"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about why my site is so awesome"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-black  focus:outline-none focus:ring-black dark:border-slate-600 dark:bg-black dark:text-white dark:placeholder-slate-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}
function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-slate-700 dark:hover:border-slate-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-slate-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Site</p>}
    </button>
  );
}
