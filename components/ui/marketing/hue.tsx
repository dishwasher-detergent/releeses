"use client";

import { HueContext, HueContextProps } from "@/providers/hue-provider";
import { useContext } from "react";

export const Hue = () => {
  const {
    rotate,
    anchor: { x, y },
  } = useContext<HueContextProps>(HueContext);

  return (
    <>
      <div className="absolute inset-0 z-[-10] mx-auto w-full max-w-5xl overflow-hidden">
        <div
          className="gap-15 pointer-events-none flex w-80 origin-center -rotate-45 scale-[200%] justify-center opacity-30"
          style={{
            filter: `hue-rotate(${rotate}deg) saturate(8) blur(30px)`,
          }}
        >
          <div className="h-48 w-8 bg-pink-400" />
          <div className="h-56 w-8 bg-red-400" />
          <div className="h-64 w-8 bg-yellow-400" />
          <div className="h-72 w-8 bg-green-400" />
          <div className="h-80 w-8 bg-blue-400" />
        </div>
      </div>
    </>
  );
};
