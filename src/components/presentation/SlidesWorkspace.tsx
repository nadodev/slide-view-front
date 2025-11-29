import type { RefObject } from "react";
import SlidesWithThumbs, { Slide } from "../SlidesWithThumbs";
import Navigation from "../Navigation";
import { useTheme } from "../../stores/useThemeStore";

type SlidesWorkspaceProps = {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  transitionKey: number;
  setTransitionKey: (updater: number | ((prev: number) => number)) => void;
  slideTransition: string;
  setSlideTransition: (transition: string) => void;
  focusMode: boolean;
  setFocusMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  presenterMode: boolean;
  setPresenterMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  thumbsRailRef: RefObject<HTMLElement | null>;
  slideContainerRef: RefObject<HTMLElement | null>;
  slideContentRef: RefObject<HTMLElement | null>;
  onRemove: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  setShowSlideList: (value: boolean | ((prev: boolean) => boolean)) => void;
  setEditing: (value: boolean) => void;
  setDraftContent: (value: string) => void;
  duplicateSlide: () => void;
  onSaveAllSlides: () => void;
  onRestart: () => void;
  highContrast: boolean;
  setHighContrast: (value: boolean | ((prev: boolean) => boolean)) => void;
  loading?: boolean;
  
  // Remote control props
  onShowRemoteControl?: () => void;
  remoteSession?: {
    isConnected: boolean;
    remoteClients: number;
  } | null;
  
  // Layout props
  hasNavbar?: boolean;
};

export default function SlidesWorkspace({
  slides,
  currentSlide,
  setCurrentSlide,
  transitionKey,
  setTransitionKey,
  slideTransition,
  setSlideTransition,
  focusMode,
  setFocusMode,
  presenterMode,
  setPresenterMode,
  thumbsRailRef,
  slideContainerRef,
  slideContentRef,
  onRemove,
  onReorder,
  setShowSlideList,
  setEditing,
  setDraftContent,
  duplicateSlide,
  onSaveAllSlides,
  onRestart,
  highContrast,
  setHighContrast,
  loading = false,
  onShowRemoteControl,
  remoteSession,
  hasNavbar = false,
}: SlidesWorkspaceProps) {
  const { isDark } = useTheme();
  
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Área principal dos slides - ocupa todo espaço disponível */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <SlidesWithThumbs
          slides={slides}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          transitionKey={transitionKey}
          setTransitionKey={setTransitionKey}
          slideTransition={slideTransition}
          focusMode={focusMode}
          presenterMode={presenterMode}
          thumbsRailRef={thumbsRailRef}
          slideContainerRef={slideContainerRef}
          slideContentRef={slideContentRef}
          onRemove={onRemove}
          onReorder={onReorder}
          loading={loading}
          hasNavbar={hasNavbar}
        />
      </div>
      
      {/* Navigation - sempre visível no rodapé */}
      <div className={`shrink-0 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <Navigation
          currentSlide={currentSlide}
          totalSlides={slides.length}
          setCurrentSlide={setCurrentSlide}
          setTransitionKey={setTransitionKey}
          setSlideTransition={setSlideTransition}
          slideTransition={slideTransition}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          presenterMode={presenterMode}
          setPresenterMode={setPresenterMode}
          setShowSlideList={setShowSlideList}
          setEditing={setEditing}
          onStartEditing={() => {
            setDraftContent(slides[currentSlide]?.content || "");
            setEditing(true);
          }}
          duplicateSlide={duplicateSlide}
          onSaveAllSlides={onSaveAllSlides}
          onRestart={onRestart}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          onShowRemoteControl={onShowRemoteControl}
          remoteSession={remoteSession}
        />
      </div>
    </div>
  );
}
