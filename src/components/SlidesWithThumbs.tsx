import React from "react";
import SlideViewer from "./SlideViewer";
import { Trash, TrashIcon } from "lucide-react";

export type Slide = {
  name?: string;
  content?: string;
  notes?: string[];
  html?: string;
  _fileHandle?: any;
};

type SlidesWithThumbsProps = {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  focusMode: boolean;
  presenterMode: boolean;
  thumbsRailRef: React.RefObject<HTMLElement | null>;
  transitionKey: number;
  setTransitionKey: (updater: number | ((prev: number) => number)) => void;
  slideTransition: string;
  slideContainerRef: React.RefObject<HTMLElement | null>;
  slideContentRef: React.RefObject<HTMLElement | null>;
  onRemove?: (index: number) => void;
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
}: SlidesWithThumbsProps) {
  return (
    <div className="flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden w-full h-[calc(100vh-80px)]">
      {!focusMode && !presenterMode && (
        <aside
          ref={thumbsRailRef as React.RefObject<HTMLDivElement>}
          className="w-80 flex flex-col bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 shadow-2xl"
        >
          {/* Header Elegante */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-slate-800/50 bg-gradient-to-b from-slate-900/80 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Slides
              </h2>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-300">
                {slides.length}
              </span>
            </div>
          </div>

          {/* Lista de Slides com Scroll */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
            <ul className="space-y-3">
              {slides.map((s, idx) => {
                const active = idx === currentSlide;
                const previewText = (s.content || "")
                  .replace(/[#`>*_\-]/g, "")
                  .trim()
                  .slice(0, 80);

                return (
                  <li key={idx} className="relative">
                    <button
                      type="button"
                      className={`group w-full text-left rounded-xl transition-all duration-300 overflow-hidden ${
                        active
                          ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-900/50 scale-[1.02]"
                          : "bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg hover:scale-[1.01]"
                      }`}
                      onClick={() => {
                        setCurrentSlide(idx);
                        setTransitionKey((prev: number) =>
                          typeof prev === "number" ? prev + 1 : 1,
                        );
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Número do Slide com Design Moderno */}
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                              active
                                ? "bg-white/20 text-white shadow-inner"
                                : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-slate-300"
                            }`}
                          >
                            {idx + 1}
                          </div>

                          {/* Preview do Conteúdo */}
                          <div className="flex-1 min-w-0 pr-8">
                            {s.name && (
                              <div
                                className={`text-sm font-semibold mb-1.5 truncate ${
                                  active
                                    ? "text-white"
                                    : "text-slate-300 group-hover:text-white"
                                }`}
                              >
                                {s.name}
                              </div>
                            )}
                            <p
                              className={`text-xs leading-relaxed line-clamp-2 ${
                                active
                                  ? "text-blue-100"
                                  : "text-slate-500 group-hover:text-slate-400"
                              }`}
                            >
                              {previewText || "Slide sem conteúdo"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Indicador Visual de Slide Ativo */}
                      {active && (
                        <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse" />
                      )}
                    </button>

                    {/* Botão de Deletar - posicionado absolutamente */}
                    {slides.length > 1 && onRemove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Tem certeza que deseja excluir o slide ${idx + 1}?`)) {
                            onRemove(idx);
                          }
                        }}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 ${
                          active
                            ? "bg-red-500/20 hover:bg-red-500/30 text-red-300"
                            : "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                        }`}
                        title="Excluir slide"
                        aria-label={`Excluir slide ${idx + 1}`}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer Moderno */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-800/50 bg-gradient-to-t from-slate-900/80 to-transparent">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Navegação</span>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                  ↑↓
                </kbd>
                <span className="text-slate-600">ou clique</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{
                    width: `${((currentSlide + 1) / slides.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-400 min-w-[60px] text-right">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </aside>
      )}

      {/* Área Principal - Slide */}
      <main className="flex-1 flex items-center justify-center p-12 overflow-hidden">
        <div
          key={transitionKey}
          className={`slide-transition slide-transition-${slideTransition} h-full w-full max-w-7xl`}
        >
          <SlideViewer
            html={slides[currentSlide]?.html || ""}
            slideContainerRef={slideContainerRef}
            slideContentRef={slideContentRef}
          />
        </div>
      </main>

      <style>{`
        /* Scrollbar Elegante */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.4);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.6);
        }

        /* Line Clamp */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Animação de Pulse Suave */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Transições de Slides */
        .slide-transition {
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
