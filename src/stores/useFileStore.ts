/**
 * @fileoverview Store para gerenciamento de arquivos Markdown
 * Refatorado para usar tipos do core
 */

import { create } from 'zustand';
import type { MarkdownFile } from '../core';

// ============================================
// TYPES
// ============================================

interface FileStoreState {
  files: MarkdownFile[];
  activeFileId: string;
  
  // Actions
  addFile: () => void;
  removeFile: (id: string) => void;
  updateFileName: (id: string, newName: string) => void;
  updateFileContent: (id: string, content: string) => void;
  setActiveFileId: (id: string) => void;
  setFiles: (files: MarkdownFile[]) => void;
  resetFiles: () => void;
  
  // Selectors
  getActiveFile: () => MarkdownFile | undefined;
  getFilesWithContent: () => MarkdownFile[];
}

// ============================================
// HELPERS
// ============================================

const createNewFile = (files: MarkdownFile[]): MarkdownFile => ({
  id: Date.now().toString(),
  name: `slide-${files.length + 1}.md`,
  content: '',
});

const ensureMdExtension = (name: string): string => {
  return name.endsWith('.md') ? name : `${name}.md`;
};

// ============================================
// STORE
// ============================================

const DEFAULT_FILE: MarkdownFile = { id: '1', name: 'slide-1.md', content: '' };

export const useFileStore = create<FileStoreState>((set, get) => ({
  files: [DEFAULT_FILE],
  activeFileId: '1',

  addFile: () => {
    const newFile = createNewFile(get().files);
    set((state) => ({
      files: [...state.files, newFile],
      activeFileId: newFile.id,
    }));
  },

  removeFile: (id: string) => {
    const { files, activeFileId } = get();
    
    // Não permite remover o último arquivo
    if (files.length <= 1) return;
    
    const newFiles = files.filter(f => f.id !== id);
    const needsNewActive = activeFileId === id;
    
    set({
      files: newFiles,
      activeFileId: needsNewActive ? newFiles[0]?.id || '1' : activeFileId,
    });
  },

  updateFileName: (id: string, newName: string) => {
    set((state) => ({
      files: state.files.map(f =>
        f.id === id ? { ...f, name: ensureMdExtension(newName) } : f
      ),
    }));
  },

  updateFileContent: (id: string, content: string) => {
    set((state) => ({
      files: state.files.map(f =>
        f.id === id ? { ...f, content } : f
      ),
    }));
  },

  setActiveFileId: (id: string) => {
    set({ activeFileId: id });
  },

  setFiles: (files: MarkdownFile[]) => {
    set({
      files,
      activeFileId: files[0]?.id || '1',
    });
  },

  resetFiles: () => {
    set({
      files: [DEFAULT_FILE],
      activeFileId: '1',
    });
  },

  getActiveFile: () => {
    const { files, activeFileId } = get();
    return files.find(f => f.id === activeFileId);
  },

  getFilesWithContent: () => {
    return get().files.filter(f => f.content.trim());
  },
}));
