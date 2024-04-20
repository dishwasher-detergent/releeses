"use client";

import useHueLoop from "@/hooks/use-hue-loop";
import useMouseHover from "@/hooks/use-mouse-hover";
import useMousePosition from "@/hooks/use-mouse-position";
import React, { createContext, useMemo, useState } from "react";
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

const DEFAULT_POSITION = { x: 0, y: 0 };
const DEFAULT_SIZE = 256;
const HOVERED_SIZE = 320;
const MOBILE_SIZE = 640;

const HueContext = createContext<HueContextProps>({
  rotate: 0,
  position: DEFAULT_POSITION,
  width: DEFAULT_SIZE,
  height: DEFAULT_SIZE,
  hovered: false,
  anchor: DEFAULT_POSITION,
  setAnchor: () => null,
});

interface ProviderProps {
  children: React.ReactNode;
}

const HueProvider = ({ children }: ProviderProps) => {
  const [anchor, setAnchor] = useState(DEFAULT_POSITION);
  const rotate = useHueLoop(0, 360, 100);
  const { mousePosition, mouseOut } = useMousePosition();
  const hovered = useMouseHover();

  const { x: original_x, y: original_y } = mousePosition;

  const calcHoveredSize = useMemo(
    () => (hovered ? HOVERED_SIZE : DEFAULT_SIZE),
    [hovered],
  );

  const height = useMemo(
    () => (mouseOut ? HOVERED_SIZE : calcHoveredSize),
    [mouseOut, calcHoveredSize],
  );
  const width = useMemo(
    () => (mouseOut ? MOBILE_SIZE : calcHoveredSize),
    [mouseOut, calcHoveredSize],
  );

  const calcXPos = useMemo(
    () => (original_x ? original_x - width / 2 : anchor.x),
    [original_x, width, anchor.x],
  );
  const calcYPos = useMemo(
    () => (original_y ? original_y - height / 2 : anchor.y),
    [original_y, height, anchor.y],
  );

  let x = useMemo(() => (mouseOut ? anchor.x : calcXPos), [mouseOut, calcXPos]);
  let y = useMemo(() => (mouseOut ? anchor.y : calcYPos), [mouseOut, calcYPos]);

  if (isMobile) {
    x = anchor.x;
    y = anchor.y;
  }

  const position = useMemo(() => ({ x, y }), [x, y]);

  return (
    <HueContext.Provider
      value={{ rotate, position, height, width, hovered, anchor, setAnchor }}
    >
      {children}
    </HueContext.Provider>
  );
};

export { HueContext, HueProvider };
