"use client";

import { HueContext } from "@/providers/hue-provider";
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
        x: rect.left + (rect.width / 2 - width * 2),
        y: rect.top - rect.height / 3,
      });
    }
  }, [ref.current, width]);

  return (
    <>
      <Hue />
      <h1
        ref={ref}
        className="mx-4 my-8 max-w-3xl text-left text-5xl font-black mix-blend-multiply md:col-span-3 md:text-6xl lg:text-7xl"
      >
        Releeses is the best way to manage your changelog
      </h1>
      <p className="mx-4 mb-8 max-w-2xl text-left font-semibold mix-blend-multiply md:col-span-2 md:text-lg">
        Easily manage and publish public changelogs for your applications,
        keeping your audience informed and engaged with every update.
      </p>
    </>
  );
}
