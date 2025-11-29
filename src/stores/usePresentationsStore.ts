/**
 * @fileoverview Store para gerenciar apresentações do usuário
 */

import { create } from 'zustand';
import { presentationService, Presentation, SlideData, CreatePresentationData, UpdatePresentationData } from '../services/presentation';

interface PresentationsState {
  presentations: Presentation[];
  currentPresentation: Presentation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPresentations: () => Promise<void>;
  fetchPresentation: (id: number) => Promise<Presentation | null>;
  createPresentation: (data: CreatePresentationData) => Promise<Presentation | null>;
  updatePresentation: (id: number, data: UpdatePresentationData) => Promise<Presentation | null>;
  deletePresentation: (id: number) => Promise<boolean>;
  duplicatePresentation: (id: number) => Promise<Presentation | null>;
  
  // Slides
  saveSlides: (presentationId: number, slides: SlideData[]) => Promise<boolean>;
  
  // Local state
  setCurrentPresentation: (presentation: Presentation | null) => void;
  clearError: () => void;
}

export const usePresentationsStore = create<PresentationsState>((set, get) => ({
  presentations: [],
  currentPresentation: null,
  isLoading: false,
  error: null,

  fetchPresentations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await presentationService.list();
      set({ presentations: response.presentations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar apresentações',
        isLoading: false 
      });
    }
  },

  fetchPresentation: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await presentationService.get(id);
      set({ currentPresentation: response.presentation, isLoading: false });
      return response.presentation;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar apresentação',
        isLoading: false 
      });
      return null;
    }
  },

  createPresentation: async (data: CreatePresentationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await presentationService.create(data);
      set((state) => ({ 
        presentations: [response.presentation, ...state.presentations],
        currentPresentation: response.presentation,
        isLoading: false 
      }));
      return response.presentation;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar apresentação',
        isLoading: false 
      });
      return null;
    }
  },

  updatePresentation: async (id: number, data: UpdatePresentationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await presentationService.update(id, data);
      set((state) => ({ 
        presentations: state.presentations.map(p => 
          p.id === id ? response.presentation : p
        ),
        currentPresentation: state.currentPresentation?.id === id 
          ? response.presentation 
          : state.currentPresentation,
        isLoading: false 
      }));
      return response.presentation;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar apresentação',
        isLoading: false 
      });
      return null;
    }
  },

  deletePresentation: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await presentationService.delete(id);
      set((state) => ({ 
        presentations: state.presentations.filter(p => p.id !== id),
        currentPresentation: state.currentPresentation?.id === id 
          ? null 
          : state.currentPresentation,
        isLoading: false 
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar apresentação',
        isLoading: false 
      });
      return false;
    }
  },

  duplicatePresentation: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await presentationService.duplicate(id);
      set((state) => ({ 
        presentations: [response.presentation, ...state.presentations],
        isLoading: false 
      }));
      return response.presentation;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao duplicar apresentação',
        isLoading: false 
      });
      return null;
    }
  },

  saveSlides: async (presentationId: number, slides: SlideData[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await presentationService.updateSlides(presentationId, slides);
      set((state) => ({ 
        presentations: state.presentations.map(p => 
          p.id === presentationId ? response.presentation : p
        ),
        currentPresentation: state.currentPresentation?.id === presentationId 
          ? response.presentation 
          : state.currentPresentation,
        isLoading: false 
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao salvar slides',
        isLoading: false 
      });
      return false;
    }
  },

  setCurrentPresentation: (presentation) => set({ currentPresentation: presentation }),
  
  clearError: () => set({ error: null }),
}));

// Hook helper
export const usePresentations = () => usePresentationsStore();

