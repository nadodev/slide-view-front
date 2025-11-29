/**
 * @fileoverview Hook para gerenciamento de slides
 * Refatorado para usar core
 */

import { useState, useCallback, type ChangeEvent } from "react";
import { 
  Slide, 
  extractNotes, 
  parseMarkdown,
  splitMarkdownByDelimiter,
  EDITOR_CONFIG,
  ERROR_MESSAGES,
} from "../core";
import {
  createSlideFromMarkdown,
  generateSlidesWithGemini,
} from "../utils/gemini";

// ============================================
// TYPES
// ============================================

type FileChange =
  | ChangeEvent<HTMLInputElement>
  | { target?: { files?: FileList | File[] } }
  | null;

type UploadOptions = {
  splitSingle?: boolean;
  delimiter?: string;
  error?: string;
};

// ============================================
// HOOK
// ============================================

export function useSlidesManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showSlideList, setShowSlideList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // ============================================
  // ACTIONS
  // ============================================

  const resetSlidesState = useCallback(() => {
    setSlides([]);
    setCurrentSlide(0);
    setShowSlideList(false);
    setError("");
    setWarning("");
    setLoading(false);
  }, []);

  const handleFileUpload = useCallback(
    async (event: FileChange, options: UploadOptions = {}) => {
      if (options?.error) {
        setError(options.error);
        return;
      }

      const inputFiles = event?.target?.files;
      const files = inputFiles ? Array.from(inputFiles as FileList) : [];
      if (files.length === 0) return;

      setLoading(true);
      setError("");

      try {
        // Handle single file with split option
        if (files.length === 1 && options.splitSingle) {
          const file = files[0];
          const raw = await file.text();
          const delimiter = options.delimiter || EDITOR_CONFIG.DEFAULT_DELIMITER;
          
          const slidesParts = splitMarkdownByDelimiter(raw, delimiter);

          if (slidesParts.length <= 1) {
            setError(ERROR_MESSAGES.DELIMITER_NOT_FOUND);
            setLoading(false);
            return;
          }

          setWarning("");
          const loadedSlides = slidesParts.map((content, index) => {
            const { clean, notes } = extractNotes(content);
            const { html } = parseMarkdown(clean);
            return {
              name: `${file.name.replace(".md", "")}-${index + 1}`,
              content: clean,
              notes,
              html,
            } as Slide;
          });

          setSlides(loadedSlides);
          setCurrentSlide(0);
          setShowSlideList(true);
          return;
        }

        // Handle multiple files
        const sortedFiles = files.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        const loadedSlides = await Promise.all(
          sortedFiles.map(async (file) => {
            const raw = await file.text();
            const { clean, notes } = extractNotes(raw);
            const { html } = parseMarkdown(clean);
            return {
              name: file.name.replace(".md", ""),
              content: clean,
              notes,
              html,
            } as Slide;
          }),
        );

        setSlides(loadedSlides);
        setCurrentSlide(0);
        setShowSlideList(true);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : String(err ?? "Erro desconhecido");
        setError("Erro ao carregar arquivos: " + message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleAIGeneration = useCallback(
    async (prompt: string, slideCount = 6, baseText?: string) => {
      setLoading(true);
      setError("");
      setWarning("");

      try {
        const generatedSlides = await generateSlidesWithGemini(
          prompt,
          slideCount,
          baseText,
        );

        const newSlides = generatedSlides.map((markdown, index) =>
          createSlideFromMarkdown(markdown, index),
        );

        const processedSlides = newSlides.map((slide) => {
          const { html } = parseMarkdown(slide.content || "");
          return { ...slide, html };
        });

        setSlides(processedSlides);
        setCurrentSlide(0);
        setWarning(
          `✨ ${processedSlides.length} slides gerados com sucesso usando IA Gemini!`,
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Problema na conexão com a IA";
        setError(`Erro ao gerar slides: ${message}`);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const duplicateSlide = useCallback(() => {
    setSlides((prev) => {
      if (prev.length === 0) return prev;
      const current = prev[currentSlide];
      if (!current) return prev;
      const duplicate: Slide = {
        name: `${current.name}-copia`,
        content: current.content,
        notes: current.notes ? [...current.notes] : [],
        html: current.html,
      };
      const next = [...prev];
      next.splice(currentSlide + 1, 0, duplicate);
      setCurrentSlide(currentSlide + 1);
      return next;
    });
  }, [currentSlide]);

  const saveSlideToFile = useCallback(
    async (index: number, content: string) => {
      try {
        const slide = slides[index];
        if (!slide) return;
        const supportsFS =
          typeof window !== "undefined" &&
          "showSaveFilePicker" in (window as typeof window & { showSaveFilePicker: () => Promise<unknown> });

        if (supportsFS) {
          let handle = slide._fileHandle;
          if (!handle) {
            handle = await (window as unknown as { showSaveFilePicker: (options: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
              suggestedName: slide.name?.endsWith(".md")
                ? slide.name
                : `${slide.name || "slide"}.md`,
              types: [
                { description: "Markdown", accept: { "text/markdown": [".md"] } },
                { description: "Text", accept: { "text/plain": [".txt"] } },
              ],
            });
            setSlides((prev) => {
              const copy = prev.slice();
              if (copy[index]) copy[index]._fileHandle = handle;
              return copy;
            });
          }
          const writable = await handle.createWritable();
          await writable.write(content);
          await writable.close();
        } else {
          const blob = new Blob([content], { type: "text/markdown" });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = slide.name?.endsWith(".md")
            ? slide.name
            : `${slide.name || "slide"}.md`;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        console.warn("Falha ao salvar arquivo:", err);
        setWarning(ERROR_MESSAGES.SAVE_FAILED);
        setTimeout(() => setWarning(""), 4000);
      }
    },
    [slides],
  );

  const saveAllSlidesToFile = useCallback(async () => {
    if (slides.length === 0) return;
    const combined = slides
      .map((slide) => slide.content || "")
      .join(`\n\n${EDITOR_CONFIG.DEFAULT_DELIMITER}\n\n`);

    try {
      const supportsFS =
        typeof window !== "undefined" &&
        "showSaveFilePicker" in (window as typeof window & { showSaveFilePicker: () => Promise<unknown> });

      if (supportsFS) {
        const handle = await (window as unknown as { showSaveFilePicker: (options: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: "apresentacao-completa.md",
          types: [
            { description: "Markdown", accept: { "text/markdown": [".md"] } },
            { description: "Text", accept: { "text/plain": [".txt"] } },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(combined);
        await writable.close();
        setWarning(
          `✨ Apresentação completa salva com ${slides.length} slides!`,
        );
      } else {
        const blob = new Blob([combined], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "apresentacao-completa.md";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        setWarning(
          `✨ Download iniciado! Apresentação com ${slides.length} slides.`,
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err ?? "Erro ao salvar");
      setError("Erro ao salvar o arquivo: " + message);
    }
  }, [slides]);

  const exportCombinedMarkdown = useCallback(() => {
    if (!slides.length) return;
    const combined = slides
      .map((slide) => slide.content)
      .join(`\n\n${EDITOR_CONFIG.DEFAULT_DELIMITER}\n\n`);
    const blob = new Blob([combined], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "apresentacao-combinada.md";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, [slides]);

  const exportSlideAsPdf = useCallback(
    (index: number) => {
      try {
        const slide = slides[index];
        if (!slide) return;
        const slideHtml = slide.html || "";
        const popup = window.open("", "_blank");
        if (!popup) {
          setWarning(
            "Não foi possível abrir nova janela para exportar. Bloqueador de pop-ups?",
          );
          setTimeout(() => setWarning(""), 4000);
          return;
        }

        const doc = popup.document;
        doc.open();
        doc.write(
          '<!doctype html><html><head><meta charset="utf-8"><title>Slide - ' +
          (slide.name || index + 1) +
          "</title>",
        );

        Array.from(
          document.querySelectorAll('link[rel="stylesheet"], style'),
        ).forEach((node) => {
          if (node.tagName.toLowerCase() === "link") {
            const href = (node as HTMLLinkElement).href;
            try {
              const parsed = new URL(href, window.location.href);
              if (parsed.origin === window.location.origin) {
                doc.write('<link rel="stylesheet" href="' + parsed.href + '">');
              }
            } catch {
              /* ignore */
            }
          } else if (node.tagName.toLowerCase() === "style") {
            doc.write("<style>" + (node.textContent || "") + "</style>");
          }
        });

        doc.write(
          "<style>html,body{height:100%;margin:0;padding:0;background:#fff;}@page{size:auto;margin:12mm;}body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; } .slide-container{box-shadow:none !important;} .navigation, .thumbs-rail, .editor-overlay, .editor-panel, .presenter-bar { display: none !important; } .presentation-main{display:block;} </style>",
        );
        doc.write("</head><body>");
        doc.write('<div class="presentation-container">');
        doc.write('<div class="presentation-with-thumbs">');
        doc.write('<div class="presentation-main">');
        doc.write('<div class="slide-container">');
        doc.write('<div class="slide-content">');
        doc.write(slideHtml);
        doc.write("</div></div></div></div></div>");
        doc.write("</body></html>");
        doc.close();

        setTimeout(() => {
          try {
            popup.focus();
            popup.print();
          } catch (err) {
            console.warn("Erro ao imprimir slide:", err);
          }
        }, 900);
      } catch (err) {
        console.warn("Erro ao exportar slide para PDF", err);
        setWarning("Erro ao exportar slide como PDF.");
        setTimeout(() => setWarning(""), 4000);
      }
    },
    [slides],
  );

  const reorderSlides = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      setSlides((prevSlides) => {
        const newSlides = [...prevSlides];
        const [movedSlide] = newSlides.splice(fromIndex, 1);
        newSlides.splice(toIndex, 0, movedSlide);
        return newSlides;
      });

      if (currentSlide === fromIndex) {
        setCurrentSlide(toIndex);
      } else if (currentSlide > fromIndex && currentSlide <= toIndex) {
        setCurrentSlide(currentSlide - 1);
      } else if (currentSlide < fromIndex && currentSlide >= toIndex) {
        setCurrentSlide(currentSlide + 1);
      }
    },
    [currentSlide],
  );

  // ============================================
  // RETURN
  // ============================================

  return {
    slides,
    setSlides,
    currentSlide,
    setCurrentSlide,
    showSlideList,
    setShowSlideList,
    loading,
    setLoading,
    error,
    setError,
    warning,
    setWarning,
    handleFileUpload,
    handleAIGeneration,
    duplicateSlide,
    reorderSlides,
    saveSlideToFile,
    saveAllSlidesToFile,
    exportCombinedMarkdown,
    exportSlideAsPdf,
    resetSlidesState,
  };
}
