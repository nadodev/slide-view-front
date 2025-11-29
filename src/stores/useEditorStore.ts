/**
 * @fileoverview Store para estado do editor
 * Refatorado para usar tipos do core
 */

import { create } from 'zustand';
import type { EditorMode } from '../core';

// ============================================
// TYPES
// ============================================

interface EditorStoreState {
  content: string;
  mode: EditorMode;
  isDirty: boolean;
  
  // Actions
  setContent: (content: string) => void;
  setMode: (mode: EditorMode) => void;
  setDirty: (dirty: boolean) => void;
  resetEditor: () => void;
}

// ============================================
// STORE
// ============================================

const initialState = {
  content: '',
  mode: 'edit' as EditorMode,
  isDirty: false,
};

export const useEditorStore = create<EditorStoreState>((set) => ({
  ...initialState,

  setContent: (content) => set({ content, isDirty: true }),
  
  setMode: (mode) => set({ mode }),
  
  setDirty: (isDirty) => set({ isDirty }),

  resetEditor: () => set(initialState),
}));
