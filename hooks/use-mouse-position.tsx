import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

interface Position {
  x: number;
  y: number;
}

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<Position>({
    x: 0,
    y: 0,
  });

  const [mouseOut, setMouseOut] = useState<boolean>(true);

  useEffect(() => {
    if (!isMobile) {
      const updateMousePosition = (ev: MouseEvent) => {
        setMousePosition({ x: ev.pageX, y: ev.pageY });
      };

      const updateMouseOut = (ev: MouseEvent) => {
        if (ev.relatedTarget === null || ev.relatedTarget === undefined) {
          setMouseOut(true);
        } else {
          setMouseOut(false);
        }
      };

      window.addEventListener("mousemove", updateMousePosition);
      window.addEventListener("mouseout", updateMouseOut);
      return () => {
        window.removeEventListener("mousemove", updateMousePosition);
        window.removeEventListener("mouseout", updateMouseOut);
      };
    }
  }, []);

  return { mousePosition, mouseOut };
};

export default useMousePosition;
