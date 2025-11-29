/**
 * @fileoverview Store para gerenciamento de apresentações
 * Preparado para integração com API Laravel
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Slide, parseMarkdown, STORAGE_KEYS } from '../core';

// ============================================
// TYPES
// ============================================

interface PresentationStoreState {
  // State
  slides: Slide[];
  currentSlide: number;
  isLoading: boolean;
  error: string | null;
  
  // Presentation Mode
  showSlideList: boolean;
  presenterMode: boolean;
  focusMode: boolean;
  highContrast: boolean;
  
  // Actions - Slides
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide) => void;
  updateSlide: (index: number, content: string) => void;
  removeSlide: (index: number) => void;
  duplicateSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  clearSlides: () => void;
  
  // Actions - Navigation
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  
  // Actions - Modes
  setShowSlideList: (show: boolean) => void;
  setPresenterMode: (enabled: boolean) => void;
  setFocusMode: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  togglePresenterMode: () => void;
  toggleFocusMode: () => void;
  toggleHighContrast: () => void;
  
  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Selectors
  getCurrentSlide: () => Slide | undefined;
  hasSlides: () => boolean;
  getTotalSlides: () => number;
  
  // Reset
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  slides: [] as Slide[],
  currentSlide: 0,
  isLoading: false,
  error: null as string | null,
  showSlideList: false,
  presenterMode: false,
  focusMode: false,
  highContrast: false,
};

// ============================================
// STORE
// ============================================

export const usePresentationStore = create<PresentationStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============================================
      // SLIDES ACTIONS
      // ============================================

      setSlides: (slides) => set({ slides, currentSlide: 0 }),

      addSlide: (slide) => set((state) => ({
        slides: [...state.slides, slide],
      })),

      updateSlide: (index, content) => set((state) => {
        const slides = [...state.slides];
        if (slides[index]) {
          const { html } = parseMarkdown(content);
          slides[index] = { ...slides[index], content, html };
        }
        return { slides };
      }),

      removeSlide: (index) => set((state) => {
        if (state.slides.length <= 1) return state;
        
        const slides = state.slides.filter((_, i) => i !== index);
        const currentSlide = Math.min(state.currentSlide, slides.length - 1);
        
        return { slides, currentSlide };
      }),

      duplicateSlide: (index) => set((state) => {
        const source = state.slides[index];
        if (!source) return state;
        
        const duplicate: Slide = {
          ...source,
          name: `${source.name}-copia`,
          notes: source.notes ? [...source.notes] : [],
        };
        
        const slides = [...state.slides];
        slides.splice(index + 1, 0, duplicate);
        
        return { slides, currentSlide: index + 1 };
      }),

      reorderSlides: (fromIndex, toIndex) => set((state) => {
        if (fromIndex === toIndex) return state;
        
        const slides = [...state.slides];
        const [moved] = slides.splice(fromIndex, 1);
        slides.splice(toIndex, 0, moved);
        
        let currentSlide = state.currentSlide;
        if (currentSlide === fromIndex) {
          currentSlide = toIndex;
        } else if (currentSlide > fromIndex && currentSlide <= toIndex) {
          currentSlide--;
        } else if (currentSlide < fromIndex && currentSlide >= toIndex) {
          currentSlide++;
        }
        
        return { slides, currentSlide };
      }),

      clearSlides: () => set({ slides: [], currentSlide: 0 }),

      // ============================================
      // NAVIGATION ACTIONS
      // ============================================

      setCurrentSlide: (index) => set((state) => ({
        currentSlide: Math.max(0, Math.min(index, state.slides.length - 1)),
      })),

      nextSlide: () => set((state) => ({
        currentSlide: Math.min(state.currentSlide + 1, state.slides.length - 1),
      })),

      prevSlide: () => set((state) => ({
        currentSlide: Math.max(state.currentSlide - 1, 0),
      })),

      goToFirst: () => set({ currentSlide: 0 }),

      goToLast: () => set((state) => ({
        currentSlide: Math.max(0, state.slides.length - 1),
      })),

      // ============================================
      // MODE ACTIONS
      // ============================================

      setShowSlideList: (show) => set({ showSlideList: show }),
      setPresenterMode: (enabled) => set({ presenterMode: enabled }),
      setFocusMode: (enabled) => set({ focusMode: enabled }),
      setHighContrast: (enabled) => set({ highContrast: enabled }),

      togglePresenterMode: () => set((state) => ({ 
        presenterMode: !state.presenterMode 
      })),
      
      toggleFocusMode: () => set((state) => ({ 
        focusMode: !state.focusMode 
      })),
      
      toggleHighContrast: () => set((state) => ({ 
        highContrast: !state.highContrast 
      })),

      // ============================================
      // LOADING ACTIONS
      // ============================================

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // ============================================
      // SELECTORS
      // ============================================

      getCurrentSlide: () => {
        const { slides, currentSlide } = get();
        return slides[currentSlide];
      },

      hasSlides: () => get().slides.length > 0,

      getTotalSlides: () => get().slides.length,

      // ============================================
      // RESET
      // ============================================

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.SLIDES,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persiste apenas o essencial
        slides: state.slides.map(s => ({
          name: s.name,
          content: s.content,
          notes: s.notes,
        })),
        highContrast: state.highContrast,
      }),
      onRehydrate: () => {
        // Regenera HTML ao carregar do storage
        return (state) => {
          if (state?.slides) {
            state.slides = state.slides.map(slide => {
              const { html } = parseMarkdown(slide.content || '');
              return { ...slide, html };
            });
          }
        };
      },
    }
  )
);

// ============================================
// HOOKS UTILITÁRIOS
// ============================================

/** Hook para navegação de slides */
export const useSlideNavigation = () => {
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const totalSlides = usePresentationStore((s) => s.slides.length);
  const nextSlide = usePresentationStore((s) => s.nextSlide);
  const prevSlide = usePresentationStore((s) => s.prevSlide);
  const goToFirst = usePresentationStore((s) => s.goToFirst);
  const goToLast = usePresentationStore((s) => s.goToLast);
  const setCurrentSlide = usePresentationStore((s) => s.setCurrentSlide);

  return {
    currentSlide,
    totalSlides,
    hasNext: currentSlide < totalSlides - 1,
    hasPrev: currentSlide > 0,
    nextSlide,
    prevSlide,
    goToFirst,
    goToLast,
    goTo: setCurrentSlide,
  };
};

/** Hook para modos de apresentação */
export const usePresentationModes = () => {
  const presenterMode = usePresentationStore((s) => s.presenterMode);
  const focusMode = usePresentationStore((s) => s.focusMode);
  const highContrast = usePresentationStore((s) => s.highContrast);
  const togglePresenterMode = usePresentationStore((s) => s.togglePresenterMode);
  const toggleFocusMode = usePresentationStore((s) => s.toggleFocusMode);
  const toggleHighContrast = usePresentationStore((s) => s.toggleHighContrast);

  return {
    presenterMode,
    focusMode,
    highContrast,
    togglePresenterMode,
    toggleFocusMode,
    toggleHighContrast,
  };
};

