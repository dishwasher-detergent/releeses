import { useEffect, useState } from "react";

const useMouseHover = (
  elements: string[] = ["a", "button", "input", "textarea", "select", "option"],
) => {
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  useEffect(() => {
    const updateMouseHover = (ev: MouseEvent) => {
      let target = ev.target as Element | null;

      // Traverse up the DOM tree to check if the target or its parent is one of the specified elements
      while (target) {
        const tagName = target.tagName.toLowerCase();
        if (elements.includes(tagName)) {
          setMouseHover(true);
          return;
        }
        target = target.parentElement;
      }

      setMouseHover(false);
    };

    window.addEventListener("mouseover", updateMouseHover);
    return () => {
      window.removeEventListener("mouseover", updateMouseHover);
    };
  }, [elements]);

  return mouseHover;
};

export default useMouseHover;
