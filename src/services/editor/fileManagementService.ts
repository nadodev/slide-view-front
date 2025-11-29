/**
 * @fileoverview File Management Service
 * @deprecated A lógica foi movida para useFileStore.
 * Use `import { MarkdownFile } from '../../core'` para o tipo.
 */

export type { MarkdownFile } from '../../core';

// As funções abaixo foram movidas para useFileStore
// Mantidas aqui apenas para compatibilidade retroativa

import type { MarkdownFile } from '../../core';

/** @deprecated Use useFileStore.addFile() */
export const addNewFile = (files: MarkdownFile[]): MarkdownFile[] => {
  const newId = Date.now().toString();
  return [...files, { id: newId, name: `slide-${files.length + 1}.md`, content: '' }];
};

/** @deprecated Use useFileStore.removeFile() */
export const removeFile = (files: MarkdownFile[], id: string): MarkdownFile[] => {
  if (files.length === 1) return files;
  return files.filter(f => f.id !== id);
};

/** @deprecated Use useFileStore.updateFileName() */
export const updateFileName = (files: MarkdownFile[], id: string, newName: string): MarkdownFile[] => {
  return files.map(f =>
    f.id === id ? { ...f, name: newName.endsWith('.md') ? newName : `${newName}.md` } : f
  );
};

/** @deprecated Use useFileStore.updateFileContent() */
export const updateFileContent = (files: MarkdownFile[], id: string, content: string): MarkdownFile[] => {
  return files.map(f => f.id === id ? { ...f, content } : f);
};

/** @deprecated Lógica movida para useFileStore */
export const getNewActiveFileId = (files: MarkdownFile[], removedId: string, currentActiveId: string): string => {
  if (currentActiveId !== removedId) return currentActiveId;
  const newFiles = removeFile(files, removedId);
  return newFiles[0]?.id || '1';
};
