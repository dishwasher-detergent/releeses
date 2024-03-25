"use client";

import { Loader } from "@/components/loading/loader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Release } from "@/interfaces/release";
import { updateRelease, updateReleaseMetadata } from "@/lib/actions";
import { ExternalLink } from "lucide-react";
import { Editor as NovelEditor } from "novel";
import { useEffect, useState, useTransition } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

export default function Editor({ release }: { release: Release }) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<Release>(release);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : `http://${data.organization?.subdomain}.localhost:3000/${data.slug}`;

  // listen to CMD + S and override the default behavior
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();

        startTransitionSaving(async () => {
          await updateRelease(data);
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [data, startTransitionSaving]);

  return (
    <>
      <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
        {data.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <Badge variant="secondary" className="px-3 py-2">
          {isPendingSaving ? "Saving..." : "Saved"}
        </Badge>
        <Button
          size="sm"
          onClick={() => {
            const formData = new FormData();
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updateReleaseMetadata(
                formData,
                release.$id,
                "published",
              ).then(() => {
                toast.success(
                  `Successfully ${
                    data.published ? "unpublished" : "published"
                  } your release.`,
                );
                setData((prev) => ({ ...prev, published: !prev.published }));
              });
            });
          }}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing && <Loader className="mr-2 size-4 text-white" />}
          {data.published ? "Unpublish" : "Publish"}
        </Button>
      </div>
      <div className="flex flex-col space-y-3 bg-background p-4">
        <input
          type="text"
          placeholder="Title"
          defaultValue={release?.title || ""}
          autoFocus
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="border-none bg-background px-0 text-3xl placeholder:text-muted-foreground focus:outline-none focus:ring-0 dark:text-foreground"
        />
        <TextareaAutosize
          placeholder="Description"
          defaultValue={release?.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="border-none bg-background px-0 placeholder:text-muted-foreground focus:outline-none focus:ring-0 dark:text-foreground"
        />
      </div>
      <Separator />
      <NovelEditor
        disableLocalStorage
        className="flex-1 overflow-y-auto bg-background"
        defaultValue={release?.content ?? null}
        onUpdate={(editor) => {
          setData((prev) => ({
            ...prev,
            content: editor?.storage.markdown.getMarkdown(),
          }));
        }}
        onDebouncedUpdate={() => {
          if (
            data.title === release.title &&
            data.description === release.description &&
            data.content === release.content
          ) {
            return;
          }
          startTransitionSaving(async () => {
            await updateRelease(data);
          });
        }}
      />
    </>
  );
}
