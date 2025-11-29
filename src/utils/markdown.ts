/**
 * @fileoverview Wrapper para compatibilidade retroativa
 * @deprecated Use `import { parseMarkdown } from '../core'` diretamente
 * 
 * Este arquivo será removido em versões futuras.
 * Migre seus imports para usar core/utils/markdown.utils
 */

import { parseMarkdown } from '../core';

// Re-exporta a função do core com o nome antigo para compatibilidade
export function parseMarkdownSafe(md: string = ''): string {
  const { html } = parseMarkdown(md);
  return html;
}

export default parseMarkdownSafe;
