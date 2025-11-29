/**
 * @fileoverview Hook para gerenciamento de slides
 * Versão refatorada do useSlidesManager com Clean Code
 */

import { useState, useCallback, useMemo } from 'react';
import { presentationRepository } from '../api';
import { 
  extractNotes, 
  parseMarkdown, 
  splitMarkdownByDelimiter,
  createSlideFromContent,
  combineSlidesToMarkdown 
} from '../utils';
import { EDITOR_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config';
import type { Slide, FileUploadOptions } from '../types';

// ============================================
// TYPES
// ============================================

interface UseSlidesReturn {
  // State
  slides: Slide[];
  currentSlide: number;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  
  // Setters
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  
  // Actions
  loadSlides: () => Promise<void>;
  saveSlides: () => Promise<void>;
  clearSlides: () => void;
  uploadFiles: (files: FileList | File[], options?: FileUploadOptions) => Promise<void>;
  generateWithAI: (prompt: string, count?: number, baseText?: string) => Promise<void>;
  duplicateSlide: (index?: number) => void;
  removeSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  updateSlideContent: (index: number, content: string) => void;
  exportToFile: (index?: number) => Promise<void>;
  exportAll: () => Promise<void>;
  
  // Utils
  getSlideHtml: (index: number) => string;
  hasSlides: boolean;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useSlides(): UseSlidesReturn {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // ============================================
  // MEMOIZED VALUES
  // ============================================

  const hasSlides = useMemo(() => slides.length > 0, [slides.length]);

  // ============================================
  // HELPERS
  // ============================================

  const clearMessages = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  }, []);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  }, []);

  // ============================================
  // SLIDE MANAGEMENT
  // ============================================

  const loadSlides = useCallback(async () => {
    setIsLoading(true);
    clearMessages();
    
    try {
      const loaded = await presentationRepository.getSlides();
      setSlides(loaded);
    } catch (err) {
      showError(ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages, showError]);

  const saveSlides = useCallback(async () => {
    try {
      await presentationRepository.saveSlides(slides);
      showMessage(SUCCESS_MESSAGES.SLIDES_SAVED);
    } catch (err) {
      showError(ERROR_MESSAGES.SAVE_FAILED);
    }
  }, [slides, showError, showMessage]);

  const clearSlides = useCallback(() => {
    setSlides([]);
    setCurrentSlide(0);
    clearMessages();
    presentationRepository.clearSlides();
  }, [clearMessages]);

  // ============================================
  // FILE UPLOAD
  // ============================================

  const uploadFiles = useCallback(async (
    files: FileList | File[],
    options: FileUploadOptions = {}
  ) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsLoading(true);
    clearMessages();

    try {
      // Single file with split option
      if (fileArray.length === 1 && options.splitSingle) {
        const file = fileArray[0];
        const content = await file.text();
        const parts = splitMarkdownByDelimiter(
          content, 
          options.delimiter || EDITOR_CONFIG.DEFAULT_DELIMITER
        );

        if (parts.length <= 1) {
          showError(ERROR_MESSAGES.DELIMITER_NOT_FOUND);
          setIsLoading(false);
          return;
        }

        const newSlides = parts.map((part, index) => 
          createSlideFromContent(part, file.name, index)
        );

        setSlides(newSlides);
        setCurrentSlide(0);
        showMessage(SUCCESS_MESSAGES.SLIDES_LOADED(newSlides.length));
        return;
      }

      // Multiple files
      const sortedFiles = fileArray.sort((a, b) => a.name.localeCompare(b.name));
      const newSlides = await Promise.all(
        sortedFiles.map(async (file) => {
          const content = await file.text();
          return createSlideFromContent(content, file.name);
        })
      );

      setSlides(newSlides);
      setCurrentSlide(0);
      showMessage(SUCCESS_MESSAGES.SLIDES_LOADED(newSlides.length));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC;
      showError(`Erro ao carregar arquivos: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages, showError, showMessage]);

  // ============================================
  // AI GENERATION
  // ============================================

  const generateWithAI = useCallback(async (
    prompt: string,
    count: number = 6,
    baseText?: string
  ) => {
    setIsLoading(true);
    clearMessages();

    try {
      // Import dinâmico para não carregar gemini se não usar
      const { generateSlidesWithGemini, createSlideFromMarkdown } = await import('../../utils/gemini');
      
      const generated = await generateSlidesWithGemini(prompt, count, baseText);
      const newSlides = generated.map((markdown, index) => {
        const slide = createSlideFromMarkdown(markdown, index);
        const { html } = parseMarkdown(slide.content || '');
        return { ...slide, html };
      });

      setSlides(newSlides);
      setCurrentSlide(0);
      showMessage(SUCCESS_MESSAGES.AI_GENERATED(newSlides.length));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.AI_GENERATION_FAILED;
      showError(`Erro ao gerar slides: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [clearMessages, showError, showMessage]);

  // ============================================
  // SLIDE OPERATIONS
  // ============================================

  const duplicateSlide = useCallback((index?: number) => {
    const targetIndex = index ?? currentSlide;
    
    setSlides(prev => {
      if (prev.length === 0 || targetIndex >= prev.length) return prev;
      
      const source = prev[targetIndex];
      const duplicate: Slide = {
        ...source,
        name: `${source.name}-copia`,
        notes: source.notes ? [...source.notes] : [],
      };
      
      const newSlides = [...prev];
      newSlides.splice(targetIndex + 1, 0, duplicate);
      return newSlides;
    });
    
    setCurrentSlide(prev => prev + 1);
  }, [currentSlide]);

  const removeSlide = useCallback((index: number) => {
    setSlides(prev => {
      if (index < 0 || index >= prev.length) return prev;
      
      const newSlides = prev.filter((_, i) => i !== index);
      
      // Ajusta currentSlide se necessário
      setCurrentSlide(curr => 
        Math.min(curr, Math.max(0, newSlides.length - 1))
      );
      
      return newSlides;
    });
  }, []);

  const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setSlides(prev => {
      const newSlides = [...prev];
      const [moved] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, moved);
      return newSlides;
    });

    // Ajusta currentSlide
    setCurrentSlide(curr => {
      if (curr === fromIndex) return toIndex;
      if (curr > fromIndex && curr <= toIndex) return curr - 1;
      if (curr < fromIndex && curr >= toIndex) return curr + 1;
      return curr;
    });
  }, []);

  const updateSlideContent = useCallback((index: number, content: string) => {
    setSlides(prev => {
      const newSlides = [...prev];
      if (newSlides[index]) {
        const { clean, notes } = extractNotes(content);
        const { html } = parseMarkdown(clean);
        
        newSlides[index] = {
          ...newSlides[index],
          content: clean,
          notes,
          html,
        };
      }
      return newSlides;
    });
  }, []);

  // ============================================
  // EXPORT
  // ============================================

  const exportToFile = useCallback(async (index?: number) => {
    const targetIndex = index ?? currentSlide;
    const slide = slides[targetIndex];
    if (!slide) return;

    try {
      const supportsFS = 'showSaveFilePicker' in window;
      const filename = slide.name?.endsWith('.md') ? slide.name : `${slide.name || 'slide'}.md`;

      if (supportsFS) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [
            { description: 'Markdown', accept: { 'text/markdown': ['.md'] } },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(slide.content);
        await writable.close();
      } else {
        const blob = new Blob([slide.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }

      showMessage(SUCCESS_MESSAGES.FILE_EXPORTED);
    } catch (err) {
      showError(ERROR_MESSAGES.SAVE_FAILED);
    }
  }, [currentSlide, slides, showError, showMessage]);

  const exportAll = useCallback(async () => {
    if (slides.length === 0) return;

    try {
      const combined = combineSlidesToMarkdown(slides);
      const supportsFS = 'showSaveFilePicker' in window;

      if (supportsFS) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: 'apresentacao-completa.md',
          types: [
            { description: 'Markdown', accept: { 'text/markdown': ['.md'] } },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(combined);
        await writable.close();
      } else {
        const blob = new Blob([combined], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'apresentacao-completa.md';
        anchor.click();
        URL.revokeObjectURL(url);
      }

      showMessage(`✨ Apresentação com ${slides.length} slides exportada!`);
    } catch (err) {
      showError(ERROR_MESSAGES.SAVE_FAILED);
    }
  }, [slides, showError, showMessage]);

  // ============================================
  // UTILS
  // ============================================

  const getSlideHtml = useCallback((index: number): string => {
    return slides[index]?.html || '';
  }, [slides]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    slides,
    currentSlide,
    isLoading,
    error,
    message,
    
    // Setters
    setSlides,
    setCurrentSlide,
    
    // Actions
    loadSlides,
    saveSlides,
    clearSlides,
    uploadFiles,
    generateWithAI,
    duplicateSlide,
    removeSlide,
    reorderSlides,
    updateSlideContent,
    exportToFile,
    exportAll,
    
    // Utils
    getSlideHtml,
    hasSlides,
  };
}

export default useSlides;

