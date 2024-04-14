"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HueContext } from "@/providers/hue-provider";
import { LucideRocket, LucideSparkles } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { Hue } from "./hue";

export default function Hero() {
  const { setAnchor, width } = useContext(HueContext);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const tempRef = ref.current as Element;
      const rect = tempRef.getBoundingClientRect();
      setAnchor({
        x: rect.left + (rect.width / 2 - width / 2),
        y: rect.top,
      });
    }
  }, [ref.current, width]);

  return (
    <>
      <Hue />
      <div className="flex w-full flex-col items-center justify-center pb-24 pt-12">
        <Badge variant="secondary" className="py-1">
          <LucideSparkles className="size-4 text-primary" />
          <Separator orientation="vertical" className="mx-2 h-3" />
          Releeses was just Released
        </Badge>
        <h1
          ref={ref}
          className="my-8 max-w-3xl text-center text-4xl font-bold mix-blend-multiply md:text-5xl lg:text-6xl"
        >
          Releeses is the best way to manage your changelog
        </h1>
        <p className="mb-8 max-w-2xl text-center mix-blend-multiply md:text-lg">
          Easily manage and publish public changelogs for your applications,
          keeping your audience informed and engaged with every update.
        </p>
        <Button size="lg" asChild>
          <a
            href={`${process.env.NEXT_PUBLIC_DOMAIN?.split("//").join(
              "//app.",
            )}`}
          >
            <LucideRocket className="mr-2 size-4" />
            Get Started
          </a>
        </Button>
      </div>
    </>
  );
}
