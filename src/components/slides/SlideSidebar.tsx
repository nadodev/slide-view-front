import type { RefObject } from "react";
import SlideThumbList from "./SlideThumbList";
import { Slide } from "./types";
import { useTheme } from "../../stores/useThemeStore";

type SlideSidebarProps = {
  slides: Slide[];
  currentSlide: number;
  thumbsRailRef: RefObject<HTMLElement | null>;
  onSelect: (index: number) => void;
  onRemove?: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  loading?: boolean;
};

export default function SlideSidebar({
  slides,
  currentSlide,
  thumbsRailRef,
  onSelect,
  onRemove,
  onReorder,
  loading = false,
}: SlideSidebarProps) {
  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? 'bg-slate-900/90' : 'bg-white/95',
    border: isDark ? 'border-slate-800' : 'border-slate-200',
  };

  return (
    <aside
      ref={thumbsRailRef as RefObject<HTMLDivElement>}
      className={`flex w-64 shrink-0 flex-col h-full border-r ${colors.border} ${colors.bg} backdrop-blur-xl transition-colors duration-300`}
    >
      <SidebarHeader totalSlides={slides.length} />
      
      {/* Lista com scroll */}
      <div className={`flex-1 min-h-0 overflow-y-auto ${isDark ? 'sidebar-scroll-dark' : 'sidebar-scroll-light'}`}>
        <SlideThumbList
          slides={slides}
          currentSlide={currentSlide}
          onSelect={onSelect}
          onRemove={onRemove}
          onReorder={onReorder}
          loading={loading}
        />
      </div>
      
      <SidebarFooter currentSlide={currentSlide} totalSlides={slides.length} />
      
      <style>{`
        .sidebar-scroll-dark::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll-dark::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.3);
          border-radius: 3px;
        }
        .sidebar-scroll-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.5);
        }
        .sidebar-scroll-light::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll-light::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 3px;
        }
        .sidebar-scroll-light::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
      `}</style>
    </aside>
  );
}

const SidebarHeader = ({ totalSlides }: { totalSlides: number }) => {
  const { isDark } = useTheme();

  return (
    <div className={`shrink-0 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} px-4 py-3`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Slides
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isDark ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-blue-600'}`}>
          {totalSlides}
        </span>
      </div>
    </div>
  );
};

const SidebarFooter = ({
  currentSlide,
  totalSlides,
}: {
  currentSlide: number;
  totalSlides: number;
}) => {
  const { isDark } = useTheme();
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className={`shrink-0 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} px-4 py-3`}>
      <div className="flex items-center gap-3">
        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`text-xs font-bold tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {currentSlide + 1}/{totalSlides}
        </span>
      </div>
    </div>
  );
};
