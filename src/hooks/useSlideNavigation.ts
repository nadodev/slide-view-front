import { useCallback } from "react";

type SetTransitionKey = (updater: number | ((prev: number) => number)) => void;

export function useSlideNavigation(
  setCurrentSlide: (index: number) => void,
  setTransitionKey: SetTransitionKey,
) {
  const selectSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      setTransitionKey((prev) => (typeof prev === "number" ? prev + 1 : 1));
    },
    [setCurrentSlide, setTransitionKey],
  );

  return { selectSlide };
}

