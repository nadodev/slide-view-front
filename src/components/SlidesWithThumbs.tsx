import type { RefObject } from "react";
import { useSlideNavigation } from "../hooks/useSlideNavigation";
import SlideSidebar from "./slides/SlideSidebar";
import SlideStage from "./slides/SlideStage";
import SidebarStyles from "./slides/SidebarStyles";
import type { Slide as SlideType } from "./slides/types";
import { useTheme } from "../stores/useThemeStore";

export type Slide = SlideType;

type SlidesWithThumbsProps = {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  focusMode: boolean;
  presenterMode: boolean;
  thumbsRailRef: RefObject<HTMLElement | null>;
  transitionKey: number;
  setTransitionKey: (updater: number | ((prev: number) => number)) => void;
  slideTransition: string;
  slideContainerRef: RefObject<HTMLElement | null>;
  slideContentRef: RefObject<HTMLElement | null>;
  onRemove?: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  loading?: boolean;
  hasNavbar?: boolean;
};

export default function SlidesWithThumbs({
  slides,
  currentSlide,
  setCurrentSlide,
  focusMode,
  presenterMode,
  thumbsRailRef,
  transitionKey,
  setTransitionKey,
  slideTransition,
  slideContainerRef,
  slideContentRef,
  onRemove,
  onReorder,
  loading = false,
  hasNavbar = false,
}: SlidesWithThumbsProps) {
  const { selectSlide } = useSlideNavigation(setCurrentSlide, setTransitionKey);
  const { isDark } = useTheme();
  const showSidebar = !focusMode && !presenterMode;

  const bgClass = isDark 
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" 
    : "bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100";

  return (
    <div className={`flex h-full w-full overflow-hidden ${bgClass} transition-colors duration-300`}>
      {showSidebar && (
        <SlideSidebar
          slides={slides}
          currentSlide={currentSlide}
          thumbsRailRef={thumbsRailRef}
          onSelect={selectSlide}
          onRemove={onRemove}
          onReorder={onReorder}
          loading={loading}
        />
      )}

      <SlideStage
        slides={slides}
        currentSlide={currentSlide}
        transitionKey={transitionKey}
        slideTransition={slideTransition}
        slideContainerRef={slideContainerRef}
        slideContentRef={slideContentRef}
      />

      <SidebarStyles />
    </div>
  );
}
