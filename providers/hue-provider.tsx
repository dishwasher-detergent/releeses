"use client";

import useHueLoop from "@/hooks/use-hue-loop";
import useMouseHover from "@/hooks/use-mouse-hover";
import useMousePosition from "@/hooks/use-mouse-position";
import React, { createContext, useState } from "react";
import { isMobile } from "react-device-detect";

export interface Position {
  x: number;
  y: number;
}

export interface HueContextProps {
  rotate: number;
  position: Position;
  width: number;
  height: number;
  hovered: boolean;
  anchor: Position;
  setAnchor: (anchor: Position) => void;
}

const HueContext = createContext<HueContextProps>({
  rotate: 0,
  position: {
    x: 0,
    y: 0,
  },
  width: 256,
  height: 256,
  hovered: false,
  anchor: {
    x: 0,
    y: 0,
  },
  setAnchor: () => null,
});

interface ProviderProps {
  children: React.ReactNode;
}

const HueProvider = ({ children }: ProviderProps) => {
  const [anchor, setAnchor] = useState({
    x: 0,
    y: 0,
  });
  const { x: DEFAULT_X, y: DEFAULT_Y } = anchor;
  const rotate = useHueLoop(0, 360, 100);
  const {
    mousePosition: { x: original_x, y: original_y },
    mouseOut,
  } = useMousePosition();
  const hovered = useMouseHover();

  const windowPosX = typeof window !== "undefined" ? window.scrollX : 0;
  const windowPosY = typeof window !== "undefined" ? window.scrollY : 0;

  const calcHoveredSize = hovered ? 320 : 256;

  let height = mouseOut ? 320 : calcHoveredSize;
  let width = mouseOut ? 640 : calcHoveredSize;

  const calcXPos = original_x ? original_x - width / 2 : DEFAULT_X;
  const calcYPos = original_y ? original_y - height / 2 : DEFAULT_Y;

  let x = (mouseOut ? DEFAULT_X : calcXPos) - windowPosX;
  let y = (mouseOut ? DEFAULT_Y : calcYPos) - windowPosY;

  if (isMobile) {
    x = DEFAULT_X;
    y = DEFAULT_Y;
    width = 640;
  }

  const position = {
    x: x,
    y: y,
  };

  return (
    <HueContext.Provider
      value={{ rotate, position, height, width, hovered, anchor, setAnchor }}
    >
      {children}
    </HueContext.Provider>
  );
};

export { HueContext, HueProvider };
