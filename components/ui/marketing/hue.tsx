"use client";

import { HueContext, HueContextProps } from "@/providers/hue-provider";
import { useContext } from "react";
import { BrowserView, MobileView } from "react-device-detect";

export const Hue = () => {
  const {
    rotate,
    position: { x, y },
    width,
    height,
    hovered,
  } = useContext<HueContextProps>(HueContext);

  return (
    <>
      <BrowserView>
        <div className="absolute inset-0 z-[-10]">
          <div
            className="absolute z-0 origin-center overflow-hidden rounded-full"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              height: height,
              width: width,
              filter: `blur(${hovered ? "30px" : "45px"})`,
              opacity: x > 0 || y > 0 ? 1 : 0,
              transition:
                "transform 200ms ease-out, filter 200ms linear, height 200ms linear, width 200ms linear, opacity 200ms linear",
            }}
          >
            <div
              className="gap-15 pointer-events-none flex w-80 origin-center -rotate-45 scale-[200%] justify-center opacity-70"
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
        </div>
      </BrowserView>
      <MobileView>
        <div className="absolute left-0 top-0 z-[-10] h-full w-full overflow-hidden">
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
      </MobileView>
    </>
  );
};
