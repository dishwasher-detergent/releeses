"use client";

import { Loader } from "@/components/loading/loader";
import { Button } from "@/components/ui/button";
import { LucideUploadCloud } from "lucide-react";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Uploader() {
  const [data, setData] = useState<{
    image: string | null;
  }>({
    image: null,
  });
  const [file, setFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)");
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData],
  );

  const [saving, setSaving] = useState(false);

  const saveDisabled = useMemo(() => {
    return !data.image || saving;
  }, [data.image, saving]);

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        fetch("/api/upload", {
          method: "POST",
          headers: { "content-type": file?.type || "application/octet-stream" },
          body: file,
        }).then(async (res) => {
          if (res.status === 200) {
            const { url } = await res.json();
            toast(
              <div className="relative">
                <div className="p-2">
                  <p className="font-semibold text-slate-900">File uploaded!</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Your file has been uploaded to{" "}
                    <a
                      className="font-medium text-slate-900 underline"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url}
                    </a>
                  </p>
                </div>
              </div>,
            );
          } else {
            const error = await res.text();
            toast.error(error);
          }
          setSaving(false);
        });
      }}
    >
      <div>
        <div className="mb-4 space-y-1">
          <h2 className="text-xl font-semibold">Upload a file</h2>
          <p className="text-sm text-slate-500">
            Accepted formats: .png, .jpg, .gif, .mp4
          </p>
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-slate-300 bg-background shadow-sm transition-all hover:bg-slate-50"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  toast.error("File size too big (max 50MB)");
                } else {
                  setFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? "bg-background/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-background opacity-100 hover:bg-slate-50"
            }`}
          >
            <LucideUploadCloud className="size-6" />
            <p className="mt-2 text-center text-sm text-slate-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-slate-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      <Button disabled={saveDisabled} size="sm">
        {saving && <Loader className="mr-2 size-4 text-white" />}
        Confirm upload
      </Button>
    </form>
  );
}
