/**
 * @fileoverview Store para estado da UI
 * Gerencia modais, painéis e estados visuais
 */

import { create } from 'zustand';

// ============================================
// TYPES
// ============================================

interface UIStoreState {
  // Modals
  showHelp: boolean;
  showTemplates: boolean;
  showExport: boolean;
  showGitHub: boolean;
  showDrafts: boolean;
  showVersionHistory: boolean;
  
  // Editor UI
  showPreview: boolean;
  editorFocus: boolean;
  
  // Modal Actions
  setShowHelp: (show: boolean) => void;
  setShowTemplates: (show: boolean) => void;
  setShowExport: (show: boolean) => void;
  setShowGitHub: (show: boolean) => void;
  setShowDrafts: (show: boolean) => void;
  setShowVersionHistory: (show: boolean) => void;
  
  // Editor Actions
  setShowPreview: (show: boolean) => void;
  setEditorFocus: (focus: boolean) => void;
  
  // Toggles
  toggleShowPreview: () => void;
  toggleEditorFocus: () => void;
  toggleShowHelp: () => void;
  toggleShowTemplates: () => void;
  
  // Utils
  closeAllModals: () => void;
  resetUI: () => void;
}

// ============================================
// STORE
// ============================================

const initialState = {
  showHelp: false,
  showTemplates: false,
  showExport: false,
  showGitHub: false,
  showDrafts: false,
  showVersionHistory: false,
  showPreview: true,
  editorFocus: false,
};

export const useUIStore = create<UIStoreState>((set) => ({
  ...initialState,

  // Modal Setters
  setShowHelp: (showHelp) => set({ showHelp }),
  setShowTemplates: (showTemplates) => set({ showTemplates }),
  setShowExport: (showExport) => set({ showExport }),
  setShowGitHub: (showGitHub) => set({ showGitHub }),
  setShowDrafts: (showDrafts) => set({ showDrafts }),
  setShowVersionHistory: (showVersionHistory) => set({ showVersionHistory }),
  
  // Editor Setters
  setShowPreview: (showPreview) => set({ showPreview }),
  setEditorFocus: (editorFocus) => set({ editorFocus }),

  // Toggles
  toggleShowPreview: () => set((s) => ({ showPreview: !s.showPreview })),
  toggleEditorFocus: () => set((s) => ({ editorFocus: !s.editorFocus })),
  toggleShowHelp: () => set((s) => ({ showHelp: !s.showHelp })),
  toggleShowTemplates: () => set((s) => ({ showTemplates: !s.showTemplates })),

  // Utils
  closeAllModals: () => set({
    showHelp: false,
    showTemplates: false,
    showExport: false,
    showGitHub: false,
    showDrafts: false,
    showVersionHistory: false,
  }),
  
  resetUI: () => set(initialState),
}));
