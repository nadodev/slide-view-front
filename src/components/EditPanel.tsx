import React, { useEffect, useRef, useState, useMemo } from "react";
import { Maximize2, Minimize2, Eye, EyeOff, X, Save } from "lucide-react";
import parseMarkdownSafe from "../utils/markdown";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";

type EditPanelProps = {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
  editorFocus?: boolean;
  onToggleEditorFocus?: () => void;
};

export default function EditPanel({
  open,
  value,
  onChange,
  onCancel,
  onSave,
  editorFocus = false,
  onToggleEditorFocus,
}: EditPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);

  const [internalFocus, setInternalFocus] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const focusOn = onToggleEditorFocus ? editorFocus : internalFocus;

  const suppressEditorSync = useRef(false);
  const suppressPreviewSync = useRef(false);

  const previewHtml = useMemo(() => {
    try {
      return parseMarkdownSafe(value || "");
    } catch {
      return "<p style='color:#f87171'>Erro ao renderizar preview.</p>";
    }
  }, [value]);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "s") {
        e.preventDefault();
        onSave();
      }
      if (key === "escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handler as EventListener);
    return () =>
      window.removeEventListener("keydown", handler as EventListener);
  }, [open, onSave, onCancel]);

  const sync = (from: HTMLElement, to: HTMLElement) => {
    const maxFrom = from.scrollHeight - from.clientHeight;
    if (maxFrom <= 0) return;
    const ratio = from.scrollTop / maxFrom;
    const maxTo = to.scrollHeight - to.clientHeight;
    to.scrollTop = ratio * maxTo;
  };

  const onEditorScroll = () => {
    if (!showPreview || focusOn) return;
    if (suppressEditorSync.current) return;
    const editorEl = textareaRef.current;
    const previewEl = previewScrollRef.current;
    if (!editorEl || !previewEl) return;
    suppressPreviewSync.current = true;
    sync(editorEl, previewEl);
    requestAnimationFrame(() => {
      suppressPreviewSync.current = false;
    });
  };

  const onPreviewScroll = () => {
    if (!showPreview || focusOn) return;
    if (suppressPreviewSync.current) return;
    const editorEl = textareaRef.current;
    const previewEl = previewScrollRef.current;
    if (!editorEl || !previewEl) return;
    suppressEditorSync.current = true;
    sync(previewEl, editorEl);
    requestAnimationFrame(() => {
      suppressEditorSync.current = false;
    });
  };

  useEffect(() => {
    const previewEl = previewScrollRef.current;
    if (!previewEl) return;
    previewEl.addEventListener("scroll", onPreviewScroll);
    return () => {
      previewEl.removeEventListener("scroll", onPreviewScroll);
    };
  }, [showPreview, focusOn, value]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Editar slide"
      data-preview={showPreview ? "on" : "off"}
    >
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
        {/* Header Moderno */}
        <header className="relative flex items-center justify-between px-8 py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <div>
              <h2 className="text-lg font-bold text-white">
                Editor de Markdown
              </h2>
              <p className="text-xs text-slate-400">
                Edite e visualize em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!focusOn && (
              <button
                className={`group px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  showPreview
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50"
                }`}
                aria-pressed={showPreview}
                onClick={() => setShowPreview((v) => !v)}
                title={showPreview ? "Ocultar preview" : "Mostrar preview"}
              >
                {showPreview ? (
                  <EyeOff
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                ) : (
                  <Eye
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                )}
                <span className="text-sm font-medium">
                  {showPreview ? "Ocultar" : "Preview"}
                </span>
              </button>
            )}

            <button
              className="group px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 text-slate-300 hover:text-white rounded-lg flex items-center gap-2 transition-all duration-200"
              onClick={() =>
                onToggleEditorFocus
                  ? onToggleEditorFocus()
                  : setInternalFocus((v) => !v)
              }
              title={focusOn ? "Sair do foco do editor" : "Foco no editor"}
            >
              {focusOn ? (
                <Minimize2
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />
              ) : (
                <Maximize2
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />
              )}
              <span className="text-sm font-medium">
                {focusOn ? "Normal" : "Expandir"}
              </span>
            </button>

            <div className="w-px h-8 bg-slate-700/50 mx-1" />

            <button
              className="group px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 text-slate-300 hover:text-white rounded-lg flex items-center gap-2 transition-all duration-200"
              onClick={onCancel}
              title="Cancelar (Esc)"
            >
              <X
                size={16}
                className="transition-transform group-hover:rotate-90"
              />
              <span className="text-sm font-medium">Cancelar</span>
            </button>

            <button
              className="group px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg text-white font-medium flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:scale-105"
              onClick={onSave}
              title="Salvar (Ctrl+S ou Cmd+S)"
            >
              <Save
                size={16}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-sm">Salvar</span>
            </button>
          </div>
        </header>

        {/* Área de Edição */}
        <div className="flex-1 overflow-hidden">
          {focusOn ? (
            /* Modo Foco - Apenas Editor */
            <div className="h-full flex flex-col">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
                  📝 Markdown
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={onEditorScroll}
                spellCheck={false}
                placeholder="# Título do Slide

Comece a digitar seu conteúdo em Markdown aqui...

- Lista de itens
- Outro item

**Texto em negrito** e *itálico*"
                aria-label="Editor de Markdown do slide"
                className="flex-1 w-full h-full pt-16 px-6 pb-6 bg-slate-950 text-slate-100 font-mono text-[15px] leading-relaxed resize-none outline-none border-none overflow-auto custom-scrollbar placeholder:text-slate-600"
              />
            </div>
          ) : showPreview ? (
            /* Modo Split - Editor + Preview com Resizable */
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
                      📝 Markdown
                    </span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onScroll={onEditorScroll}
                    spellCheck={false}
                    placeholder="# Título do Slide

Comece a digitar seu conteúdo em Markdown aqui...

- Lista de itens
- Outro item

**Texto em negrito** e *itálico*"
                    aria-label="Editor de Markdown do slide"
                    className="flex-1 w-full h-full pt-16 px-6 pb-6 bg-slate-950 text-slate-100 font-mono text-[15px] leading-relaxed resize-none outline-none border-none overflow-auto custom-scrollbar placeholder:text-slate-600"
                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle className="w-2 bg-slate-700/30 hover:bg-slate-600/50 transition-all duration-200 relative group border-l border-r border-slate-600/20 hover:border-slate-500/40">
                <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-slate-500/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-slate-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </ResizableHandle>
              
              <ResizablePanel defaultSize={50} minSize={30}>
                <div
                  ref={previewScrollRef}
                  className="h-full flex flex-col overflow-auto bg-gradient-to-br from-slate-900 to-slate-800 custom-scrollbar"
                >
                  <div className="sticky top-0 z-10 px-6 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-sm font-semibold text-white">
                        Preview ao Vivo
                      </h3>
                    </div>
                    <span className="px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      Sync
                    </span>
                  </div>
                  <div className="p-8">
                    {previewHtml.trim() ? (
                      <div
                        className="markdown-preview"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
                          <Eye size={24} className="text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-500 italic">
                          Nada para pré-visualizar ainda
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Digite markdown no editor para ver o resultado aqui
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            /* Modo Apenas Editor */
            <div className="h-full flex flex-col">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
                  📝 Markdown
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={onEditorScroll}
                spellCheck={false}
                placeholder="# Título do Slide

Comece a digitar seu conteúdo em Markdown aqui...

- Lista de itens
- Outro item

**Texto em negrito** e *itálico*"
                aria-label="Editor de Markdown do slide"
                className="flex-1 w-full h-full pt-16 px-6 pb-6 bg-slate-950 text-slate-100 font-mono text-[15px] leading-relaxed resize-none outline-none border-none overflow-auto custom-scrollbar placeholder:text-slate-600"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">
                  Ctrl+S
                </kbd>
                <span>Salvar</span>
              </div>
              <div className="w-px h-4 bg-slate-700/50" />
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">
                  Esc
                </kbd>
                <span>Cancelar</span>
              </div>
              {!focusOn && showPreview && (
                <>
                  <div className="w-px h-4 bg-slate-700/50" />
                  <span className="text-emerald-400 font-medium">
                    ⚡ Preview sincronizado
                  </span>
                  <div className="w-px h-4 bg-slate-700/50" />
                  <span className="text-blue-400 font-medium flex items-center gap-1">
                    ↔️ Redimensionável
                  </span>
                </>
              )}
            </div>
            <div className="text-slate-500">{value.length} caracteres</div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
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

        /* Estilos do Markdown Preview */
        .markdown-preview {
          color: #e2e8f0;
          line-height: 1.75;
          max-width: none;
        }

        /* Headings */
        .markdown-preview h1,
        .markdown-preview h2,
        .markdown-preview h3,
        .markdown-preview h4,
        .markdown-preview h5,
        .markdown-preview h6 {
          font-weight: 700;
          color: #ffffff;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          line-height: 1.25;
        }

        .markdown-preview h1 {
          font-size: 2.5rem;
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          padding-bottom: 0.5em;
          border-bottom: 2px solid rgba(100, 116, 139, 0.3);
        }

        .markdown-preview h2 {
          font-size: 2rem;
          color: #f1f5f9;
          padding-bottom: 0.3em;
          border-bottom: 1px solid rgba(100, 116, 139, 0.3);
        }

        .markdown-preview h3 {
          font-size: 1.5rem;
          color: #e2e8f0;
        }

        .markdown-preview h4 {
          font-size: 1.25rem;
          color: #cbd5e1;
        }

        .markdown-preview h5 {
          font-size: 1.125rem;
          color: #cbd5e1;
        }

        .markdown-preview h6 {
          font-size: 1rem;
          color: #94a3b8;
        }

        /* Paragraphs */
        .markdown-preview p {
          margin-top: 1em;
          margin-bottom: 1em;
          color: #cbd5e1;
        }

        /* Links */
        .markdown-preview a {
          color: #60a5fa;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }

        .markdown-preview a:hover {
          color: #93c5fd;
          border-bottom-color: #60a5fa;
        }

        /* Strong & Em */
        .markdown-preview strong {
          font-weight: 700;
          color: #ffffff;
        }

        .markdown-preview em {
          font-style: italic;
          color: #e2e8f0;
        }

        /* Lists */
        .markdown-preview ul,
        .markdown-preview ol {
          margin-top: 1em;
          margin-bottom: 1em;
          padding-left: 1.5em;
          color: #cbd5e1;
        }

        .markdown-preview li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .markdown-preview ul > li {
          list-style-type: disc;
        }

        .markdown-preview ul > li::marker {
          color: #60a5fa;
        }

        .markdown-preview ol > li {
          list-style-type: decimal;
        }

        .markdown-preview ol > li::marker {
          color: #a78bfa;
          font-weight: 600;
        }

        /* Code */
        .markdown-preview code {
          background: #1e293b;
          color: #c084fc;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.875em;
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        .markdown-preview pre {
          background: #0f172a;
          border: 1px solid rgba(100, 116, 139, 0.3);
          border-radius: 0.75rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5em 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .markdown-preview pre code {
          background: transparent;
          padding: 0;
          border: none;
          color: #e2e8f0;
          font-size: 0.9rem;
        }

        /* Blockquotes */
        .markdown-preview blockquote {
          border-left: 4px solid #3b82f6;
          background: rgba(30, 41, 59, 0.5);
          padding: 1rem 1.5rem;
          margin: 1.5em 0;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #cbd5e1;
        }

        .markdown-preview blockquote p {
          margin: 0.5em 0;
        }

        /* Tables */
        .markdown-preview table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          background: rgba(30, 41, 59, 0.3);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .markdown-preview th {
          background: rgba(51, 65, 85, 0.8);
          color: #f1f5f9;
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 2px solid rgba(100, 116, 139, 0.5);
        }

        .markdown-preview td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(100, 116, 139, 0.2);
          color: #cbd5e1;
        }

        .markdown-preview tr:last-child td {
          border-bottom: none;
        }

        .markdown-preview tr:hover {
          background: rgba(51, 65, 85, 0.3);
        }

        /* Horizontal Rule */
        .markdown-preview hr {
          border: none;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(100, 116, 139, 0.5), transparent);
          margin: 2em 0;
        }

        /* Images */
        .markdown-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5em 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        /* Checkbox Lists */
        .markdown-preview input[type="checkbox"] {
          margin-right: 0.5em;
          accent-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
