import type { RefObject } from "react";
import { useMermaid } from "../hooks/useMermaid";
import { useTheme } from "../stores/useThemeStore";

type SlideViewerProps = {
  html?: string;
  slideContainerRef?: RefObject<HTMLElement | null>;
  slideContentRef?: RefObject<HTMLElement | null>;
};

export default function SlideViewer({
  html = "",
  slideContainerRef,
  slideContentRef,
}: SlideViewerProps) {
  useMermaid(html);
  const { isDark } = useTheme();

  const containerClass = isDark
    ? "bg-slate-900 border border-slate-800"
    : "bg-white border border-slate-200";

  return (
    <div
      ref={slideContainerRef as any}
      className={`w-full h-full rounded-lg shadow-lg flex flex-col transition-colors duration-300 overflow-hidden ${containerClass}`}
    >
      <div
        ref={slideContentRef as any}
        className={`flex-1 overflow-y-auto p-5 md:p-6 lg:p-8 ${isDark ? 'custom-scroll-dark' : 'custom-scroll-light'}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style>{`
        /* ============================================
           DARK THEME SCROLLBAR
           ============================================ */
        .custom-scroll-dark::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scroll-dark::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 5px;
          margin: 8px 0;
        }

        .custom-scroll-dark::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scroll-dark::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        /* ============================================
           LIGHT THEME SCROLLBAR
           ============================================ */
        .custom-scroll-light::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scroll-light::-webkit-scrollbar-track {
          background: rgba(226, 232, 240, 0.5);
          border-radius: 5px;
          margin: 8px 0;
        }

        .custom-scroll-light::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .custom-scroll-light::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        /* ============================================
           DARK THEME CONTENT STYLES
           ============================================ */
        .custom-scroll-dark {
          color: #f3f4f6;
        }

        /* Títulos - Dark */
        .custom-scroll-dark h1 {
          font-size: clamp(1.75rem, 3.5vw, 2.6rem) !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          margin-bottom: 1.5rem !important;
          margin-top: 0 !important;
          line-height: 1.15 !important;
          letter-spacing: -0.01em !important;
        }

        .custom-scroll-dark h2 {
          font-size: clamp(1.5rem, 2.7vw, 2.1rem) !important;
          font-weight: 700 !important;
          color: #f9fafb !important;
          margin-bottom: 1.25rem !important;
          margin-top: 2.5rem !important;
          line-height: 1.25 !important;
        }

        .custom-scroll-dark h3 {
          font-size: clamp(1.35rem, 2.1vw, 1.7rem) !important;
          font-weight: 600 !important;
          color: #e5e7eb !important;
          margin-bottom: 1rem !important;
          margin-top: 2rem !important;
          line-height: 1.3 !important;
        }

        .custom-scroll-dark h4 {
          font-size: 1.35rem !important;
          font-weight: 600 !important;
          color: #d1d5db !important;
          margin-bottom: 0.85rem !important;
          margin-top: 1.75rem !important;
        }

        .custom-scroll-dark h5 {
          font-size: 1.2rem !important;
          font-weight: 600 !important;
          color: #d1d5db !important;
          margin-bottom: 0.65rem !important;
          margin-top: 1.4rem !important;
        }

        .custom-scroll-dark h6 {
          font-size: 1.05rem !important;
          font-weight: 600 !important;
          color: #9ca3af !important;
          margin-bottom: 0.6rem !important;
          margin-top: 1.3rem !important;
        }

        .custom-scroll-dark h1:first-child,
        .custom-scroll-dark h2:first-child,
        .custom-scroll-dark h3:first-child,
        .custom-scroll-dark h4:first-child,
        .custom-scroll-dark h5:first-child,
        .custom-scroll-dark h6:first-child {
          margin-top: 0;
        }

        /* Parágrafos - Dark */
        .custom-scroll-dark p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #d1d5db;
          margin-bottom: 1.25rem;
        }

        /* Links - Dark */
        .custom-scroll-dark a {
          color: #60a5fa !important;
          text-decoration: underline !important;
          text-decoration-color: rgba(96, 165, 250, 0.3) !important;
          text-underline-offset: 3px !important;
          transition: all 0.2s !important;
        }

        .custom-scroll-dark a:hover {
          color: #93c5fd !important;
          text-decoration-color: rgba(147, 197, 253, 0.6) !important;
        }

        /* Listas - Dark */
        .custom-scroll-dark ul,
        .custom-scroll-dark ol {
          margin-bottom: 2rem;
          padding-left: 2.5rem;
          color: #d1d5db;
        }

        .custom-scroll-dark ul {
          list-style-type: disc;
        }

        .custom-scroll-dark ol {
          list-style-type: decimal;
        }

        .custom-scroll-dark li {
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .custom-scroll-dark li::marker {
          color: #60a5fa !important;
        }

        .custom-scroll-dark ul ul,
        .custom-scroll-dark ol ul,
        .custom-scroll-dark ul ol,
        .custom-scroll-dark ol ol {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }

        /* Código inline - Dark */
        .custom-scroll-dark code {
          background-color: rgba(59, 130, 246, 0.1) !important;
          color: #93c5fd !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.375rem !important;
          font-size: 0.95em !important;
          font-family: "Consolas", "Monaco", "Courier New", monospace !important;
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
        }

        /* Blocos de código - Dark */
        .custom-scroll-dark pre {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .custom-scroll-dark pre code {
          background-color: transparent !important;
          color: #e5e7eb !important;
          padding: 0 !important;
          border: none !important;
          font-size: 0.95rem !important;
          line-height: 1.6;
        }

        /* Citações - Dark */
        .custom-scroll-dark blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 2rem 0;
          color: #9ca3af;
          font-style: italic;
          background-color: rgba(59, 130, 246, 0.05);
          padding: 1.25rem 1.5rem;
          border-radius: 0.5rem;
        }

        .custom-scroll-dark blockquote p {
          margin-bottom: 0.5rem;
        }

        .custom-scroll-dark blockquote p:last-child {
          margin-bottom: 0;
        }

        /* Linha horizontal - Dark */
        .custom-scroll-dark hr {
          border: none;
          border-top: 2px solid #374151;
          margin: 2.5rem 0;
        }

        /* Tabelas - Dark */
        .custom-scroll-dark table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
          background-color: #1f2937;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .custom-scroll-dark thead {
          background-color: #374151;
        }

        .custom-scroll-dark th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #f9fafb;
          border-bottom: 2px solid #4b5563;
        }

        .custom-scroll-dark td {
          padding: 0.875rem 1rem;
          color: #d1d5db;
          border-bottom: 1px solid #374151;
        }

        .custom-scroll-dark tbody tr:hover {
          background-color: rgba(55, 65, 81, 0.5);
        }

        /* Imagens - Dark */
        .custom-scroll-dark img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        /* Ênfase - Dark */
        .custom-scroll-dark strong,
        .custom-scroll-dark b {
          font-weight: 700 !important;
          color: #ffffff !important;
        }

        .custom-scroll-dark em,
        .custom-scroll-dark i {
          font-style: italic !important;
          color: #e5e7eb !important;
        }

        .custom-scroll-dark del,
        .custom-scroll-dark s {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .custom-scroll-dark > *:last-child {
          margin-bottom: 0;
        }

        /* Mermaid - Dark */
        .custom-scroll-dark .mermaid-container {
          margin: 2rem 0;
          padding: 1.5rem;
          background-color: #1e293b;
          border-radius: 0.75rem;
          border: 1px solid #334155;
          overflow-x: auto;
        }

        .custom-scroll-dark .mermaid {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .custom-scroll-dark .mermaid svg {
          max-width: 100%;
          height: auto;
        }

        /* ============================================
           LIGHT THEME CONTENT STYLES
           ============================================ */
        .custom-scroll-light {
          color: #1e293b;
        }

        /* Títulos - Light */
        .custom-scroll-light h1 {
          font-size: clamp(1.75rem, 3.5vw, 2.6rem) !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin-bottom: 1.5rem !important;
          margin-top: 0 !important;
          line-height: 1.15 !important;
          letter-spacing: -0.01em !important;
        }

        .custom-scroll-light h2 {
          font-size: clamp(1.5rem, 2.7vw, 2.1rem) !important;
          font-weight: 700 !important;
          color: #1e3a8a !important;
          margin-bottom: 1.25rem !important;
          margin-top: 2.5rem !important;
          line-height: 1.25 !important;
        }

        .custom-scroll-light h3 {
          font-size: clamp(1.35rem, 2.1vw, 1.7rem) !important;
          font-weight: 600 !important;
          color: #1e40af !important;
          margin-bottom: 1rem !important;
          margin-top: 2rem !important;
          line-height: 1.3 !important;
        }

        .custom-scroll-light h4 {
          font-size: 1.35rem !important;
          font-weight: 600 !important;
          color: #3730a3 !important;
          margin-bottom: 0.85rem !important;
          margin-top: 1.75rem !important;
        }

        .custom-scroll-light h5 {
          font-size: 1.2rem !important;
          font-weight: 600 !important;
          color: #4338ca !important;
          margin-bottom: 0.65rem !important;
          margin-top: 1.4rem !important;
        }

        .custom-scroll-light h6 {
          font-size: 1.05rem !important;
          font-weight: 600 !important;
          color: #4f46e5 !important;
          margin-bottom: 0.6rem !important;
          margin-top: 1.3rem !important;
        }

        .custom-scroll-light h1:first-child,
        .custom-scroll-light h2:first-child,
        .custom-scroll-light h3:first-child,
        .custom-scroll-light h4:first-child,
        .custom-scroll-light h5:first-child,
        .custom-scroll-light h6:first-child {
          margin-top: 0;
        }

        /* Parágrafos - Light */
        .custom-scroll-light p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #334155;
          margin-bottom: 1.25rem;
        }

        /* Links - Light */
        .custom-scroll-light a {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: rgba(37, 99, 235, 0.3) !important;
          text-underline-offset: 3px !important;
          transition: all 0.2s !important;
        }

        .custom-scroll-light a:hover {
          color: #1d4ed8 !important;
          text-decoration-color: rgba(29, 78, 216, 0.6) !important;
        }

        /* Listas - Light */
        .custom-scroll-light ul,
        .custom-scroll-light ol {
          margin-bottom: 2rem;
          padding-left: 2.5rem;
          color: #334155;
        }

        .custom-scroll-light ul {
          list-style-type: disc;
        }

        .custom-scroll-light ol {
          list-style-type: decimal;
        }

        .custom-scroll-light li {
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .custom-scroll-light li::marker {
          color: #2563eb !important;
        }

        .custom-scroll-light ul ul,
        .custom-scroll-light ol ul,
        .custom-scroll-light ul ol,
        .custom-scroll-light ol ol {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }

        /* Código inline - Light */
        .custom-scroll-light code {
          background-color: rgba(79, 70, 229, 0.08) !important;
          color: #4f46e5 !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.375rem !important;
          font-size: 0.95em !important;
          font-family: "Consolas", "Monaco", "Courier New", monospace !important;
          border: 1px solid rgba(79, 70, 229, 0.15) !important;
        }

        /* Blocos de código - Light */
        .custom-scroll-light pre {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .custom-scroll-light pre code {
          background-color: transparent !important;
          color: #e2e8f0 !important;
          padding: 0 !important;
          border: none !important;
          font-size: 0.95rem !important;
          line-height: 1.6;
        }

        /* Citações - Light */
        .custom-scroll-light blockquote {
          border-left: 4px solid #4f46e5;
          padding-left: 1.5rem;
          margin: 2rem 0;
          color: #475569;
          font-style: italic;
          background-color: rgba(79, 70, 229, 0.05);
          padding: 1.25rem 1.5rem;
          border-radius: 0.5rem;
        }

        .custom-scroll-light blockquote p {
          margin-bottom: 0.5rem;
        }

        .custom-scroll-light blockquote p:last-child {
          margin-bottom: 0;
        }

        /* Linha horizontal - Light */
        .custom-scroll-light hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 2.5rem 0;
        }

        /* Tabelas - Light */
        .custom-scroll-light table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
          background-color: #ffffff;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .custom-scroll-light thead {
          background-color: #f1f5f9;
        }

        .custom-scroll-light th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #0f172a;
          border-bottom: 2px solid #e2e8f0;
        }

        .custom-scroll-light td {
          padding: 0.875rem 1rem;
          color: #334155;
          border-bottom: 1px solid #e2e8f0;
        }

        .custom-scroll-light tbody tr:hover {
          background-color: #f8fafc;
        }

        /* Imagens - Light */
        .custom-scroll-light img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        /* Ênfase - Light */
        .custom-scroll-light strong,
        .custom-scroll-light b {
          font-weight: 700 !important;
          color: #0f172a !important;
        }

        .custom-scroll-light em,
        .custom-scroll-light i {
          font-style: italic !important;
          color: #334155 !important;
        }

        .custom-scroll-light del,
        .custom-scroll-light s {
          text-decoration: line-through;
          color: #64748b;
        }

        .custom-scroll-light > *:last-child {
          margin-bottom: 0;
        }

        /* Mermaid - Light */
        .custom-scroll-light .mermaid-container {
          margin: 2rem 0;
          padding: 1.5rem;
          background-color: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .custom-scroll-light .mermaid {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .custom-scroll-light .mermaid svg {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
}
