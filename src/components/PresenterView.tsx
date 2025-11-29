import { useEffect, useState, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.min.css";
import { useMermaid } from "../hooks/useMermaid";
import { useTheme } from "../stores/useThemeStore";

type PresenterViewProps = {
  currentHtml?: string;
  currentIndex: number;
  slidesLength: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function PresenterView({
  currentHtml = "",
  currentIndex,
  slidesLength,
  onNext,
  onPrev,
  onExit,
  scrollContainerRef,
}: PresenterViewProps) {
  useMermaid(currentHtml);
  const { isDark } = useTheme();
  const [clockNow, setClockNow] = useState(() => new Date());
  const internalScrollRef = useRef<HTMLDivElement>(null);

  const scrollRef = scrollContainerRef || internalScrollRef;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockNow(prevTime => {
        if (prevTime.getMinutes() !== now.getMinutes() ||
          prevTime.getHours() !== now.getHours()) {
          return now;
        }
        return prevTime;
      });
    };

    const t = setInterval(updateClock, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      document
        .querySelectorAll(".presenter-slide-content pre code")
        .forEach((b: Element) => hljs.highlightElement(b as HTMLElement));
    }, 100);
    return () => clearTimeout(timer);
  }, [currentHtml]);

  // Reset scroll on slide change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentIndex, scrollRef]);

  const progress = ((currentIndex + 1) / slidesLength) * 100;

  return (
    <div className={`fixed inset-0 flex flex-col overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      {/* Progress bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
        <div
          className={`h-full transition-all duration-700 ease-out ${
            isDark 
              ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-sm ${
        isDark 
          ? 'bg-gradient-to-b from-black/40 via-black/20 to-transparent' 
          : 'bg-gradient-to-b from-white/60 via-white/30 to-transparent'
      }`}>
        <div className={`flex items-center gap-8 text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="font-mono tracking-wide">
              {clockNow.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className={`h-4 w-px ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}></div>
          <span className="font-semibold">
            Slide {currentIndex + 1} <span className={isDark ? 'text-white/40' : 'text-slate-400'}>de</span>{" "}
            {slidesLength}
          </span>
        </div>

        <button
          onClick={onExit}
          className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isDark 
              ? 'text-white/50 hover:text-white hover:bg-white/5' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Pressione</span>
          <kbd className={`px-2 py-1 rounded text-xs font-mono ${
            isDark ? 'bg-white/10' : 'bg-slate-200'
          }`}>
            ESC
          </kbd>
          <span>para sair</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-20 py-24 flex items-start justify-center min-h-0">
        <div
          ref={scrollRef}
          className={`w-full max-w-6xl h-full overflow-y-auto py-4 ${isDark ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}
        >
          <div
            className={`presenter-slide-content ${isDark ? 'theme-dark' : 'theme-light'}`}
            dangerouslySetInnerHTML={{ __html: currentHtml }}
          />
        </div>
      </div>

      {/* Bottom navigation */}
      <div className={`absolute bottom-0 left-0 right-0 z-50 flex items-center justify-center pb-10 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-t from-black/40 via-black/20 to-transparent' 
          : 'bg-gradient-to-t from-white/60 via-white/30 to-transparent'
      }`}>
        <div className={`flex items-center gap-3 backdrop-blur-md rounded-full px-6 py-3 border shadow-2xl ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-black/5 border-black/10'
        }`}>
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`w-11 h-11 flex items-center justify-center rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className={`px-5 py-2 rounded-full border ${
            isDark 
              ? 'bg-white/5 border-white/10' 
              : 'bg-slate-100 border-slate-200'
          }`}>
            <span className={`text-sm font-mono font-semibold ${
              isDark ? 'text-white/80' : 'text-slate-700'
            }`}>
              {currentIndex + 1} / {slidesLength}
            </span>
          </div>

          <button
            onClick={onNext}
            disabled={currentIndex >= slidesLength - 1}
            className={`w-11 h-11 flex items-center justify-center rounded-full disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        /* ============================================
           DARK THEME STYLES
           ============================================ */
        .presenter-slide-content.theme-dark {
          color: #f3f4f6;
          line-height: 1.75;
        }

        .presenter-slide-content.theme-dark h1 {
          color: #ffffff;
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 2.5rem 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
        }

        .presenter-slide-content.theme-dark h2 {
          color: #e0e7ff;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 3rem 0 2rem 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 15px rgba(224, 231, 255, 0.4);
        }

        .presenter-slide-content.theme-dark h3 {
          color: #e0e7ff;
          font-size: 2rem;
          font-weight: 600;
          margin: 2.5rem 0 1.5rem 0;
          line-height: 1.3;
        }

        .presenter-slide-content.theme-dark h4 {
          color: #c7d2fe;
          font-size: 2rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
        }

        .presenter-slide-content.theme-dark p {
          font-size: 1.75rem;
          line-height: 1.8;
          margin: 0 0 1.75rem 0;
          color: #e5e7eb;
          font-weight: 400;
        }

        .presenter-slide-content.theme-dark ul, 
        .presenter-slide-content.theme-dark ol {
          font-size: 1.75rem;
          margin: 0 0 2rem 0;
          padding-left: 2.5rem;
          color: #e5e7eb;
        }

        .presenter-slide-content.theme-dark li {
          margin-bottom: 1.25rem;
          line-height: 1.7;
          position: relative;
        }

        .presenter-slide-content.theme-dark ul li::marker {
          color: #818cf8;
          font-size: 1.2em;
        }

        .presenter-slide-content.theme-dark ol li::marker {
          color: #818cf8;
          font-weight: 700;
        }

        .presenter-slide-content.theme-dark strong {
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .presenter-slide-content.theme-dark em {
          color: #a78bfa;
          font-style: italic;
          font-weight: 500;
        }

        .presenter-slide-content.theme-dark code {
          background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%);
          padding: 0.35rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.9em;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
          color: #c7d2fe;
          border: 1px solid rgba(129, 140, 248, 0.2);
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .presenter-slide-content.theme-dark pre {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.8) 100%) !important;
          padding: 2.5rem !important;
          border-radius: 1rem !important;
          margin: 2.5rem 0 !important;
          border: 1px solid rgba(129, 140, 248, 0.2);
          box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          overflow-x: auto;
        }

        .presenter-slide-content.theme-dark pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #818cf8 0%, #a78bfa 50%, #818cf8 100%);
          border-radius: 1rem 1rem 0 0;
        }

        .presenter-slide-content.theme-dark pre code {
          background: transparent !important;
          padding: 0 !important;
          font-size: 1.25rem !important;
          color: inherit !important;
          line-height: 1.7 !important;
          border: none !important;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace !important;
        }

        .presenter-slide-content.theme-dark a {
          color: #818cf8;
          text-decoration: none;
          border-bottom: 2px solid rgba(129, 140, 248, 0.3);
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .presenter-slide-content.theme-dark a:hover {
          color: #a78bfa;
          border-bottom-color: #a78bfa;
          text-shadow: 0 0 20px rgba(167, 139, 250, 0.4);
        }

        .presenter-slide-content.theme-dark blockquote {
          border-left: 4px solid #818cf8;
          padding-left: 2rem;
          margin: 2.5rem 0;
          color: #d1d5db;
          font-style: italic;
          font-size: 1.5rem;
          background: rgba(129, 140, 248, 0.05);
          padding: 1.5rem 2rem;
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .presenter-slide-content.theme-dark hr {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(129, 140, 248, 0.5) 50%, transparent 100%);
          margin: 4rem 0;
        }

        .presenter-slide-content.theme-dark img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .presenter-slide-content.theme-dark table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 2rem 0;
          font-size: 1.25rem;
        }

        .presenter-slide-content.theme-dark th {
          background: rgba(129, 140, 248, 0.15);
          color: #e0e7ff;
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #818cf8;
        }

        .presenter-slide-content.theme-dark td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
        }

        .presenter-slide-content.theme-dark tr:hover {
          background: rgba(129, 140, 248, 0.05);
        }

        /* ============================================
           LIGHT THEME STYLES
           ============================================ */
        .presenter-slide-content.theme-light {
          color: #1e293b;
          line-height: 1.75;
        }

        .presenter-slide-content.theme-light h1 {
          color: #0f172a;
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 2.5rem 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .presenter-slide-content.theme-light h2 {
          color: #1e3a8a;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 3rem 0 2rem 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .presenter-slide-content.theme-light h3 {
          color: #1e40af;
          font-size: 2rem;
          font-weight: 600;
          margin: 2.5rem 0 1.5rem 0;
          line-height: 1.3;
        }

        .presenter-slide-content.theme-light h4 {
          color: #3730a3;
          font-size: 2rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
        }

        .presenter-slide-content.theme-light p {
          font-size: 1.75rem;
          line-height: 1.8;
          margin: 0 0 1.75rem 0;
          color: #334155;
          font-weight: 400;
        }

        .presenter-slide-content.theme-light ul, 
        .presenter-slide-content.theme-light ol {
          font-size: 1.75rem;
          margin: 0 0 2rem 0;
          padding-left: 2.5rem;
          color: #334155;
        }

        .presenter-slide-content.theme-light li {
          margin-bottom: 1.25rem;
          line-height: 1.7;
          position: relative;
        }

        .presenter-slide-content.theme-light ul li::marker {
          color: #4f46e5;
          font-size: 1.2em;
        }

        .presenter-slide-content.theme-light ol li::marker {
          color: #4f46e5;
          font-weight: 700;
        }

        .presenter-slide-content.theme-light strong {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .presenter-slide-content.theme-light em {
          color: #7c3aed;
          font-style: italic;
          font-weight: 500;
        }

        .presenter-slide-content.theme-light code {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
          padding: 0.35rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.9em;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
          color: #4f46e5;
          border: 1px solid rgba(79, 70, 229, 0.2);
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .presenter-slide-content.theme-light pre {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
          padding: 2.5rem !important;
          border-radius: 1rem !important;
          margin: 2.5rem 0 !important;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow-x: auto;
        }

        .presenter-slide-content.theme-light pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%);
          border-radius: 1rem 1rem 0 0;
        }

        .presenter-slide-content.theme-light pre code {
          background: transparent !important;
          padding: 0 !important;
          font-size: 1.25rem !important;
          color: #e2e8f0 !important;
          line-height: 1.7 !important;
          border: none !important;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace !important;
        }

        .presenter-slide-content.theme-light a {
          color: #4f46e5;
          text-decoration: none;
          border-bottom: 2px solid rgba(79, 70, 229, 0.3);
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .presenter-slide-content.theme-light a:hover {
          color: #7c3aed;
          border-bottom-color: #7c3aed;
        }

        .presenter-slide-content.theme-light blockquote {
          border-left: 4px solid #4f46e5;
          padding-left: 2rem;
          margin: 2.5rem 0;
          color: #475569;
          font-style: italic;
          font-size: 1.5rem;
          background: rgba(79, 70, 229, 0.05);
          padding: 1.5rem 2rem;
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .presenter-slide-content.theme-light hr {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(79, 70, 229, 0.3) 50%, transparent 100%);
          margin: 4rem 0;
        }

        .presenter-slide-content.theme-light img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .presenter-slide-content.theme-light table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 2rem 0;
          font-size: 1.25rem;
        }

        .presenter-slide-content.theme-light th {
          background: rgba(79, 70, 229, 0.1);
          color: #1e3a8a;
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #4f46e5;
        }

        .presenter-slide-content.theme-light td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          color: #334155;
        }

        .presenter-slide-content.theme-light tr:hover {
          background: rgba(79, 70, 229, 0.03);
        }

        /* ============================================
           SCROLLBAR STYLES
           ============================================ */
        .custom-scrollbar-dark {
          scrollbar-width: thin;
          scrollbar-color: rgba(129, 140, 248, 0.3) transparent;
          scroll-behavior: smooth;
        }

        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: rgba(129, 140, 248, 0.2);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(129, 140, 248, 0.4);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scrollbar-light {
          scrollbar-width: thin;
          scrollbar-color: rgba(79, 70, 229, 0.3) transparent;
          scroll-behavior: smooth;
        }

        .custom-scrollbar-light::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.2);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.4);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
}
