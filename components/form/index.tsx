"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import va from "@vercel/analytics";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import DomainConfiguration from "./domain-configuration";
import DomainStatus from "./domain-status";
import Uploader from "./uploader";
export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
}: {
  title: string;
  description: string;
  helpText: string;
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  handleSubmit: any;
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  return (
    <form
      className="p-4"
      action={async (data: FormData) => {
        if (
          inputAttrs.name === "customDomain" &&
          inputAttrs.defaultValue &&
          data.get("customDomain") !== inputAttrs.defaultValue &&
          !confirm("Are you sure you want to change your custom domain?")
        ) {
          return;
        }
        handleSubmit(data, id, inputAttrs.name).then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track(`Updated ${inputAttrs.name}`, id ? { id } : {});
            if (id) {
              router.refresh();
            } else {
              router.refresh();
            }
            toast.success(`Successfully updated ${inputAttrs.name}!`);
          }
        });
      }}
    >
      <div className="relative flex flex-col space-y-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm ">{description}</p>
        {inputAttrs.name === "image" || inputAttrs.name === "logo" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue}
            name={inputAttrs.name}
          />
        ) : inputAttrs.name === "font" ? (
          <Select name="font" defaultValue={inputAttrs.defaultValue}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="font-nunito">Nunito</SelectItem>
              <SelectItem value="font-inter">Inter</SelectItem>
              <SelectItem value="font-roboto">Roboto</SelectItem>
            </SelectContent>
          </Select>
        ) : inputAttrs.name === "subdomain" ? (
          <div className="flex w-full max-w-sm">
            <Input
              {...inputAttrs}
              required
              className="rounded-r-none border-r-0"
            />
            <div className="flex flex-none items-center rounded-r-md border border-none bg-foreground px-3 text-sm font-semibold text-background ">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        ) : inputAttrs.name === "customDomain" ? (
          <div className="relative flex w-full max-w-md">
            <Input {...inputAttrs} className="max-w-sm" />
            {inputAttrs.defaultValue && (
              <div className="absolute right-3 z-10 flex h-full items-center">
                <DomainStatus domain={inputAttrs.defaultValue} />
              </div>
            )}
          </div>
        ) : inputAttrs.name === "description" ? (
          <Textarea {...inputAttrs} rows={3} required className="max-w-sm" />
        ) : (
          <Input {...inputAttrs} required className="max-w-sm" />
        )}
      </div>
      {inputAttrs.name === "customDomain" && inputAttrs.defaultValue && (
        <DomainConfiguration domain={inputAttrs.defaultValue} />
      )}
      <div className="flex flex-row items-center justify-between pt-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{helpText}</p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} size="sm">
      {pending ? "Loading" : <p>Save Changes</p>}
    </Button>
  );
}
