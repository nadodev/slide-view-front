/**
 * @fileoverview Markdown Service
 * @deprecated Use as funções diretamente de '../../core'
 */

// Re-exporta todas as funções do core para compatibilidade
export { 
  applyMarkdownFormat,
  insertSlashCommand,
  shouldShowSlashMenu,
} from '../../core';

// insertTemplate não foi movido para o core ainda, mantemos aqui
export const insertTemplate = (
  content: string,
  start: number,
  end: number,
  templateContent: string
): { newContent: string; newCursorPos: number } => {
  const newContent = content.substring(0, start) + templateContent + content.substring(end);
  const newCursorPos = start + templateContent.length;
  return { newContent, newCursorPos };
};
