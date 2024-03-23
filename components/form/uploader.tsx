"use client";

import { cn } from "@/lib/utils";
import { LucideUploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Uploader({
  defaultValue,
  name,
}: {
  defaultValue: string | null;
  name: "image" | "logo";
}) {
  const aspectRatio = name === "image" ? "aspect-video" : "aspect-square";

  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    [name]: defaultValue,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (file: File | null) => {
    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else if (
        !file.type.includes("png") &&
        !file.type.includes("jpg") &&
        !file.type.includes("jpeg")
      ) {
        toast.error("Invalid file type (must be .png, .jpg, or .jpeg)");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, [name]: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <label
        htmlFor={`${name}-upload`}
        className={cn(
          "group relative mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border border-slate-300 bg-white shadow-sm transition-all hover:bg-slate-50",
          aspectRatio,
          {
            "max-w-screen-md": aspectRatio === "aspect-video",
            "max-w-xs": aspectRatio === "aspect-square",
          },
        )}
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
            inputRef.current!.files = e.dataTransfer.files; // set input file to dropped file
            handleUpload(file);
          }}
        />
        <div
          className={`${
            dragActive ? "border-2 border-black" : ""
          } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
            data[name]
              ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
              : "bg-white opacity-100 hover:bg-slate-50"
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
        {data[name] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data[name] as string}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        )}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          id={`${name}-upload`}
          ref={inputRef}
          name={name}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files && e.currentTarget.files[0];
            handleUpload(file);
          }}
        />
      </div>
    </div>
  );
}
