"use client";

import cn from "clsx";
import Image from "next/image";
import { useState } from "react";

import type { ComponentProps } from "react";

type ImageWithoutSrcProps = Omit<ComponentProps<typeof Image>, "src"> & {
  src?: string | null;
};

export default function BlurImage(props: ImageWithoutSrcProps) {
  const [isLoading, setLoading] = useState(true);

  return props.src ? (
    <Image
      {...props}
      src={props.src}
      alt={props.alt}
      className={cn(
        props.className,
        "duration-700 ease-in-out",
        isLoading ? "scale-105 blur-lg" : "scale-100 blur-0",
      )}
      onLoad={() => setLoading(false)}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-muted p-4">
      <p className="truncate font-black text-foreground/40">{props.alt}</p>
    </div>
  );
}
