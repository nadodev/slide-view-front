/**
 * @fileoverview Hook para persistência de slides
 * Refatorado para usar core
 */

import { useEffect } from "react";
import { Slide, parseMarkdown, saveSlides, loadSlides } from "../core";

export function useSlidesPersistence(
  slides: Slide[],
  setSlides: (slides: Slide[]) => void,
  setShowSlideList: (value: boolean) => void,
) {
  // Salva slides quando mudam
  useEffect(() => {
    try {
      if (slides.length > 0) {
        // Salva apenas os dados essenciais (sem HTML)
        const payload = slides.map((slide) => ({
          name: slide.name,
          content: slide.content,
          notes: slide.notes || [],
        }));
        saveSlides(payload as Slide[]);
      }
    } catch {
      /* ignore persistence errors */
    }
  }, [slides]);

  // Carrega slides ao iniciar
  useEffect(() => {
    try {
      const stored = loadSlides();
      if (stored.length > 0) {
        // Regenera o HTML ao carregar
        const loaded = stored.map((item) => {
          const { html } = parseMarkdown(item.content || "");
          return {
            name: item.name,
            content: item.content,
            notes: item.notes || [],
            html,
          };
        });
        setSlides(loaded);
        setShowSlideList(true);
      }
    } catch {
      /* ignore */
    }
  }, [setSlides, setShowSlideList]);
}
