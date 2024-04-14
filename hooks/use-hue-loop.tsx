"use client";

import { useEffect, useState } from "react";

export default function useHueLoop(from: number, to: number, interval: number) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((prevValue) => (prevValue < to ? prevValue + 1 : from));
    }, interval);

    return () => clearInterval(timer);
  }, [from, to, interval]);

  return value;
}
