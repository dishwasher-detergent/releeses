"use client";

import { Release } from "@/interfaces/release";
import { updateRelease, updateReleaseMetadata } from "@/lib/actions";
import { ExternalLink } from "lucide-react";
import { Editor as NovelEditor } from "novel";
import { useEffect, useState, useTransition } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { Badge } from "./badge";
import { Button, buttonVariants } from "./button";
import { Separator } from "./separator";

export default function Editor({ post }: { post: Release }) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<Release>(post);

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
          onClick={() => {
            const formData = new FormData();
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updateReleaseMetadata(formData, post.$id, "published").then(
                () => {
                  toast.success(
                    `Successfully ${
                      data.published ? "unpublished" : "published"
                    } your post.`,
                  );
                  setData((prev) => ({ ...prev, published: !prev.published }));
                },
              );
            });
          }}
          size="sm"
          disabled={isPendingPublishing}
        >
          {isPendingPublishing ? (
            "loading"
          ) : (
            <p>{data.published ? "Unpublish" : "Publish"}</p>
          )}
        </Button>
      </div>
      <div className="flex flex-col space-y-3 p-4">
        <input
          type="text"
          placeholder="Title"
          defaultValue={post?.title || ""}
          autoFocus
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="dark:placeholder-text-600 font-cal border-none px-0 text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
        <TextareaAutosize
          placeholder="Description"
          defaultValue={post?.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
      </div>
      <Separator />
      <NovelEditor
        disableLocalStorage
        className="h-full overflow-y-auto"
        defaultValue={post?.content ?? null}
        onUpdate={(editor) => {
          setData((prev) => ({
            ...prev,
            content: editor?.storage.markdown.getMarkdown(),
          }));
        }}
        onDebouncedUpdate={() => {
          if (
            data.title === post.title &&
            data.description === post.description &&
            data.content === post.content
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
